import EventManager from "../../../src/EventManager.js";
import World        from "../../../src/World.js";
const eventManager = new EventManager(new World());
const n = 100;

for(let i = 1; i <= n; i++){

    test('properly register event with valid name', () => {
        expect(eventManager.registerEvent(`event${i}`)).toEqual(true);
        expect(eventManager.events[`event${i}`]).toEqual({}); 
    });  

    test('detect event name and prevent duplication', () => {
        expect(eventManager.registerEvent(`event${i}`)).toEqual(false);
        expect(Object.keys(eventManager.events).length).toEqual(i);         
    });  

    test('detect invalid event name and prevent registration', () => {
        expect(eventManager.registerEvent('')).toEqual(false);
        expect(eventManager.registerEvent(true)).toEqual(false);
        expect(eventManager.registerEvent(i)).toEqual(false);
        
        expect(Object.keys(eventManager.events).length).toEqual(i);         
    });  

}