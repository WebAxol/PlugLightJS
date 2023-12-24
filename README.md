<div align="center">
<pre>
OooOOo.   o               o                o           OooOoo .oOOOo.  
O     `O O               O       o        O                O  o     o  
o      O o               o                o      O         o  O.       
O     .o O               o                O     oOo        O   `OOoo.  
oOooOO'  o  O   o  .oOoO O       O  .oOoO OoOo.  o         o        `O 
o        O  o   O  o   O O       o  o   O o   o  O         O         o 
O        o  O   o  O   o o     . O  O   o o   O  o   O     o  O.    .O 
o'       Oo `OoO'o `OoOo OOoOooO o' `OoOo O   o  `oO `OooOO'   `oooO'  
                       O                O                              
                    OoO'             OoO'                              
---------------------------------------------------
**Data-driven light-weight JavaScript framework** 
</pre>
</div>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)



                                                
<h2><b>Introduction</b></h2>
<p>
  <b>PlugLightJS</b> is a simple javascript framework designed to build data-driven applications with a modular approach easily. Its architecture was inspired by an    existing framework called <a href="https://github.com/ecsyjs/ecsy">ECSY.js</a>; I decided to make my framework, to gain more control of some design aspects like event management and object construction and allocation.
</p>
<h2>Usage</h2>

```js
//  First, create a 'World' instance: the top-level class that controls the framework components

const world = new World()
```
### Create Services

```js

// Make a 'Service' sub-class: you can add custom methods and attributes

class ExampleService extends Service{

  constructor(){
    super();
    // etc...
  }

  execute(){
   // Your code!
  }
}

// Then, register your service ( service name, service instance )

world.registerService('exampleService', new ExampleServiceA());

```

### Framework Execution

```js
world.execute();         // Start execution
```
```js
world.pauseExecution();  // Stop execution
```


