// Target function arguments should be Array or Object
type TargetFunction = (...arg: Array<any[] | object>) => Promise<unknown>;

interface PromiseObj {
    resolve: (arg: unknown) => void;
    reject: (arg: unknown) => void;
}

/**
 * debounce method to handle async function and combine its arguments.
 * async function arguments should be array or object.
 * @param fn async function
 * @param delay waiting time for fn excution
 * @returns promise
 *
 * with in debounce time
 * argumentsList: Map to store each call arguments with indexes '0', '1'.indexes length based on arguments length.
 * promisesList: Array to store each call promise object
 *
 * Logic to combine arguments of all calls:
 * STEP-1: Iterate arguments(args)
 * STEP-2: Check whether that key present or not in argumentsList.
 * STEP-2.1: if key is not present. set value in argumentsList as (key,val)
 * STEP-2.2: if key is already present. get the prevoius value, append with new value and store in argumentsList.
 * STEP-3: got another call with in debounce time. Repeat from STEP-1
 *
 * Logic to return data or error to all calls
 * STEP-1: push promise object into promisesList on each call
 * STEP-2: once debounce time done. invoke fn.
 * STEP-2.1: if it is resolved. iterate promisesList and resolve the data
 * STEP-2.2: if it is rejected. iterate promisesList and reject the error
 * STEP-3: on promise resolve or reject. each call will get its data.
 */

export const debouncePromise = (fn: TargetFunction, delay = 0) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let promisesList: PromiseObj[] = [];
    const argumentsList = new Map();
    return (...args: any) =>
        new Promise((res, rej) => {
            clearTimeout(timeoutId);
            let eachCallArgument;
            for (const key in args) {
                if (argumentsList.has(key)) {
                    if (Array.isArray(argumentsList.get(key))) {
                        eachCallArgument = [
                            ...new Set(argumentsList.get(key).concat(args[key]))
                        ];
                    } else {
                        eachCallArgument = {
                            ...argumentsList.get(key),
                            ...args[key]
                        };
                    }
                } else {
                    eachCallArgument = Array.isArray(args[key])
                        ? args[key]
                        : { ...args[key] };
                }
                argumentsList.set(key, eachCallArgument);
            }
            timeoutId = setTimeout(() => {
                const currentPromises = [...promisesList];
                const currentMap = new Map(argumentsList);
                promisesList = [];
                argumentsList.clear();
                fn.call(this, ...Array.from(currentMap.values()))
                    .then((data) => {
                        currentPromises.forEach(({ resolve }) => resolve(data));
                    })
                    .catch((err) => {
                        currentPromises.forEach(({ reject }) => reject(err));
                    });
            }, delay);
            promisesList.push({ resolve: res, reject: rej });
        });
};
