import World from "../../src/World.js";
import Service from "../../src/Service.js";

// ! Warning: To perform this test, I had to forcedly modifly the World class because requestAnimationFrame was not been detected by jest

// Setup

const world = new World();

const n = 100;  // Number of iterations (execution frames)
const m = 20; // Number of Subjects (Receivers at test case B)

world.registerEvent('test');

class EventEmitterService extends Service{

    constructor(){
        super();
        this.emittedCount = 0;
    }

    execute(){
        if(Math.random() > 0.5){
            this.world.notifyEvent('test');
            this.emittedCount++;
        }
    }
}

class EventReceiverService extends Service{

    constructor(){
        super();
        this.receivedCount = 0;
    }

    ontest(){
        this.receivedCount++;
    }
}

world.registerService('emitter' , new EventEmitterService());

//* Test Case A - Single receiver

world.registerService('receiver', new EventReceiverService());
world.registerServiceToEvent('receiver','test');

test('the event is properly notified to one receiver each frame', () => {

    world.routine = () => {
    
        let emittedCount  = world.getService('emitter').emittedCount;
        let receivedCount = world.getService('receiver').receivedCount;

        expect(emittedCount  >= 0).toEqual(true);
        expect(receivedCount >= 0).toEqual(true);
        expect(emittedCount).toEqual(receivedCount);

        if(world.frame >= n){
            world.pauseExecution();
        }

    };

    world.execute();
});  

//* Test Case B - Multiple receivers

for(let i = 0; i < m; i++){
    world.registerService(`receiver${i}`, new EventReceiverService());
    world.registerServiceToEvent(`receiver${i}`,'test');
}

test('the event is properly notified to multiple receivers each frame', () => {


    world.frame = 0; // Reset frame counter

    world.routine = () => {
    
        let emittedCount  = world.getService('emitter').emittedCount;

        for(let i = 0; i < m; i++){

            let receivedCount = world.getService(`receiver${i}`).receivedCount;
    
            expect(emittedCount  >= 0).toEqual(true);
            expect(receivedCount >= 0).toEqual(true);
            expect(emittedCount).toEqual(receivedCount);
        }

        if(world.frame >= n){
            world.pauseExecution();
        }

    };

    world.pause = false;
    world.execute();
});  