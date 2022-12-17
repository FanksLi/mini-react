

export function peek(node) {
    return node.length === 0 ? null : node[0];
}

export function push(node, data) {
    const len = node.length;
    node.push(data);
    upward(node, len);
}

function upward(node, i) {
    let index = i;

    while(index > 0) {
        const parentIndex = (index - 1) >> 1;
        const parent = node[parentIndex];
        if(compare(node[index], parent) < 0) {
            swap(node, index, parentIndex);
            index = parentIndex;
        } else {
           return;
        }
    }

}

export function pop(node) {
    let len = node.length;

    if(len === 0) return node;
    const result = node[0];
    const last = node.pop();
    len = node.length;

    if(result !== last) {
        node[0] = last;
        downward(node, 0);
    }

    return result;

}

function downward(node, i) {
    let index = i;
    const len = node.length;
    const num = len >> 1;

    while(index < num) {
        const leftIndex =(index + 1)* 2 - 1;
        const rightIndex = leftIndex + 1;
        const left = node[leftIndex];
        const right = node[rightIndex];
        const cur = node[index];

        if(compare(left, cur) < 0) {
            if(rightIndex < len && compare(right, cur) < 0) {
                swap(node, rightIndex, index);
                index = rightIndex;
            } else {
                swap(node, leftIndex, index);
                index = leftIndex;
            }

        } else if(rightIndex < len && compare(right, cur) < 0) {
            swap(node, rightIndex, index);
            index = rightIndex;
        } else {
            return;
        }
    }
}

function compare(a, b) {
    return a - b;
    const diff = a.sortIndex - b.sortIndex;
    return diff !== 0 ? diff : a.id - b.id; 
}

function swap(node, index1, index2) {
    [node[index2], node[index1]] = [node[index1], node[index2]];
}

const arr = [];

push(arr, 10);
push(arr, 2);
push(arr, 3);
push(arr, 5);
push(arr, 6);
// pop(arr, 5);
console.log(arr);