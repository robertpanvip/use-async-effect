import * as React from "react"
import type {DependencyList, EffectCallback} from "react";

type EffectCallbackPromise<R> = () => Promise<R>
type PromiseEffectCallback<R> = EffectCallback | EffectCallbackPromise<R>;

function usePromiseEffect<R> (
    effect: PromiseEffectCallback<R>,
    cleanup: (result: R) => void,
    deps?: DependencyList
){
    React.useEffect(() => {
        const promise = effect();
        let result:R;
        if (promise && "then" in promise && typeof promise.then === "function") {
            promise.then((res) => {
                result = res;
            })
        }
        return () => {
            cleanup(result)
        }
    }, deps)
}
export default usePromiseEffect