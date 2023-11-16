import * as React from "react"
import type {DependencyList, MutableRefObject} from "react";

type AsyncEffect = (mounted: MutableRefObject<boolean>) => Promise<void>
type SyncEffect = (mounted: MutableRefObject<boolean>) => void
type EffectFactory = () => {
    effect: AsyncEffect | SyncEffect
    /**回收副作用的函数*/
    cleanup?: Cleanup
}

type Cleanup = () => void;

const noop = () => ({
    effect: () => undefined,
})

/**
 * 可以接受async编程方式的副作用函数
 * @param factory
 * @param deps 依赖
 */
function useAsyncEffect(
    factory: EffectFactory,
    deps?: DependencyList
) {
    const mounted = React.useRef<boolean>(false)
    React.useEffect(() => {
        const ins = factory() || noop;
        mounted.current = true;
        try {
            ins.effect(mounted)
        } catch (e) {
        }
        return () => {
            mounted.current = false;
            if (typeof ins.cleanup === 'function') {
                ins.cleanup()
            }
        }
    }, deps)
}

export default useAsyncEffect