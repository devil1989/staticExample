//所有的action，包括actionType，可以把getActionTypes里面返回的东西单独提出去
//ajax请求数据函数也在action中，因为dispatch(action)的时候，异步操作需要传入function类型的action，action里面包含了ajax请求
import { getData } from "./model";

//所有actionType，可以单独抽离
let actionTypes={
    GET_STUDY_PLAN_INFO : "GET_STUDY_PLAN_INFO"
};



//异步的的action
export function getStudyPlanList(queryData) {
	var param=queryData||{};//根据传入参数获取对应请求的param
    return function (dispatch) {

        //返回一个promise
        return getData(param).then(response => {

            dispatch({//dispatch需要传入的值
            	type:actionTypes.GET_STUDY_PLAN_INFO,
            	data:response
            });
        }, xhr => {
        	//展示error信息
        });
    };
}


//外部获取所有actionTypes
export function getActionTypes(){
    return actionTypes;
}

