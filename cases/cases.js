class Service{

    constructor(){
        this.world = new World();
    }

    execute(){
        return false;
    }

    init(){
        return false;
    }
}

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

class CollectionManager {

    #collections;

    constructor(world){
        this.world = world;
        this.#collections = {};
        this.toBeRemoved  = [];
        this._objectPool   = []; // Only for internal use
    }

    registerCollection(name){

        if(this.#collections[name]){
            console.warn(`Collection named '${name}' already registered`);
            return false;
        }

        this.#collections[name] = [];
        return this;
    }

    getCollection(collectionName){

        if(this.#collections[collectionName]){
            return this.#collections[collectionName];
        }

        console.warn(`Cannot get unregistered collection '${collectionName}'`)
        return false;
    }

    addToCollection(collectionName,object){

        if(!this.#collections[collectionName]){
            console.warn(`collection named '${collectionName} is not registered'`);
            return false;
        }

        if(object.isInCollection(collectionName)){
            throw Error(`The agent is already registered to collection ${collectionName}`);
            return false;
        }

        this.#collections[collectionName].push(object);
        object.addCollection(collectionName);
    }

    cacheToBeRemoved(collectionName,agent){

        var data;

        if(this._objectPool.length > 0){
            data = this._objectPool.pop();
            data.collectionName = collectionName;
            data.agent = agent;

            this.toBeRemoved.push(data);
        }
        else{
            this.toBeRemoved.push({
                collectionName : collectionName,
                agent : agent
            });
        }
    }

    removeFromCollection(collectionName,object){

        let index = this.#collections[collectionName].indexOf(object);
        this.#collections[collectionName].splice(index,1);
        object.removeCollection(collectionName);
    }

    removeAgentsFromCollections(){

        while(this.toBeRemoved.length > 0){
            let command = this.toBeRemoved.pop();
            this.removeFromCollection(command.collectionName,command.agent);

            command.collectionName = undefined;
            command.agent = undefined;

            this._objectPool.push(command);
        }
    }
}

class AgentPool{

    #types;
    #pools;

    constructor(world){
        this.world = world;
        this.#types = {} // Type Object Pattern
        this.#pools = {} // Object Pool Pattern
        this.toBeRemoved = [];
    }

    registerType(typeName,prototype){

        if(this.#types[typeName]){
            console.warn(`The type named '${typeName}' has already been registered`);
            return false;
        }

        this.#types[typeName] = prototype;
        this.#pools[typeName] = [];
    }


    createAgent(typeName,details){

        var world = this.world;

        // Agent class is within AgentPool class, so that only AgentPool can instantiate Agents

        class Agent{

            #type;
            #collections;

            constructor(typeName,prototype){

                this._children = {};
                this.#collections = {};
                this.#type = typeName;

                if(prototype['info']){

                    Object.keys(prototype['info']).forEach((field) => {
                        let _field =  prototype['info'][field];

                        if(typeof _field == 'object'){
                            this[field] = Object.assign({},_field); 
                        }
                        else{
                            this[field] = _field;
                        }
                    });
                }
            }

            getType(){
                return this.#type;
            }

            isInCollection(collectionName){
                return this.#collections[collectionName];
            }

            getCollections(){
                return Object.keys(this.#collections);
            }

            addCollection(collectionName){
                this.#collections[collectionName] = 1;
            }
            removeCollection(collectionName){
                delete this.#collections[collectionName];
            }
            reset(prototype){

                Object.keys(prototype['info']).forEach((field) => {
                    let _field =  prototype['info'][field];
                        if(typeof _field == 'object'){
                        this[field] = Object.assign({},_field); 
                    }
                    else{
                        this[field] = _field;
                    }
                });
            }
        }

        var agent =  new Agent(typeName,this.#types[typeName]);
        
        if(this.#pools[typeName].length > 0){
            agent = this.#pools[typeName].pop();
            this.resetAgent(agent);
        }
        else{
            agent = new Agent(typeName,this.#types[typeName]);
        }
        
        Object.keys(details['info']).forEach((detail) => {

            if(details['info'][detail] != undefined){
                agent[detail] = details['info'][detail];
            }
        })

        return agent;
    }

    getCollectionsOfType(typeName){

        if(!this.#types[typeName]){
            console.warn(`Cannot get collections from unexisting type '${typename}'`);
            return false;
        }

        let collections = this.#types[typeName].collections || [];

        return collections;
    }

    storeToBeRemoved(agent){
        this.toBeRemoved.push(agent);
    }

    removeAgent(agent){
        try{

            let agentType = agent.getType();
            let agentCollections = agent.getCollections();
            
            agentCollections.forEach((collectionName) => {
                this.world.removeFromCollection(collectionName,agent);
            });
            
            let agentChildren = Object.keys(agent._children);
            
            while(agentChildren.length){
                this.removeAgent(agent._children[agentChildren[0]]);
                delete agent._children[agentChildren[0]];
                agentChildren.shift();
            }

            this.#pools[agentType].push(agent);

        }catch(err){
            throw Error(`Error, agent ${agent}`);
        }
    }

    removeAgents(){

        while(this.toBeRemoved.length){
            let agent = this.toBeRemoved.pop();
            this.removeAgent(agent);
        }
    }

    resetAgent(agent){
        let prototype = this.#types[agent.getType()];
        agent.reset(prototype);
    }
}

class World {

    #agentPool;
    #collectionManager;
    #serviceManager;
    #eventManager;

    constructor(){

         // subordinate modules

        this.#agentPool         = new AgentPool(this);
        this.#collectionManager = new CollectionManager(this);
        this.#eventManager      = new EventManager(this);
        this.#serviceManager    = new ServiceManager(this);

        //Iteration

        this.frame = 0;
        this.routine = () => {};
        this.pause = false;
    }

    registerService(name,service){
        return this.#serviceManager.registerService(name,service);
    }

    getServices(){
        return this.#serviceManager.getServices();
    }

    getService(serviceName){
        return this.#serviceManager.getService(serviceName);
    }

    registerCollection(name){
        return this.#collectionManager.registerCollection(name);
    }

    getCollection(collectionName){
        return this.#collectionManager.getCollection(collectionName);
    }


    addToCollection(collectionName,object){
        return this.#collectionManager.addToCollection(collectionName,object);
    }

    removeFromCollection(collectionName,object){
        return this.#collectionManager.cacheToBeRemoved(collectionName,object);
    }

    registerAgentType(typeName,prototype){
        this.#agentPool.registerType(typeName,prototype);
    }

    createAgent(typeName,details){

        let agent = this.#agentPool.createAgent(typeName,details);
        let collections = this.#agentPool.getCollectionsOfType(typeName);

        collections.forEach((collection) => {
            this.addToCollection(collection, agent);
        });

        return agent;
    }

    removeAgent(agent){
        this.#agentPool.storeToBeRemoved(agent);
    }

    registerEvent(eventName){
        this.#eventManager.registerEvent(eventName);
    }

    registerServiceToEvent(serviceName,eventName){
        this.#eventManager.registerServiceToEvent(serviceName,eventName);
    }

    notifyEvent(eventName,details){
        this.#eventManager.notifyToServices(eventName,details);
    }

    execute(){
        

        if(this.pause){
            return;
        }

        requestAnimationFrame(() => { this.execute() });

        this.#agentPool.removeAgents();
        this.#collectionManager.removeAgentsFromCollections();
        var services = this.getServices();

        Object.keys(services).forEach((service) => {
                services[service].execute();
         });

        if(!this.pause){
            this.frame++;
            this.routine(this);
        }
    }

    pauseExecution(){
        this.pause = true;
    }
}