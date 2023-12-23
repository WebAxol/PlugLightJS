import World          from "../../../src/World.js";
import ServiceManager from "../../../src/ServiceManager.js";
import Service from "../../../src/Service.js";

const serviceManager = new ServiceManager(new World());
const n = 100;

for(let i = 1; i <= n; i++){
    serviceManager.registerService(`service${i}`, new Service());
}

for(let i = 1; i <= n; i++){

    test('properly get existing service by name', () => {
        expect(serviceManager.getService(`service${i}`) instanceof Service).toEqual(true); 
    });  

    test('retrieve false for unexisting service', () => {
        expect(serviceManager.getService(`notService${i}`) instanceof Service).toEqual(false); 
    });  
};

test('get all services registered so far', () => {

    const services = serviceManager.getServices(); 

    expect(typeof services == 'object').toEqual(true); 

    for(let i = 1; i <= n; i++){
    
        expect(services[`service${i}`] instanceof Service).toEqual(true);

    }

});  