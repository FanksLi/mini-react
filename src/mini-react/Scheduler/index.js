import {push, peek, pop} from './miniHeep';

const taskQueue = [];
let taskIdCounter = 1;



export function scheduleCallback(callback) {
    const currentTime = getCurrentTime();
    const timeOut = -1;

    const expirtationTime = currentTime - timeOut;
    
    const newTask = {
        id: taskIdCounter++,
        callback,
        expirtationTime,
        sortIndex: expirtationTime,
    };

    push(taskQueue, newTask);

    requestHostCallback();

}

const channel = new MessageChannel();

const port = channel.port2;

channel.port1.onmessage = () => {
    workLoop();
}

function workLoop() {
    const currentTask = peek(taskQueue);

    while(currentTask) {
        const callback = currentTask.callback;
        currentTask.callback = null;
        callback();
        pop(taskQueue);
        currentTask = peek(taskQueue);
    }
}

function requestHostCallback() {
    port.postMessage(null);
}

function getCurrentTime() {

    return performance.now();
}