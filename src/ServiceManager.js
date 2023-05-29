class ServiceManager {

    #services;

    constructor(world){
        this.world = world;
        this.#services = {};
    }

    registerService(name,service){

        // Defensive input check

        if(typeof name !== 'string' || name == ''){
            throw Error(`Cannot register service with a name defined as: ${typeName}; the name must be a non-empty string`);
            return false;
        }   

        if(this.#services[name]){
            throw Error(`Service named '${name}' already registered`);
            return false;
        }

        if(!service || service == null){
            throw Error(`Cannot register invalid or null service '${name}'`);
            return false;
        }

        //

        service.world = this.world;
        this.#services[name] = service;
        this.#services[name].init();

        return true;
    }

    getServices(){
        return this.#services;
    }

    getService(serviceName){

        if(!this.#services[serviceName]){
            throw Error(`Cannot get unregistered service '${serviceName}'`);
            return false;
        }

        return this.#services[serviceName];
    }
}

export default ServiceManager;