import CollectionManager from "../../../src/CollectionManager";

const collectionManager = new CollectionManager();
const testNumber = 10;

for(let i = 0; i < testNumber; i++){
    
    test('properly creates new collection', () => {

        expect(typeof collectionManager.registerCollection('collection' + i)).toEqual('object');

    })

    test('properly detect existing collection when registering', () => {

        expect(collectionManager.registerCollection('collection' + i)).toEqual(false);

    })

    test('properly detects that collection does not exist', () => {

        expect(collectionManager.addToCollection('unexisting' + i)).toBe(false);
        
    });

    test('properly detects invalid value passed as agent', () => {

        expect(collectionManager.addToCollection('collection' + i, { isInCollection : () => {} })).toBe(false);
    
});
}