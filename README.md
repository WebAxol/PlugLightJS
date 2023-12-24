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

<p>Services contain code that is executed every frame by the World class. They are implemented as 'Service' sub-classes</p>

```js
import { Service } from 'pluglightjs'; // You may need to import the Service class
```

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

### Create Events

<p>Here are the main functions to work with events in pljs:</p>

```js
world.registerEvent('eventName'); // create event
```

```js
world.registerServiceToEvent('serviceName','eventName'); // make service an event listener
```

```js
world.notifyEvent('eventName', { info : 'eventInfo' }); // emit event
```

<p>Lets implement that with a brief example:</p>


```js

class EventEmitter extends Service{

    constructor(){
        super();
        // etc...
    }

    execute(){

        // Emit event
        
        this.world.notifyEvent('exampleEvent');
    }
}

class EventReceiver extends Service{

    constructor(){
        super();
        // etc...
    }
  
    // event-handler class (on + event name)

    onexampleEvent(){
        console.log('event received');
    }
}

world.registerEvent('exampleEvent');

world.registerService('emitter' , new EventEmitter());
world.registerService('receiver', new EventReceiver());

world.registerServiceToEvent('receiver','exampleEvent');

```

### Framework Execution

```js
world.execute();    
```
```js
world.pauseExecution();
```
<hr>
<h3>Contribute</h3>

```sh
git clone https://github.com/WebAxol/PlugLightJS
```

