import { updateClassComponent, updateFragmentComponent, updateFunctionComponent, updateHostComponent, updateHostTextComponent } from "../ReactFiberReconciler";
import { ClassComponent, Fragment, FunctionComponent, HostComponent, HostText } from "../ReactWorkTags";
import { Placement, Update, updateNode } from "../utils";
import {scheduleCallback} from '../Scheduler';


let workInProgress = null;
let workInProgressRoot = null;

export function scheduleUpdateOnFiber(fiber) {
    workInProgress = fiber;
    workInProgressRoot = fiber;
    scheduleCallback(workLoop);
};

export function performUnitOfWork() {
    const { tag } = workInProgress;
    // 更新当前组件
    switch (tag) {
        case HostComponent:
            updateHostComponent(workInProgress);
            break;
        case FunctionComponent:
            updateFunctionComponent(workInProgress);
            break;
        case ClassComponent:
            updateClassComponent(workInProgress);
            break;
        case HostText:
            updateHostTextComponent(workInProgress);
            break;
        case Fragment:
            updateFragmentComponent(workInProgress);
            break;
        default:
            break;
    }
    // todo 更新下一个节点，深度优先遍历
    if (workInProgress.child) {
        workInProgress = workInProgress.child;
        return;
    }

    let next = workInProgress;
    while (next) {
        if (next.sibling) {
            workInProgress = next.sibling;
            return;
        }
        next = next.return;
    }


    workInProgress = null;
}


function workLoop() {
    while(workInProgress) {
        performUnitOfWork();
    }

    if(!workInProgress && workInProgressRoot) {
        commitRoot();
    }
}

function commitRoot() {
    commitWorker(workInProgressRoot);
    workInProgressRoot = null;
}

function commitWorker(wip) {
    if(!wip) return;
    // 1. 更新自己
    const {flags, stateNode} = wip;
    const parentNode = getParentNode(wip.return);
    if(flags & Placement && stateNode) {
        parentNode.appendChild(stateNode);
    }
    if(flags & Update && stateNode) {
        updateNode(stateNode, wip?.alternate?.props, wip.props);
    }
    if(wip.deletions) {
        commitDeltions(wip.deletions, stateNode || parentNode);
    }
    // 2. 更新子节点
    commitWorker(wip.child);
    // 3. 更新兄弟节点
    commitWorker(wip.sibling);

}


// requestIdleCallback(workLoop);

function getParentNode(wip) {
    let tem = wip;
    while (tem) {
      if (tem.stateNode) {
        return tem.stateNode;
      }
      tem = tem.return;
    }
  }

  function commitDeltions(deltetions, stateNode) {
    for(let i = 0; i < deltetions.length; i++) {
        const child = getChildNode(deltetions[i]);
        stateNode.removeChild(child);
    }
  }

  function getChildNode(fiber) {
    let temp = fiber.stateNode;
    while(!temp) {
        temp = fiber.child.stateNode;
    }
    return temp;
  }