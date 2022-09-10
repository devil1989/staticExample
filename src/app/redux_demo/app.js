// // 基本不用动
// import React from 'react';
// import * as ReactRedux from 'ReactRedux';
// import * as ReactDOM from 'react-dom';
// import 'redux-module';
// import store from './js/store';
// import Container from './js/container';
// const Provider=ReactRedux.Provider;
// window.store=store;
// ReactDOM.render(
//     <Provider store={store}>
// 		<Container />
// 	</Provider>,
//     document.getElementById("root")
// );



//
/*
	1.Redux.combineReducers:组合所有reducer，里面会执行一遍所有reducer，reducer的actionType为undefined：这个用于初始化每个reducer的state；最终返回一个function类型的rootReducer
	2.Redux.compose和Redux.applyMiddleware封装store,用封装好的store来绑定rootReducer，最终实现store和reducer的绑定；//store.js中
	3.执行ReactRedux.connect ：绑定mapStateToProps和mapDispatchToProps方法绑定到Container组件，在组建执行render的过程中执行这两个函数
	4.执行react的render函数，render函数中会执行mapStateToProps和mapDispatchToProps这两个函数，实现store中的各个组件的数据绑定到Container组件的props上去
	5.生命周期：componentWillMount，componentDidMount，ShouldComponentUpdate，componentWillReceiveProps，componentWillUpdate，componentDidUpdate，componentWillUnmount

	备注：store中的每一个属性对应一个reducer，但是store.dispatch的时候会执行所有的reducer，每个reducer中有多个actionType，更加不同的actionType来执行不同的state变更
	1.store.dispatch({
		type:"fds",
		data:"fds"
	});
	2.自动执行到reducer，如果用了Redux.combineReducers，那么里面所有的函数都会执行一遍，每一个函数名称代表state的一个属性，根据actionType来判断执行那个state变更
	3.state变更导致UI更新
*/