import World from "./World.js";

class EventManager{

    /**
     * 
     * @param {World} world 
     */

    constructor(world){
        this.world  = world;
        this.events = {};
    }

    /**
     * 
     * @param {string} eventName 
     * @returns {boolean} 
     */

    registerEvent(eventName){

        if(typeof eventName !== 'string' || eventName == ''){
            console.error(`Invalid event name passed as attribute: it must be a non-empty string`);
            return false;
        }

        if(this.events[eventName]){
            console.error(`Event named '${eventName} has already been registered'`);
            return false;
        }

        this.events[eventName] = {};
        return true;
    }

    /**
     * 
     * @param {string} serviceName 
     * @param {string} eventName 
     * @returns {boolean}
     */

    registerServiceToEvent(serviceName,eventName){

        if(!this.events[eventName]){
            console.error(`Cannot register service '${serviceName}' to unregistered event '${eventName}'`);
            return false;
        }

        var service = this.world.getService(serviceName)

        if(!service){
            console.error(`Cannot register service '${serviceName}' to event, because the service is not registered to the framework`);
            return false;
        }

        if(typeof service[`on${eventName}`] != 'function'){
            console.error(`Cannot register service '${serviceName}' to event, because the service does not have a method 'on${eventName}'`);
            return false;
        }

        this.events[eventName][serviceName] = service;
        return true;
    }

    /**
     * 
     * @param {string} eventName 
     * @param {object} details 
     * @returns {boolean}
     */

    notifyToServices(eventName, details = undefined){

        if(!this.events[eventName]){
            console.error(`Cannot notify event '${eventName}' because it does not exist`);
            return false;
        }

        var services = Object.keys(this.events[eventName]);

        try{
            
            services.forEach((serviceName) => { 
                this.world.getService(serviceName)[`on${eventName}`](details);
            });

        }catch(err){
            console.error(err);
            return false;
        }

        return true;
    }
}

export default EventManager;