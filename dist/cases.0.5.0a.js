class AgentPool {

    #types;
    #pools;
    #Agent;

    constructor(world){
        this.world = world;
        this.#types = {} // Type Object Pattern
        this.#pools = {} // Object Pool Pattern
        this.toBeRemoved = [];

        //  Agent class is embedded so that only AgentPool can instantiate Agents
        
        this.#Agent = class Agent{

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
    }

    registerType(typeName,prototype){

        // Defensive input check

        if(typeof typeName !== 'string' || typeName == ''){
            throw Error(`Cannot create agentType with a type name defined as: ${typeName}; the type must be a non-empty string`);
            return false;
        }   

        if(this.#types[typeName] != undefined){
            throw Error(`The type named '${typeName}' has already been registered`);
            return false;
        }

        if(prototype == undefined){
            throw Error('Prototype cannot be undefined, it must be a JSON with the attributes of the agent')
            return false;
        }

        //

        this.#types[typeName] = prototype;
        this.#pools[typeName] = [];

        return true;
    }


    createAgent(typeName,details = undefined){

        // Defensive input check

        if(typeof typeName !== 'string' || typeName == ''){
            throw Error(`Cannot create agent with a type defined as: ${typeName}; the type must be a non-empty string`);
            return false;
        }   

        console.log(this.#types);

        if(!this.#types[typeName]){
            throw Error(`Cannot create agent with a type defined as: ${typeName}; the type doesn't exist at AgentPool`);
            return false;
        }

        if(details != undefined && typeof details  !== 'object'){
            throw Error(`'details' must be an object`);
            return false;
        }

        //
        
        var world = this.world;
        var agent;
        
        if(this.#pools[typeName].length > 0){
            agent = this.#pools[typeName].pop();
            this.resetAgent(agent);
        }
        else{
            agent = new this.#Agent(typeName,this.#types[typeName]);
        }

        if(!(details && details['info'])) return agent;
        
        Object.keys(details['info']).forEach((detail) => {

            if(details['info'][detail] != undefined){
                agent[detail] = details['info'][detail];
            }
        })

        // Defensive output type check

        if(!(agent instanceof this.#Agent)){
            throw Error(`Something went wrong when creating a new Agent of type ${typeName}`);
            return false;
        }

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
            return false;
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

class CollectionManager {

    #collections;

    constructor(world){
        this.world = world;
        this.#collections = {};
        this.toBeRemoved  = [];
        this._objectPool   = []; // Only for internal use
    }

    registerCollection(name){

        // Defensive input check

        if(typeof name !== 'string' || name == ''){
            throw Error(`Cannot register collection with a name defined as: ${typeName}; the name must be a non-empty string`);
            return false;
        }   

        if(this.#collections[name]){
            throw Error(`Collection named '${name}' already registered`);
            return false;
        }

        //

        this.#collections[name] = [];
        return this;collection
    }

    getCollection(collectionName){

        if(this.#collections[collectionName]){
            return this.#collections[collectionName];
        }

        throw Error(`Cannot get unregistered collection '${collectionName}'`)
        return false;
    }

    addToCollection(collectionName,object = undefined){

        // Defensive input check 

        if(!this.#collections[collectionName]){
            throw Error(`collection named '${collectionName} is not registered'`);
            return false;
        }

        if(typeof object != 'object' || !object.isInCollection || !object.addCollection ){
            throw Error(`The value passed as 'agent' is not a valid Agent object ${collectionName}`);
            return false;
        }
       
        if(object.isInCollection || object.isInCollection(collectionName)){
            throw Error(`The agent is already registered to collection ${collectionName}`);
            return false;
        }

        //

        this.#collections[collectionName].push(object);
        object.addCollection(collectionName);

        return true;
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
        return this.#agentPool.registerType(typeName,prototype);
    }

    createAgent(typeName,details = undefined){

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