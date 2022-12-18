import { Placement } from "../utils";
import { HostComponent, FunctionComponent, HostText, ClassComponent, Fragment } from '../ReactWorkTags';

export function createFiber(vNode, returnFiber) {
    const fiber = {
        // 类型
        type: vNode.type,
        key: vNode.key,
        // 属性
        props: vNode.props,
        // 不同的类型，stateNode不一样的
        stateNode: null,

        // 第一个子fiber
        child: null,
        // 下一个兄弟组件
        sibling: null,
        // 组件的父级
        return: returnFiber,

        flags: Placement,

        index: null,
        // old fiber
        alternate: null,
        // 存的是头部hook，针对的函数组件
        memorizedState: null,
    };

    const { type } = vNode;
    if (typeof type === 'string') {
        fiber.tag = HostComponent;
    } else if (typeof type === 'function') {
        // todo 区分函数组件和类组件
        fiber.tag = type?.prototype.isComponent ? ClassComponent : FunctionComponent;
    } else if(typeof type === 'undefined') {
        fiber.tag = HostText;
        fiber.props = {children: vNode}
    } else {
        fiber.tag = Fragment;
    }


    return fiber;
}