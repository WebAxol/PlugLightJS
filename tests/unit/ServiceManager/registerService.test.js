import World          from "../../../src/World.js";
import ServiceManager from "../../../src/ServiceManager.js";
import Service from "../../../src/Service.js";

const serviceManager = new ServiceManager(new World());
const services = [];

const n = 100;

class NotService {

    constructor(){
        this.world = undefined;
        this.attribute = 'attribute';
    }

    execute(){}
    init(){}
}

for(let i = 1; i <= n; i++){

    let service    = new Service();
    let notService = new NotService();

    test('properly register valid service instance', () => {
        expect( serviceManager.registerService(`service${i}`,service)).toEqual(true); 
    });  

    test('detect registered service by name and prevent duplication', () => {
        expect( serviceManager.registerService(`service${i}`,service)).toEqual(false); 
    });  

    test('detect invalid service parameter', () => {
        expect( serviceManager.registerService(`notService${i}`,notService)).toEqual(false); 
    });  

    
};