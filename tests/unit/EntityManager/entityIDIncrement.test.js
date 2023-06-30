"use strict";

import EntityManager from "../../../lib/Entity/Manager.js";

const entityManager = new EntityManager({});
const n = 100;


entityManager.registerType('dummy',{'info' : {}});

for(let i = 0; i < 100; i++){

    let entity   = entityManager.createEntity('dummy');
    let agentID = entity.getID();

    // When creating a new entity, its ID must equal the previous ID incremented by one

    test('incrementAgentID', () => {
        expect(agentID).toEqual(i);
    });

    // Remove agents randomly, to check if their ID is updated when they are reutilised
    
    if(Math.random() > 0.5) entityManager.removeEntity(entity);
}