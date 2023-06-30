import World from "./../World.js";
import Entity from "./../Entity/Entity.js";

class CollectionManager {

    public collections  : { [name : string] : Entity[] } 
    public world        : World;
    public toBeRemoved  : { collectionName : string, entity : Entity }[];
    public _objectPool  : Entity[];

    constructor(world){
        this.world = world;
        this.collections = {};
        this.toBeRemoved  = [];
        this._objectPool   = []; // Only for internal use
    }

    public registerCollection(collectionName :string){

        // Defensive input check

        if(typeof collectionName !== 'string' || collectionName == ''){
            console.error(`Cannot register collection with a name defined as: ${collectionName}; the name must be a non-empty string`);
            return false;
        }   

        if(this.collections[collectionName]){
            console.error(`Collection named '${collectionName}' already registered`);
            return false;
        }

        this.collections[collectionName] = [];
        
        return this;
    }

    public getCollection(collectionName :string){

        if(this.collections[collectionName]){
            return this.collections[collectionName];
        }

        console.error(`Cannot get unregistered collection '${collectionName}'`)
        return false;
    }

    public addToCollection(collectionName :string, object : Entity){

        // Defensive input check 

        if(!this.collections[collectionName]){
            console.error(`collection named '${collectionName} is not registered'`);
            return false;
        }

        if(typeof object != 'object' || !object.isInCollection || !object.addCollection ){
            console.error(`The value passed as 'entity' is not a valid Entity object ${collectionName}`);
            return false;
        }
       
        if(object.isInCollection && object.isInCollection(collectionName)){
            console.error(`The entity is already registered to collection ${collectionName}`);
            return false;
        }

        //

        this.collections[collectionName].push(object);
        object.addCollection(collectionName);

        return true;
    }

    public cacheToBeRemoved(collectionName :string , entity : Entity){

        var data;

        if(this._objectPool.length > 0){
            data = this._objectPool.pop();
            data.collectionName = collectionName;
            data.entity = entity;

            this.toBeRemoved.push(data);
        }
        else{
            this.toBeRemoved.push({
                collectionName : collectionName,
                entity : entity
            });
        }
    }

    public removeFromCollection(collectionName :string, object :Entity){

        let index = this.collections[collectionName].indexOf(object);
        this.collections[collectionName].splice(index,1);
        object.removeCollection(collectionName);
    }

    public removeAgentsFromCollections(){

        while(this.toBeRemoved.length > 0){
            
            let item :any = this.toBeRemoved.pop();

            this.removeFromCollection(item.collectionName,item.entity);

            item.collectionName = undefined;
            item.entity = undefined;

            this._objectPool.push(item);
        }
    }
}

export default CollectionManager;