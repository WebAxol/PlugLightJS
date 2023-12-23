import EntityPool from "../../../src/EntityPool";

const entityPool = new EntityPool();
const n = 1;
// registerType

for(let i = 1; i <= n; i++){

    test('properly detect entity invalid type name', () => {
        expect(entityPool.registerType(i, { a : '' })).toEqual(false); 
    });  
    
    test('properly register entity type', () => {
        expect(entityPool.registerType(i + '' ,{ a : '' })).toEqual(true);
    });

}

for(let i = 1; i <= n; i++){

    // entity types from '1' to '200' already exist, so we expect false

    test('properly detect if entity type already exists', () => {
        expect(entityPool.registerType(i + '', { a : '' })).toEqual(false); 
    });  
}
