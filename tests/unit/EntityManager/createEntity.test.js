import EntityManager from "../../../src/EntityManager.js";

const entityManager = new EntityManager();

for(let i = 1; i <= 1; i++){

    test('type is registered correctly',() => {
        expect(entityManager.registerType(i + '', { a : '' })).toEqual(true);
    });

    test('properly detect invalid type name', () => {
        expect(entityManager.createAgent(i, { a : '' })).toEqual(false); 
    
    });  

    test('properly detect unexisting type name', () => {
        expect(entityManager.createAgent(i + 'notDefined', { a : '' })).toEqual(false); 
    
    });  

    test('properly create new Entity', () => {
        expect(typeof entityManager.createAgent(i + '', { a : '' })).toEqual('object'); 
    
    });  

}
