// import React from "react";
import {Component} from '../../mini-react/Component'

export default class ClassComponent extends Component{
    

    render() {
        const {name} = this.props;
        return <div>{name || 'fanfan'}</div>
    }
}