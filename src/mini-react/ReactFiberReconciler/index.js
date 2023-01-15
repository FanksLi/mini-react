<<<<<<< Updated upstream
import { createFiber } from "../ReactFiber";
import {Update, updateNode} from '../utils';
import {renderWithHooks} from '../hooks';

export function updateHostComponent(wip) {
    if(!wip.stateNode) {
        wip.stateNode = document.createElement(wip.type);
        updateNode(wip.stateNode, {}, wip.props);
    }
    reconcileChildren(wip, wip.props.children);
};

function deleteChild(returnFiber, childToDelete) {
  if(returnFiber.deletions) {
    returnFiber.deletions.push(childToDelete);
  } else;{
    returnFiber.deletions = [childToDelete];
  }
}

function reconcileChildren(wip, children) {
    if(typeof children === 'string' || typeof children === 'number') return;
    let previousNewFiber = null;
    const newChildren = children instanceof Array ? children : [children];
    let oldFiber = wip.alternate?.child;
    for (let i = 0; i < newChildren.length; i++) {
        const newChild = newChildren[i];
        if (newChild == null) {
          continue;
        }
        const newFiber = createFiber(newChild, wip);
        const same = sameNode(newFiber, oldFiber);
        if(same) {
          Object.assign(newFiber, {
            stateNode: oldFiber.stateNode,
            alternate: oldFiber,
            flags: Update,
          });
        }

        if(!same && oldFiber) {
          deleteChild(wip, oldFiber);
        }

        if(oldFiber) {
          oldFiber = oldFiber.sibling;
        }
    
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
    renderWithHooks(wip);
    const {type, props} = wip;
    const children = type(props);
    reconcileChildren(wip, children);
};

export function updateClassComponent(wip) {
  const {type, props} = wip;
=======
import { updateNode } from '../utils';
import { renderWithHooks } from '../hooks';
import { reconcileChildren } from '../ReactchildFiber';

export function updateHostComponent(wip) {
  if (!wip.stateNode) {
    wip.stateNode = document.createElement(wip.type);
    updateNode(wip.stateNode, {}, wip.props);
  }
  reconcileChildren(wip, wip.props.children);
};

export function updateFunctionComponent(wip) {
  renderWithHooks(wip);
  const { type, props } = wip;
  const children = type(props);
  reconcileChildren(wip, children);
};

export function updateClassComponent(wip) {
  const { type, props } = wip;
>>>>>>> Stashed changes
  const Element = new type(props);
  const children = Element.render();
  reconcileChildren(wip, children);
};

export function updateFragmentComponent(wip) {
<<<<<<< Updated upstream
  const {props} = wip;
=======
  const { props } = wip;
>>>>>>> Stashed changes
  reconcileChildren(wip, props.children);
};

export function updateHostTextComponent(wip) {
<<<<<<< Updated upstream
  const {props} = wip;
=======
  const { props } = wip;
>>>>>>> Stashed changes

  wip.stateNode = document.createTextNode(props.children);
};

<<<<<<< Updated upstream
// 节点复用的条件
function sameNode(a, b) {
  return a && b && a.type === b.type && a.key === b.key;
}
=======
>>>>>>> Stashed changes



