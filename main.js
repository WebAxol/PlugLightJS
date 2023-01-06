import AgentPool from "./src/AgentPool.js";
import World from "./src/World.js";

const app = new World();

// used for testing

console.log('executing main');

/* --- Test AgentPool ---*/

exports.registerAgentType = () =>{

}

var typeCreated  = app.registerAgentType('TypeA',{});
var agent        = app.createAgent('TypeA');

console.log(typeCreated);
console.log(agent);

/*--- Test CollectionManager ---*/

/*
app.registerCollection('CollectionA');
app.createAgent
app.addToCollection('CollectionA',{});


console.log(app.getCollection('CollectionA'));
*/