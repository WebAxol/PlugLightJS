import EntityManager from "../../../lib/Entity/Manager.js";

const entityManager = new EntityManager();
const n = 100;

for(let i = 1; i <= n; i++){

    test('type is registered correctly',() => {
        expect(entityManager.registerType(i + '', { a : '' })).toEqual(true);
    });

    test('properly detect invalid type name', () => {
        expect(entityManager.createEntity(i, { a : '' })).toEqual(false); 
    
    });  

    test('properly detect unexisting type name', () => {
        expect(entityManager.createEntity(i + 'notDefined', { a : '' })).toEqual(false); 
    
    });  

    test('properly create new Entity', () => {
        expect(typeof entityManager.createEntity(i + '', { a : '' })).toEqual('object'); 
    
    });  

}
