class Entity{

    #type;
    #collections;
    #ID;

    /**
    *@param {string} typeName
    *@param {Object} prototype
    *@param {number} ID 
    */

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

export default Entity;