import { scheduleUpdateOnFiber } from "../ReactFiberWorkLoop";

let currentlyRenderingFiber = null;
let workInProgressHook = null;


export function renderWithHooks(wip) {
    currentlyRenderingFiber = wip;
    currentlyRenderingFiber.memorizedState = null;

    workInProgressHook = null;
}
function updateWorkInProgressHook() {
    let hook;

    const current = currentlyRenderingFiber.alternate;

    if (current) {
        // 组件更新
        currentlyRenderingFiber.memorizedState = current.memorizedState;

        if (workInProgressHook) {
            workInProgressHook = hook = workInProgressHook.next;
        } else {
            workInProgressHook = hook = currentlyRenderingFiber.memorizedState;
        }
    } else {
        // 组件初次渲染
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