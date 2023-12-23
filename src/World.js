import EntityManager from "./EntityManager.js";
import CollectionManager from "./CollectionManager.js";
import EventManager from "./EventManager.js";
import Service from "./Service.js";
import ServiceManager from "./ServiceManager.js";

class World {

    #entityPool;
    #collectionManager;
    #serviceManager;
    #eventManager;

    constructor(){

         // subordinate modules

        this.#entityPool        = new EntityManager(this);
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
        return this.#entityPool.registerType(typeName,prototype);
    }

    createAgent(typeName,details = undefined){

        let entity = this.#entityPool.createAgent(typeName,details);
        
        /*

        let collections = this.#entityPool.getCollectionsOfType(typeName);

        collections.forEach((collection) => {
            this.addToCollection(collection, entity);
        });

        */

        return entity;
    }

    removeAgent(entity){
        this.#entityPool.storeToBeRemoved(entity);
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

        this.#entityPool.removeAgents();
        this.#collectionManager.removeAgentsFromCollections();
        var services = this.getServices();

        Object.keys(services).forEach((service) => {
                services[service].execute();
        });


        this.frame++;
        this.routine();
        
        requestAnimationFrame(() => { this.execute() });

    }

    pauseExecution(){
        this.pause = true;
    }
}

export default World;