// import React from 'React';
import React from 'react';
import StudyPlan from "../components/plan/index.js";
import style from  '../app.scss?mc';


window.React=React;//不知道为啥，不加就报React不存在的错

//写具体的业务逻辑
class DetailPage extends React.Component {

    //组件的props不能修改
    constructor(props) {
        super(props);
        
    }

	//ajax写在生命周期里面，获取最新的数据以后，修改state，就可以重新render组件的UI了

	//dom插入前，修改state
	componentWillMount(){
	}

	//dom插入后，这里面写具体的业务逻辑
	componentDidMount(){

	}


	//具体的业务逻辑
    setNewNumber(){
        
    }

    //渲染的HTML结构
    render(){
        let opts={items:[{name:"jeffrey",className:"root"},{name:"jeffrey1",className:"root"}]};
        var combineClass=style["footer-uniq"];
        return (
            <div onClick = {this.setNewNumber} className={`${combineClass}`} style={{"background": "#07A0E0", "height": "100%"}} >
                <StudyPlan {...opts} />
            </div>
        );
    }
};


export default DetailPage