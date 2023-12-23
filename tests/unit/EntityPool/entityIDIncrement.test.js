"use strict";

import EntityPool from "../../../src/EntityPool.js";
const entityPool = new EntityPool({});

entityPool.registerType('dummy',{'info' : {}});

for(let i = 0; i < 500; i++){

    let entity   = entityPool.createAgent('dummy');
    let agentID = entity.getID();

    // When creating a new entity, its ID must equal the previous ID incremented by one

    test('incrementAgentID', () => {
        expect(agentID).toEqual(i);
    });

    // Remove agents randomly, to check if their ID is updated when they are reutilised
    
    if(Math.random() > 0.5) entityPool.removeAgent(entity);
}