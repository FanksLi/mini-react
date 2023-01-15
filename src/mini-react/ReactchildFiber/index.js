import { createFiber } from "../ReactFiber";
import { Placement, Update } from '../utils';

export function deleteChild(returnFiber, childToDelete) {
    if (returnFiber.deletions) {
        returnFiber.deletions.push(childToDelete);
    } else {
        returnFiber.deletions = [childToDelete];
    }
}

function deleteRemainingChildren(returnFiber, currentFirstChild) {
    let childToDelete = currentFirstChild;

    while (childToDelete) {
        deleteChild(returnFiber, childToDelete);
        childToDelete = childToDelete.sibling;
    }
}

function placeChild(newFiber, lastplacedIndex, newIndex, shouldTrackSideEffects) {
    newFiber.index = newIndex;
    if(!shouldTrackSideEffects) {
        // 父节点初次渲染
        return lastplacedIndex;
    }

    // 父节点更新，子节点是初次渲染还是更新呢
    const current = newFiber.alternate;
    if(current) {
        const oldIndex = current.index;
        // 子节点更新
        // old 0 1 2 3 4
        // new 2 1 3 4
        // 2 1
        if(oldIndex < lastplacedIndex) {
            // move
            newFiber.flags |= Placement;
            return lastplacedIndex;
        } else {
            return oldIndex;
        }
    } else {
        // 子节点初次渲染
        newFiber.flags |= Placement;
        return lastplacedIndex;
    }

}

// 构建哈希表
function mapRemainingChildren(currentFirstChild) {
    const existingChildren = new Map();

    let existingChild = currentFirstChild;

    while(existingChild) {
        existingChildren.set(existingChild.key || existingChild.index, existingChild);
        existingChild = existingChild.sibling;
    }

    return existingChildren;
}

export function reconcileChildren(returnFiber, children) {
    if (typeof children === 'string' || typeof children === 'number') return;
    let previousNewFiber = null;
    const newChildren = children instanceof Array ? children : [children];
    let nextOldFiber = null;
    let oldFiber = returnFiber.alternate?.child;
    // 用于判断节点是否是初次渲染
    let shouldTrackSideEffects = !!returnFiber.alternate;
    let newIndex = 0;

    // 上一次插入节点的位置
    // 1, 2, 3, 4
    // 2, 1, 3, 4
    let lastplacedIndex = 0;
    // 1.从左往右遍历，比较新老节点，如果节点可以复用，继续往右，否则停止
    for (; oldFiber && newIndex < newChildren.length; newIndex++) {
        const newChild = newChildren[newIndex];
        if (newChild == null) {
            continue;
        }
        if (oldFiber.index > newIndex) {
            nextOldFiber = oldFiber;
            oldFiber = null;

        } else {
            nextOldFiber = oldFiber.sibling;
        }

        const same = sameNode(newChild, oldFiber);

        if(!same) {
            if(oldFiber === null) {
                oldFiber = nextOldFiber;
                break;
            }
        }
        const newFiber = createFiber(newChild, returnFiber);

        Object.assign(newFiber, {
            stateNode: oldFiber.stateNode,
            alternate: oldFiber,
            flags: Update,
        });
        lastplacedIndex = placeChild(newFiber, lastplacedIndex, newIndex, shouldTrackSideEffects);

        if(previousNewFiber === null) {
            returnFiber.child = newFiber;
        } else {
            previousNewFiber.sibling = newFiber;
        }

        previousNewFiber = newFiber;
        oldFiber = nextOldFiber;
    }

    // 2. 新节点没了，老节点还有,老节点就要删除
    if(newIndex === newChildren.length) {
        deleteRemainingChildren(returnFiber, oldFiber);
        return;
    }

    // 3. 初次渲染
    // 老节点没了，新节点
    if (!oldFiber) {
        for (; newIndex < newChildren.length; newIndex++) {
            const newChild = newChildren[newIndex];
            if (newChild == null) {
                continue;
            }
            const newFiber = createFiber(newChild, returnFiber);
            lastplacedIndex = placeChild(newFiber, lastplacedIndex, newIndex, shouldTrackSideEffects);

            if (previousNewFiber === null) {
                // head node
                returnFiber.child = newFiber;
            } else {
                previousNewFiber.sibling = newFiber;
            }

            previousNewFiber = newFiber;
        }
    }

    // 4. 新老节点还有
    // old 0 1 2 [3 4]
    // new 0 1 [3 4]

    // 4.1 把剩下的old构建哈希表
    const existingChildren = mapRemainingChildren(oldFiber);
    // 4.2 遍历新节点，通过新节点key或index去哈希表查找节点，找到就复用，并且删除哈希表中对应的节点
    for(; newIndex < newChildren.length; newIndex++) {
        const newChild = newChildren[newIndex];
        if (newChild == null) {
            continue;
        }

        const newFiber = createFiber(newChild, returnFiber);

        // oldfiber
        const matchedFiber = existingChildren.get(newFiber.key || newFiber.index);

        if(matchedFiber) {
            // 节点复用
            Object.assign(newFiber, {
                stateNode: matchedFiber.stateNode,
                alternate: matchedFiber,
                flags: Update,
            })

            existingChildren.delete(newFiber.key || newFiber.index);
        }

        lastplacedIndex = placeChild(newFiber, lastplacedIndex, newIndex, shouldTrackSideEffects);

        if(previousNewFiber === null) {
            returnFiber.child = newFiber;
        } else {
            previousNewFiber.sibling = newFiber;
        }

        previousNewFiber = newFiber;
    }
    // 5. old的哈希表中还有值，遍历哈希表删除所有old
    existingChildren.forEach(child => deleteChild(returnFiber, child));

}


// 节点复用的条件
export function sameNode(a, b) {
    return a && b && a.type === b.type && a.key === b.key;
}
