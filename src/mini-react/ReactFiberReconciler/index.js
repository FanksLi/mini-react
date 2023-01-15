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
  const Element = new type(props);
  const children = Element.render();
  reconcileChildren(wip, children);
};

export function updateFragmentComponent(wip) {
  const { props } = wip;
  reconcileChildren(wip, props.children);
};

export function updateHostTextComponent(wip) {
  const { props } = wip;

  wip.stateNode = document.createTextNode(props.children);
};




