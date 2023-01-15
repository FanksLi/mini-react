/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
 // Don't change these two values. They're used by React Dev Tools.
 export const NoEffect = /*                     */ 0b000000000000000; // 0
 export const PerformedWork = /*                */ 0b000000000000001; // 1
 
 // You can change the rest (and add more).
 export const Placement = /*                    */ 0b000000000000010; // 2
 export const Update = /*                       */ 0b000000000000100; // 0
 export const PlacementAndUpdate = /*           */ 0b000000000000110;
 export const Deletion = /*                     */ 0b000000000001000;
 export const ContentReset = /*                 */ 0b000000000010000;
 export const Callback = /*                     */ 0b000000000100000;
 export const DidCapture = /*                   */ 0b000000001000000;
 export const Ref = /*                          */ 0b000000010000000;
 export const Snapshot = /*                     */ 0b000000100000000;
 export const Passive = /*                      */ 0b000001000000000;
 export const PassiveUnmountPendingDev = /*     */ 0b010000000000000;
 export const Hydrating = /*                    */ 0b000010000000000;
 export const HydratingAndUpdate = /*           */ 0b000010000000100;
 
 // Passive & Update & Callback & Ref & Snapshot
 export const LifecycleEffectMask = /*          */ 0b000001110100100;
 
 // Union of all host effects
 export const HostEffectMask = /*               */ 0b000011111111111;
 
 // These are not really side effects, but we still reuse this field.
 export const Incomplete = /*                   */ 0b000100000000000;
 export const ShouldCapture = /*                */ 0b001000000000000;
 export const ForceUpdateForLegacySuspense = /* */ 0b100000000000000;
 
 // Union of side effect groupings as pertains to subtreeTag
 export const BeforeMutationMask = /*           */ 0b000001100001010;
 export const MutationMask = /*                 */ 0b000010010011110;
 export const LayoutMask = /*                   */ 0b000000010100100;

<<<<<<< Updated upstream
=======
 export const HookLayout = 0b010;
 export const HookPassive = 0b100;

>>>>>>> Stashed changes


 export function isStr(s) {
  return typeof s === "string";
}

export function isStringOrNumber(s) {
  return typeof s === "string" || typeof s === "number";
}

export function isFn(fn) {
  return typeof fn === "function";
}

export function isArray(arr) {
  return Array.isArray(arr);
}

export function isUndefined(s) {
  return s === undefined;
}
// old props {className: 'red', id: '_id'}
// new props {className: 'green'}
export function updateNode(node, prevVal={}, nextVal={}) {
    Object.keys(prevVal)
      // .filter(k => k !== "children")
      .forEach((k) => {
        if (k === "children") {
          // 有可能是文本
          if (isStringOrNumber(prevVal[k])) {
            node.textContent = "";
          }
        } else if (k.slice(0, 2) === "on") {
          const eventName = k.slice(2).toLocaleLowerCase();
          node.removeEventListener(eventName, prevVal[k]);
        } else {
          if (!(k in nextVal)) {
            node[k] = "";
          }
        }
      });
  
    Object.keys(nextVal)
      // .filter(k => k !== "children")
      .forEach((k) => {
        if (k === "children") {
          // 有可能是文本
          if (isStringOrNumber(nextVal[k])) {
            node.textContent = nextVal[k] + "";
          }
        } else if (k.slice(0, 2) === "on") {
          const eventName = k.slice(2).toLocaleLowerCase();
          node.addEventListener(eventName, nextVal[k]);
        } else {
          node[k] = nextVal[k];
        }
      });
<<<<<<< Updated upstream
=======
  }

  export function areHookInputsEqual(nextDeps, prevDeps) {

      if(prevDeps === null) {
        return false;
      }

      for(let i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
        if(Object.is(prevDeps[i], nextDeps[i])) {
          continue;
        }
        return false;
      }

      return true;
>>>>>>> Stashed changes
  }