
export default function FunctionComponent(props) {
    const {name} = props;

    return <div>{name || '函数组件'}hello</div>
}