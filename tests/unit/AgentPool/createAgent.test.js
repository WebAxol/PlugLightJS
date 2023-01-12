import AgentPool from "../../../src/AgentPool";

const agentPool = new AgentPool();

for(let i = 1; i <= 1; i++){

    test('type is registered correctly',() => {
        expect(agentPool.registerType(i + '', { a : '' })).toEqual(true);
    });

    test('properly detect invalid type name', () => {
        expect(agentPool.createAgent(i, { a : '' })).toEqual(false); 
    
    });  

    test('properly detect unexisting type name', () => {
        expect(agentPool.createAgent(i + 'notDefined', { a : '' })).toEqual(false); 
    
    });  

    test('properly create new Agent', () => {
        expect(typeof agentPool.createAgent(i + '', { a : '' })).toEqual('object'); 
    
    });  

}
