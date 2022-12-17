import { createFiber } from "../ReactFiber";
import { scheduleUpdateOnFiber } from '../ReactFiberWorkLoop';

function ReactDomRoot(containerInfo) {
    this._containerInfo = containerInfo;
}

ReactDomRoot.prototype.render = function (children) {
    const root = this._containerInfo;

    updateContainer(children, root);
}


function updateContainer(element, container) {
    const {containerInfo} = container;
    const fiber = createFiber(element, {
        type: containerInfo.nodeName.toLocaleLowerCase(),
        stateNode: containerInfo,
    });

    scheduleUpdateOnFiber(fiber);
}

function createRoot(container) {
    const root = { containerInfo: container };

    return new ReactDomRoot(root);
}



export default {
    createRoot,
}