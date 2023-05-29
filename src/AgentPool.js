class AgentPool{

    #types;
    #pools;
    #Agent;
    #nextID;

    constructor(world){
        this.world = world;
        this.#types = {} // Type Object Pattern
        this.#pools = {} // Object Pool Pattern
        this.toBeRemoved = [];
        this.#nextID = 0;
        
        this.#Agent = class Agent{

            #type;
            #collections;
            #ID;

            constructor(typeName,prototype, ID){

                this._children = {};
                this.#collections = {};
                this.#type = typeName;
                this.#ID   = ID;

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
            console.error(`Cannot create agentType with a type name defined as: ${typeName}; the type must be a non-empty string`);
            return false;
        }   

        if(this.#types[typeName] != undefined){
            console.error(`The type named '${typeName}' has already been registered`);
            return false;
        }

        if(prototype == undefined){
            console.error('Prototype cannot be undefined, it must be a JSON with the attributes of the agent')
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
            console.error(`Cannot create agent with a type defined as: ${typeName}; the type must be a non-empty string`);
            return false;
        }   

        if(!this.#types[typeName]){
            console.error(`Cannot create agent with a type defined as: ${typeName}; the type doesn't exist at AgentPool`);
            return false;
        }

        if(details != undefined && typeof details  !== 'object'){
            console.error(`'details' must be an object`);
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
            agent = new this.#Agent(typeName,this.#types[typeName],this.#nextID++);
        }

        if(!(details && details['info'])) return agent;
        
        Object.keys(details['info']).forEach((detail) => {

            if(details['info'][detail] != undefined){
                agent[detail] = details['info'][detail];
            }
        })

        // Defensive output type check

        if(!(agent instanceof this.#Agent)){
            console.error(`Something went wrong when creating a new Agent of type ${typeName}`);
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
            console.error(`Error, agent ${agent}`);
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
        agent.reset(prototype, this.#nextID++);
    }
}

export default AgentPool;