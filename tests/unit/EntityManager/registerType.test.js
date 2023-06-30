import EntityManager from "../../../lib/Entity/Manager.js";

const entityManager = new EntityManager();
const n = 100;

// registerType

for(let i = 1; i <= n; i++){

    test('properly detect entity invalid type name', () => {
        expect(entityManager.registerType(i, { a : '' })).toEqual(false); 
    });  
    
    test('properly register entity type', () => {
        expect(entityManager.registerType(i + '' ,{ a : '' })).toEqual(true);
    });

}

for(let i = 1; i <= n; i++){

    // entity types from '1' to 'n' already exist, so we expect false

    test('properly detect if entity type already exists', () => {
        expect(entityManager.registerType(i + '', { a : '' })).toEqual(false); 
    });  
}
