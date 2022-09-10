//多个组件组合成一个Container组件
import React from 'react';
import * as Redux from 'Redux';
import * as ReactRedux from 'ReactRedux';
import StudyPlan from '../components/plan';
import {getStudyPlanList} from './action';
import style from '../app.scss';



class Container extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick=this.handleClick.bind(this);//在template中绑定this，每次触发都会生成一个新的function，影响性能
    }

    componentWillMount(){
    }

    componentDidMount() {
    }

    handleClick() {
        store.dispatch(getStudyPlanList(20));
    }

    render() {
        let opts={items:[{name:"jeffrey",className:"root"},{name:"jeffrey1",className:"root"}]};//this.props||
        return (
            <div onClick={this.handleClick} >
                
                <StudyPlan {...opts} />
            </div>
        );
    }
}

//
// 将 store 中的数据作为 props 绑定到组件上
function mapStateToProps(state) {
    var studyPlan=state.studyPlan;
    return {
        isLoading:state.loadingState,//是否加载中
        studyPlan:studyPlan//每个组件都是state中的一个属性,把组件中state属性，映射到到store中的各个属性
    };
}

// React-Redux会自动将function类型的action注入组件的props ！！！！！！！！！！！
function mapDispatchToProps(dispatch) {
    // return {
    //     actions: Redux.bindActionCreators(getStudyPlanList, dispatch)
    // }

    return Redux.bindActionCreators({//因为action要支持异步，所以这里还需要对dispatch做一层封装，用到了bindActionCreators
        getStudyPlanList//因为他是个function，所以需要用到Redux.bindActionCreators
    }, dispatch);
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Container);


// ReactRedux.connect(arg1,arg2,arg3,arg4)(组件类)
    //arg1将 store 中的数据作为 props 绑定到组件上
    //arg2将 action 作为 props 绑定到组件上。
    //arg3用于自定义merge流程，将stateProps 和 dispatchProps merge 到parentProps之后赋给组件。通常情况下，你可以不传这个参数，connect会使用 Object.assign。
    //arg4 如果指定这个参数，可以定制 connector 的行为。一般不用。







