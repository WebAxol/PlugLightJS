import EntityPrototype from './Prototype';
class Entity{

    private type : string;
    private ID : number;
    private collections : { [name : string] : true };
    public _children    : { [name :string] : Entity };

    constructor(typeName,prototype, ID){

        this._children = {};
        this.collections = {};
        this.type = typeName;
        this.ID = ID;

        if(!prototype['info']) return;

        Object.keys(prototype['info']).forEach((field) => {
            
            let _field =  prototype['info'][field];

            if(typeof _field == 'object') this[field] = Object.assign({},_field); 

            else this[field] = _field;
        });
    }

    public getID(){
        return this.ID;
    }

    public getType(){
        return this.type;
    }

    public isInCollection(collectionName : string) :(true | null) {
        return this.collections[collectionName];
    }

    public get getCollections() :string[] {
        return Object.keys(this.collections);
    }

    public addCollection(collectionName :string){
        this.collections[collectionName] = true;
    }
    
    public removeCollection(collectionName :string){
        delete this.collections[collectionName];
    }

    public reset(prototype :EntityPrototype , newID :number){

        this.ID = newID;

        Object.keys(prototype['info']).forEach((field) => {
            let _field =  prototype['info'][field];
            
            if(typeof _field == 'object') this[field] = Object.assign({},_field); 
            
            else this[field] = _field;
        });
    }
}

export default Entity;