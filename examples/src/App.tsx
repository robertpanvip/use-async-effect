import * as React from "react";
import useAsyncEffect from "../../src"

const TextComponent = () => {
    useAsyncEffect(() => {
        let res:object;
        return {
            async effect(ref) {
                console.log('mounted', ref);
                res = await new Promise<{ xxx: number }>((resolve, reject) => {
                    setTimeout(() => {
                        console.log('loadDataxx', ref);
                        resolve({ xxx: 2 })
                    }, 2000)
                })
                res = await new Promise<{ a: number, b: number }>((resolve, reject) => {
                    setTimeout(() => {
                        console.log('loadData', ref);
                        reject({a: 123, b: 456})
                    }, 2000)
                })
                return ()=>{

                }
            },
            cleanup() {
                console.log('cleanup',res);
            }
        }
    }, [])

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