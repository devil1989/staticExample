//这个文件基本不用修改

import rootReducer from './reducer';
import * as Redux from 'Redux';
import ReduxThunk from 'ReduxThunk';
import {InitialState} from "state.js";

const finalCreateStore = Redux.compose(

	/* 正常dispatch只支持对象类型的action，需要改变store的dispatch方法，让他支持function，在function里面执行ajax，
	   在ajax的callback中调用原生的dispatch方法 ：applyMiddleware+thunk来修改store的dispatch; */
    Redux.applyMiddleware(ReduxThunk)
)(Redux.createStore);


/* 为了满足store.dispatch执行后，自动执行对应reducer，需要有一个store和reducer的关联
	   这个关联是在创建store的时候就已经定制好了的，Redux.createStore(reducer,initialState);*/
export default finalCreateStore(rootReducer,InitialState);//传入初始state
