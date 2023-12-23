import World from "../../src/World.js";
import PackageManager from "../../src/PackageManager.js";
import Service from "../../src/Service.js";

const world = new World();
const packageManager = new PackageManager(world);

// Create package

const _package = {
    packageName : "test", 
    entityTypes : {
        'typeA' : {},
        'typeB' : {},        
        'typeC' : {}
    },
    collections : ['collectionA','collectionB','collectionC']
    ,
    services    : {
        'serviceA' : new Service(),
        'serviceB' : new Service(),
        'serviceC' : new Service()
    }
};

test('properly init package', () => {

    let init = packageManager.initPackage(_package);

    expect(init).toEqual(true);

    for (let type of Object.keys(_package.entityTypes)){

        expect(world.hasEntityType(`test-${type}`)).toEqual(true);
    }

    for (let service of Object.keys(_package.services)){

        expect(world.getService(`test-${service}`) instanceof Service).toEqual(true);
    }

    for (let collection of _package.collections){

        expect(world.getCollection(`test-${collection}`)).toEqual([]);
    }
});
