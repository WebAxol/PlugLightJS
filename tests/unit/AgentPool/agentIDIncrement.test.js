"use strict";

import AgentPool from "../../../src/AgentPool.js";
const agentPool = new AgentPool({});

agentPool.registerType('dummy',{'info' : {}});

for(let i = 0; i < 500; i++){

    let agent   = agentPool.createAgent('dummy');
    let agentID = agent.getID();

    // When creating a new agent, its ID must equal the previous ID incremented by one

    test('incrementAgentID', () => {
        expect(agentID).toEqual(i);
    });

    // Remove agents randomly, to check if their ID is updated when they are reutilised
    
    if(Math.random() > 0.5) agentPool.removeAgent(agent);
}