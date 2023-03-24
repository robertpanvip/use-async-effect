import * as React from "react";
import useAsyncEffect from "../../src"

const TextComponent = () => {
    useAsyncEffect(async (ref) => {
        console.log('mounted',ref);
        const res = await new Promise<{a:number,b:number}>((resolve, reject) => {
            setTimeout(() => {
                console.log('loadData',ref);
                resolve({a: 123, b: 456})
            }, 2000)
        })
        return {
            ...res,
        };
    }, (params) => {
        console.log('unmounted',params?.a);
    }, [])

    useAsyncEffect((ref) => {
        console.log('mounted',ref);
         new Promise<{a:number,b:number}>((resolve, reject) => {
            setTimeout(() => {
                console.log('loadData',ref);
                resolve({a: 123, b: 456})
            }, 2000)
        })
        return ()=>{
            console.log('unmounted');
        }
    },[])
    return <div>useAsyncEffect-test</div>
}

export default function App() {
    const [visible, setVisible] = React.useState<boolean>(true)
    return (
        <>
            {visible && (<TextComponent/>)}
            <button onClick={() => setVisible(pre => !pre)}>
                改变
            </button>
        </>

    )
}