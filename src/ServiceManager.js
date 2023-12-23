import Service from "./Service.js";

class ServiceManager {

    #services;

    constructor(world){
        this.world = world;
        this.#services = {};
    }

    /**
     * 
     * @param {string} name 
     * @param {Service} service 
     * @returns {boolean}
     */

    registerService(name,service){

        // Defensive input check

        if(typeof name !== 'string' || name == ''){
            console.error(`Cannot register service with a name defined as: ${typeName}; the name must be a non-empty string`);
            return false;
        }   

        if(this.#services[name]){
            console.error(`Service named '${name}' already registered`);
            return false;
        }

        if(!service || service == null){
            console.error(`Cannot register invalid or null service '${name}'`);
            return false;
        }

        if(!(service instanceof Service)){
            console.error(`The service argument must be an instance of 'Service' or of a sub-class`);
            return false;
        }

        //

        service.world = this.world;
        this.#services[name] = service;
        this.#services[name].init();

        return true;
    }

    /**
     * Get all services
     * @returns {Services[]}
     */

    getServices(){
        return this.#services;
    }

    /**
     * 
     * @param {string} serviceName 
     * @returns {Service || false}
     */

    getService(serviceName){

        if(typeof serviceName !== 'string' || serviceName == ''){
            console.error(`Cannot get service '${serviceName}'; the name provided is invalid: it must be a non-empty string`);
            return false;
        }

        if(!this.#services[serviceName]){
            console.error(`Cannot get unregistered service '${serviceName}'`);
            return false;
        }

        return this.#services[serviceName];
    }
}

export default ServiceManager;