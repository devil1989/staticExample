//这里放所有组件的初始化数
const InitialState=window.INITIAL_STATE||{solutions:{},user:{},items:[1,2]};//不同的组件，会有不同的初始化state，初始化的state是从初始化的ajax中获取的，

export {InitialState};