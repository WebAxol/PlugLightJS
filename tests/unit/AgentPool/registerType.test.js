import AgentPool from "../../../src/AgentPool";

const agentPool = new AgentPool();
const n = 1;
// registerType

for(let i = 1; i <= n; i++){

    test('properly detect agent invalid type name', () => {
        expect(agentPool.registerType(i, { a : '' })).toEqual(false); 
    });  
    
    test('properly register agent type', () => {
        expect(agentPool.registerType(i + '' ,{ a : '' })).toEqual(true);
    });

}

for(let i = 1; i <= n; i++){

    // agent types from '1' to '200' already exist, so we expect false

    test('properly detect if agent type already exists', () => {
        expect(agentPool.registerType(i + '', { a : '' })).toEqual(false); 
    });  
}
