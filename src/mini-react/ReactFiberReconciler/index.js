import { createFiber } from "../ReactFiber";
import {updateNode} from '../utils';

export function updateHostComponent(wip) {
    if(!wip.stateNode) {
        wip.stateNode = document.createElement(wip.type);
        updateNode(wip.stateNode, wip.props);
    }
    reconcileChildren(wip, wip.props.children);
};

function reconcileChildren(wip, children) {
    if(typeof children === 'string' || typeof children === 'number') return;
    let previousNewFiber = null;

    const newChildren = children instanceof Array ? children : [children];
    for (let i = 0; i < newChildren.length; i++) {
        const newChild = newChildren[i];
        if (newChild == null) {
          continue;
        }
        const newFiber = createFiber(newChild, wip);
    
        if (previousNewFiber === null) {
          // head node
          wip.child = newFiber;
        } else {
          previousNewFiber.sibling = newFiber;
        }
    
        previousNewFiber = newFiber;
      }

}

export function updateFunctionComponent(wip) {
    const {type, props} = wip;
    const children = type(props);
    reconcileChildren(wip, children);
};

export function updateClassComponent(wip) {
  const {type, props} = wip;
  const Element = new type(props);
  const children = Element.render();
  reconcileChildren(wip, children);
};

export function updateFragmentComponent(wip) {
  const {props} = wip;
  reconcileChildren(wip, props.children);
};

export function updateHostTextComponent(wip) {
  const {props} = wip;

  wip.stateNode = document.createTextNode(props.children);
};



