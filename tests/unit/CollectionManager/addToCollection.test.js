import CollectionManager from "../../../src/CollectionManager.js";

const collectionManager = new CollectionManager();
const n = 100;

for(let i = 0; i < n; i++){
    
    test('properly creates new collection', () => {

        expect(typeof collectionManager.registerCollection('collection' + i)).toEqual('object');

    })

    test('properly detect existing collection when registering', () => {

        expect(collectionManager.registerCollection('collection' + i)).toEqual(false);

    })

    test('properly detects that collection does not exist', () => {

        expect(collectionManager.addToCollection('unexisting' + i)).toBe(false);
        
    });

    test('properly detects invalid value passed as entity', () => {

        expect(collectionManager.addToCollection('collection' + i, { isInCollection : () => {} })).toBe(false);
    
});
}