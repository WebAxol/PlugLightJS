CASES

Introduction

A simple javascript framework designed to easily build data-driven applications with a modular approach

Main Components:

-CollectionManager (class)
-AgentPool (class)
-Service (class)
-EventManager (class)
-ServiceManager (class)

-World (class)

Data concepts utilized:

-Event: Represents something of interest that has occurred, which is notified to observers (services subscribed to that event).

-Collection: Stores similar objects to be processed in a specific way.

-Agent: Object that is built based on a specific defined prototype, based on its type.

-Pool: Container of unused objects, which await for them to be reutilized when a new object is required.


World: Executive high level module, which integrates the rest of subordinate modules, pawning specific tasks to them and controlling the execution of services. 

It provides methods which are used to access submodules like AgentPool, EventManager, etc.

AgentPool: 
