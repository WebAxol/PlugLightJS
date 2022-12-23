class EventManager{

    constructor(world){
        this.world  = world;
        this.events = {};
    }

    registerEvent(eventName){

        if(this.events[eventName]){
            console.warn(`Event named '${eventName} has already been registered'`);
            return false;
        }

        this.events[eventName] = {};
    }

    registerServiceToEvent(serviceName,eventName){

        if(!this.events[eventName]){
            console.warn(`Cannot register service '${serviceName}' to unregistered event '${eventName}'`);
            return false;
        }

        var service = this.world.getService(serviceName)

        if(!service){
            console.warn(`Cannot register service '${serviceName}' to event, because the service is not registered to the framework`);
            return false;
        }

        if(typeof service[`on${eventName}`] != 'function'){
            console.warn(`Cannot register service '${serviceName}' to event, because the service does not have a method 'on${eventName}'`);
            return false;
        }

        this.events[eventName][serviceName] = service;
    }

    notifyToServices(eventName, details = undefined){

        if(!this.events[eventName]){
            console.warn(`Cannot notify event '${eventName}' because it does not exist`);
            return false;
        }
        WORLD.getService('AgentBehaviour')
        var services = Object.keys(this.events[eventName]);

        services.forEach((serviceName) => { 
            this.world.getService(serviceName)[`on${eventName}`](details);
        });
    }


}