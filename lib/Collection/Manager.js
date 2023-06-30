class CollectionManager {
    constructor(world) {
        this.world = world;
        this.collections = {};
        this.toBeRemoved = [];
        this._objectPool = []; // Only for internal use
    }
    registerCollection(collectionName) {
        // Defensive input check
        if (typeof collectionName !== 'string' || collectionName == '') {
            console.error(`Cannot register collection with a name defined as: ${collectionName}; the name must be a non-empty string`);
            return false;
        }
        if (this.collections[collectionName]) {
            console.error(`Collection named '${collectionName}' already registered`);
            return false;
        }
        this.collections[collectionName] = [];
        return this;
    }
    getCollection(collectionName) {
        if (this.collections[collectionName]) {
            return this.collections[collectionName];
        }
        console.error(`Cannot get unregistered collection '${collectionName}'`);
        return false;
    }
    addToCollection(collectionName, object) {
        // Defensive input check 
        if (!this.collections[collectionName]) {
            console.error(`collection named '${collectionName} is not registered'`);
            return false;
        }
        if (typeof object != 'object' || !object.isInCollection || !object.addCollection) {
            console.error(`The value passed as 'entity' is not a valid Entity object ${collectionName}`);
            return false;
        }
        if (object.isInCollection && object.isInCollection(collectionName)) {
            console.error(`The entity is already registered to collection ${collectionName}`);
            return false;
        }
        //
        this.collections[collectionName].push(object);
        object.addCollection(collectionName);
        return true;
    }
    cacheToBeRemoved(collectionName, entity) {
        var data;
        if (this._objectPool.length > 0) {
            data = this._objectPool.pop();
            data.collectionName = collectionName;
            data.entity = entity;
            this.toBeRemoved.push(data);
        }
        else {
            this.toBeRemoved.push({
                collectionName: collectionName,
                entity: entity
            });
        }
    }
    removeFromCollection(collectionName, object) {
        let index = this.collections[collectionName].indexOf(object);
        this.collections[collectionName].splice(index, 1);
        object.removeCollection(collectionName);
    }
    removeAgentsFromCollections() {
        while (this.toBeRemoved.length > 0) {
            let item = this.toBeRemoved.pop();
            this.removeFromCollection(item.collectionName, item.entity);
            item.collectionName = undefined;
            item.entity = undefined;
            this._objectPool.push(item);
        }
    }
}
export default CollectionManager;
//# sourceMappingURL=Manager.js.map