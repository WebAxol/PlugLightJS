class EntityPrototype {

    public collections :string[];
    public details  :{ [property :string] : any };

    constructor(info : { collections :string[] , details  :{ [property :string] : any } }){

        this.collections = info.collections;
        this.details     = info.details;

    }
}

export default EntityPrototype;