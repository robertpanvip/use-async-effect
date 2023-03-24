import * as React from "react"
import type {DependencyList, MutableRefObject} from "react";

type Destructor = () => void
type EffectCallback = (mounted: MutableRefObject<boolean>) => (void | Destructor)
type EffectCallbackPromise<R> = (mounted: MutableRefObject<boolean>) => Promise<R>
type PromiseEffectCallback<R> = EffectCallback | EffectCallbackPromise<R>;
type CleanupCallback<R> = (result: R | void) => void;

const noop = () => undefined

function useAsyncEffect<R>(
    effect: PromiseEffectCallback<R>,
    deps?: DependencyList
): void;

function useAsyncEffect<R>(
    effect: PromiseEffectCallback<R>,
    cleanup: CleanupCallback<R>,
    deps?: DependencyList
): void;

function useAsyncEffect<R>(
    effect: PromiseEffectCallback<R>,
    cleanup: unknown,
    deps?: DependencyList
) {
    if (Array.isArray(cleanup) && deps === undefined) {
        deps = cleanup;
        cleanup = noop
    }
    const mounted = React.useRef<boolean>(false)
    React.useEffect(() => {
        const promise = effect(mounted) || noop;
        let result: R;
        mounted.current = true;
        if (promise && "then" in promise && typeof promise.then === "function") {
            promise.then((res) => {
                result = res;
            })
        } else {
            const originCleanup = cleanup
            cleanup = () => {
                if (typeof promise === 'function') {
                    promise()
                }
                if (typeof originCleanup === 'function') {
                    originCleanup()
                }
            };
        }
        return () => {
            mounted.current = false;
            if (typeof cleanup === 'function') {
                cleanup(result)
            }
        }
    }, deps)
}

export default useAsyncEffect