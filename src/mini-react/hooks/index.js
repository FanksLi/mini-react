import { scheduleUpdateOnFiber } from "../ReactFiberWorkLoop";
import {HookLayout, HookPassive, areHookInputsEqual} from '../utils';

let currentlyRenderingFiber = null;
let workInProgressHook = null;
let currentHook = null;


export function renderWithHooks(wip) {
    currentlyRenderingFiber = wip;
    currentlyRenderingFiber.memorizedState = null;

    workInProgressHook = null;

    // 为了方便，useEffect与useLayoutEffect区分开，并且以数组管理
    // 源码中是放一起，并且是个链表结构
    currentlyRenderingFiber.updateQueueOfEffect = [];
    currentlyRenderingFiber.updateQueueOfLayout = [];
}
function updateWorkInProgressHook() {
    let hook;

    const current = currentlyRenderingFiber.alternate;

    if (current) {
        // 组件更新
        currentlyRenderingFiber.memorizedState = current.memorizedState;
        
        if (workInProgressHook) {
            workInProgressHook = hook = workInProgressHook.next;
            currentHook = currentHook.next;

        } else {
            workInProgressHook = hook = currentlyRenderingFiber.memorizedState;
            currentHook = current.memorizedState;
        }
    } else {
        // 组件初次渲染
        currentHook = null;
        hook = {
            memorizedState: null,
            next: null,
        }

        if (workInProgressHook) {
            workInProgressHook = workInProgressHook.next = hook;
        } else {
            workInProgressHook = currentlyRenderingFiber.memorizedState = hook;
        }
    }

    return hook;
}

export function useReducer(reducer, initalState) {
    const hook = updateWorkInProgressHook();
    if (!currentlyRenderingFiber.alternate) {
        hook.memorizedState = initalState;
    }
    // const dispatch = () => {
    //     hook.memorizedState = reducer(hook.memorizedState);
    //     currentlyRenderingFiber.alternate = {...currentlyRenderingFiber}
    //     scheduleUpdateOnFiber(currentlyRenderingFiber);
    //     console.log('reducer');
    // };
    const dispatch = dispatchReducerAction.bind(null, currentlyRenderingFiber, hook, reducer);

    return [hook.memorizedState, dispatch];
}

export function useState(initalState) {
    return useReducer(null, initalState);
}

function dispatchReducerAction(fiber, hook, reducer, actions) {
    hook.memorizedState = reducer ? reducer(hook.memorizedState) : actions;
    fiber.alternate = { ...fiber }
    fiber.sibling = null;
    scheduleUpdateOnFiber(fiber);
}


function updateEffectImp(hookFlags, create, deps) {
    const hook = updateWorkInProgressHook();

    if(currentHook) {
        const prevEffect = currentHook.memorizedState;

        if(deps) {
            const prevDeps = prevEffect.deps;
            if(areHookInputsEqual(deps, prevDeps)) {
                return;
            }
        }
    }

    const effect = {hookFlags, create, deps};

    hook.memorizedState = effect;

    if(hookFlags & HookLayout) {
        currentlyRenderingFiber.updateQueueOfLayout.push(effect);
    } else if(hookFlags & HookPassive) {
        currentlyRenderingFiber.updateQueueOfEffect.push(effect);
    }
}

export function useEffect(create, deps) {

    return updateEffectImp(HookPassive, create, deps);
}

export function useLayoutEffect(create, deps) {
    return updateEffectImp(HookLayout, create, deps);
    
}