import World from '../World.js';

class Service{

    public world : World;

    constructor(){
        this.world = new World();
    }

    public execute(){
        return false;
    }

    public init(){
        return false;
    }
}

export default Service;