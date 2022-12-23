class ServiceManager {

    #services;

    constructor(world){
        this.world = world;
        this.#services = {};
    }

    registerService(name,service){

        if(this.#services[name]){
            console.warn(`Service named '${name}' already registered`);
            return false;
        }

        if(!service || service == null){
            throw Error(`Cannot register invalid or null service '${name}'`);
        }

        service.world = this.world;
        this.#services[name] = service;
        this.#services[name].init();

    }

    getServices(){
        return this.#services;
    }

    getService(serviceName){

        if(this.#services[serviceName]){
            return this.#services[serviceName];
        }

        throw Error(`Cannot get unregistered service '${serviceName}'`)
    }
}