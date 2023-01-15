import { useReducer, useState, useEffect, useLayoutEffect } from "../../SwitchReact";

export default function FunctionComponent(props) {
    const { name } = props;
    const [count, setCount] = useReducer(x => x + 1, 0);
    const [count2, setCount2] = useState(0);

    useEffect(() => {
        console.log('useEffect', 0);
    }, [count2]);

    useLayoutEffect(() => {
        console.log('useLayoutEffect', 1);
    }, [count2]);
    return <div>
        <span>{name || '函数组件'}hello</span>
        <button onClick={() => setCount()}>{count}</button>
        <button onClick={() => setCount2((count2 + 1) % 5)}>{count2}</button>
        {count % 2 === 0 ? <div>fan</div> : <span>li</span>}
        <ui>
            {count2 % 2 === 0 ? [1, 2, 3, 4].map((item) => {
                return <li key={item}>{item}</li>
            }) :
                [2, 1, 3, 4].map((item) => {
                    return <li key={item}>{item}</li>
                })
            }

            {/* {count2 % 2 === 0 ? [1, 2, 3, 4].map((item) => {
                return <li key={item}>{item}</li>
            }) :
                [1, 2, 4].map((item) => {
                    return <li key={item}>{item}</li>
                })
            } */}
        </ui>
    </div>
}