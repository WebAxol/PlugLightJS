import World from "./World.js";
import Service from "./Service.js";

class PackageManager {

    constructor(world){
        this.world = world;
        this.packages = {};
    }

    /**
     * 
     * @param {{
     *      entityTypes : {}
     *      collections : {}
     *      services    : {}     
     *      events      : {} 
     * }}
     *  setUp 
     * @returns { boolean }
     */

    initPackage(setUp){

        if(typeof setUp !== 'object'){
            console.error('The setUp argument must be an object');
            return false;
        }

        // Initialize components

        const packageName = setUp.packageName;

        if(!packageName){
            console.error('Could not initialize package: the package name must be a non-empty string');
            return false;
        }

        if(this.packages[packageName]){
            console.warn(`Package '${packageName}' already exists`);
            return false;
        }

        if(setUp.entityTypes ) this.#initAgentTypes(packageName,setUp.entityTypes);
        if(setUp.collections)  this.#initCollections(packageName,setUp.collections);
        if(setUp.services   )  this.#initServices(packageName,setUp.services);

        return true;
    }

    /**
     * 
     * @param { object } entityTypes 
     * @param { string} packageName 
     * @returns { boolean }
     */

    #initAgentTypes(packageName,entityTypes){

        if(typeof entityTypes != 'object'){
            console.error('Cannot initialize agent types: the were not passed as an object embedded at setUp');
            return false;
        }

        const types = Object.keys(entityTypes); 

        types.forEach((typeName) => {

            let prototype = entityTypes[typeName];

            if(typeof prototype != 'object'){
                console.error('Each type must be a key value pair, mapping each type with a prototype for each object instanced with that type');
                return false;
            }

            this.world.registerEntityType(`${packageName}-${typeName}`, prototype);
        });

        return true;
    }

    /**
     * 
     * @param { Array } collections 
     * @param { string} packageName 
     * @returns { boolean }
     */

    #initCollections(packageName,collections){
        
        if(!(collections instanceof Array)){
            console.error("The field 'collections' must be a string array with the names of each collection");
            return false;
        }

        collections.forEach( collectionName => {

            let registered = false;

            if(typeof collectionName == 'string' && collectionName != '') registered = this.world.registerCollection(`${packageName}-${collectionName}`);

            if(!registered) console.error(`Collection named: '${collectionName}' could not be registered`);
        });


        return true;
    }

    /**
     * 
     * @param { object } services 
     * @param { string} packageName 
     * @returns { boolean }
     */

    #initServices(packageName,services){

        if(typeof services != 'object'){
            console.error('Cannot initialize services: the were not passed as an object embedded at setUp');
            return false;
        }

        const serviceNames = Object.keys(services); 

        serviceNames.forEach((serviceName) => {

            let serviceInstance = services[serviceName];

            if(!(serviceInstance instanceof Service)){
                console.error(`Cannot register service: "${serviceName}": it must be a key value pair, mapping each service name with an instance of its respective service`);
            }

            this.world.registerService(`${packageName}-${serviceName}`, serviceInstance);

        });

        return true;
    }
}

export default PackageManager;