import ClassComponent from "./Components/ClassComponent";
import FunctionComponent from "./Components/FunctionComponent";
import FragmentComponent from "./Components/FragmentComponent";

export default function App() {
    return <div>
        <h1>原生标签</h1>
        <FunctionComponent name='函数标签' />
        <ClassComponent name='类标签' />
        <FragmentComponent />
    </div>
}