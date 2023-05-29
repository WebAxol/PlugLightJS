<h1> 🔌 PlugLightJS 💡</h1>

Note: The framework still needs more work and testing to be ready for production.

<h2><b>Introduction</b></h2>

CASES is a simple javascript framework designed to easily build data-driven applications with a modular approach. Below, we can see a diagram representing the general architecture of the framework:

![alt text](https://github.com/WebAxol/CASES/blob/main/img/architecture.png)


<b>💾 Data concepts and conventions utilized:</b>

- Event: Represents something of interest that has occurred, which is notified to observers (services subscribed to that event).

- Collection: Stores similar objects to be processed in a specific way.

- Agent: Object that is built based on a specific defined prototype, based on its type.

- Pool: Container of unused objects, which await for them to be reutilized when a new object is required.


- World: Executive high level module, which integrates the rest of subordinate modules, pawning specific tasks to them and controlling the execution of services. 
