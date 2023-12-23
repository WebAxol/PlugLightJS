class EntityPool{

    #types;
    #pools;
    #Entity;
    #nextID;

    constructor(world){
        this.world = world;
        this.#types = {} // Type Object Pattern
        this.#pools = {} // Object Pool Pattern
        this.toBeRemoved = [];
        this.#nextID = 0;
        
        this.#Entity = class Entity{

            #type;
            #collections;
            #ID;

            constructor(typeName,prototype, ID){

                this._children = {};
                this.#collections = {};
                this.#type = typeName;
                this.#ID   = ID;

                if(!prototype['info']) return;

                Object.keys(prototype['info']).forEach((field) => {
                    
                    let _field =  prototype['info'][field];

                    if(typeof _field == 'object') this[field] = Object.assign({},_field); 

                    else this[field] = _field;
                });
                
            }

            getID(){
                return this.#ID;
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
            reset(prototype, newID){

                this.#ID = newID;

                Object.keys(prototype['info']).forEach((field) => {
                    let _field =  prototype['info'][field];
                    
                    if(typeof _field == 'object') this[field] = Object.assign({},_field); 
                    
                    else this[field] = _field;
                });
            }
        }
    }

    registerType(typeName,prototype){

        // Defensive input check

        if(typeof typeName !== 'string' || typeName == ''){
            console.error(`Cannot create agentType with a type name defined as: ${typeName}; the type must be a non-empty string`);
            return false;
        }   

        if(this.#types[typeName] != undefined){
            console.error(`The type named '${typeName}' has already been registered`);
            return false;
        }

        if(prototype == undefined){
            console.error('Prototype cannot be undefined, it must be a JSON with the attributes of the entity')
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
            console.error(`Cannot create entity with a type defined as: ${typeName}; the type must be a non-empty string`);
            return false;
        }   

        if(!this.#types[typeName]){
            console.error(`Cannot create entity with a type defined as: ${typeName}; the type doesn't exist at EntityPool`);
            return false;
        }

        if(details != undefined && typeof details  !== 'object'){
            console.error(`'details' must be an object`);
            return false;
        }

        //
        
        var world = this.world;
        var entity;
        
        if(this.#pools[typeName].length > 0){
            entity = this.#pools[typeName].pop();
            this.resetAgent(entity);
        }
        else{
            entity = new this.#Entity(typeName,this.#types[typeName],this.#nextID++);
        }

        if(!(details && details['info'])) return entity;
        
        Object.keys(details['info']).forEach((detail) => {

            if(details['info'][detail] != undefined){
                entity[detail] = details['info'][detail];
            }
        })

        // Defensive output type check

        if(!(entity instanceof this.#Entity)){
            console.error(`Something went wrong when creating a new Entity of type ${typeName}`);
            return false;
        }

        return entity;
    }

    getCollectionsOfType(typeName){

        if(!this.#types[typeName]){
            console.warn(`Cannot get collections from unexisting type '${typename}'`);
            return false;
        }

        let collections = this.#types[typeName].collections || [];

        return collections;
    }

    storeToBeRemoved(entity){
        this.toBeRemoved.push(entity);
    }

    removeAgent(entity){
        try{
            let agentType = entity.getType();
            let agentCollections = entity.getCollections();
            
            agentCollections.forEach((collectionName) => {
                this.world.removeFromCollection(collectionName,entity);
            });
            
            let agentChildren = Object.keys(entity._children);
            
            while(agentChildren.length){
                this.removeAgent(entity._children[agentChildren[0]]);
                delete entity._children[agentChildren[0]];
                agentChildren.shift();
            }

            this.#pools[agentType].push(entity);

        }catch(err){
            console.error(`Error removing entity ${entity}`);
            return false;
        }
    }

    removeAgents(){

        while(this.toBeRemoved.length){
            let entity = this.toBeRemoved.pop();
            this.removeAgent(entity);
        }
    }

    resetAgent(entity){
        let prototype = this.#types[entity.getType()];
        entity.reset(prototype, this.#nextID++);
    }
}

export default EntityPool;