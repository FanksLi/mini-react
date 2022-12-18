import { useReducer, useState } from "../../mini-react/hooks";

export default function FunctionComponent(props) {
    const {name} = props;
    const [count, setCount] = useReducer(x => x+1, 0);
    const [count2, setCount2] = useState(0);
    return <div>
        <span>{name || '函数组件'}hello</span>
        <button onClick={() => setCount()}>{count}</button>
        <button onClick={() => setCount2(count2 + 1)}>{count2}</button>
        {count % 2 === 0 ? <div>fan</div> : <span>li</span>}
    </div>
}