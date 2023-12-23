import EntityManager from "../../../src/EntityManager.js";

const entityPool = new EntityManager();

for(let i = 1; i <= 1; i++){

    test('type is registered correctly',() => {
        expect(entityPool.registerType(i + '', { a : '' })).toEqual(true);
    });

    test('properly detect invalid type name', () => {
        expect(entityPool.createAgent(i, { a : '' })).toEqual(false); 
    
    });  

    test('properly detect unexisting type name', () => {
        expect(entityPool.createAgent(i + 'notDefined', { a : '' })).toEqual(false); 
    
    });  

    test('properly create new Entity', () => {
        expect(typeof entityPool.createAgent(i + '', { a : '' })).toEqual('object'); 
    
    });  

}
