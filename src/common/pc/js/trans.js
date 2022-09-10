
//arr里面没项的id就是评论本身的id，linkOther是它回复的节点的数据；linkOrigin是源头文章的数据
//arr:[{_id,time,content,level,linkUser,linkOther,linkOrigin,personInfo}]
// linkOther|linkOrigin:{category,targetId}：回复哪条信息
// personInfo:{name,userPic....}//user表的数据结构：评论人员的个人信息

//转化后的数据结构:[{id,time,content,level,linkUser,linkOther,linkOrigin,personInfo,childArr}...]
//childArr是子数组，结构还是[{id,time,inkOrigin,personInfo,childArr}...]
//只要有级联，无限循环嵌套下去：把一个一维数组，通过元素.id和元素.linkOther.targetId做关联
//如果元素A.linkOther.targetId和其中一个元素B的id相等，那元素A就放到元素B的childArr数组中去

//uid:文章作者的id
//relatedId:关联的上一级评论|文章的id
// isLogin 是否登录状态,非登录状态,isAuthor和isFavActive都为false
function trans(arr,relatedId,uid,isLogin) {
    var rstArr=[],reArr=[],temp=null,childArr=null,isAuthor=false,isFavActive=false;
    var id;
    var curArr=arr.filter(function(el) {
        var isLevel1=(el&&el.linkOther&&el.linkOther.targetId==relatedId);
        if(!isLevel1){
            rstArr.push(el);
        }
        return isLevel1
    });
    curArr.sort(function(cur,next){//时间越近越靠前；sort只能做减法，不能用boolean
        return next.time-cur.time;
    });

    //注意，这个arr数组，后端传过来的id字段是_id,所以需要修改名称，做到前端统一用id，不在后端修改是为了
    // 减轻后端服务器压力
    curArr.forEach(function({_id,id,time,content,level,linkUser,linkOther,linkOrigin,personInfo,repliedUserInfo},idx) {
        id=_id||id;//有的接口返回id，有的返回_id，这里做统一
        childArr=trans(rstArr,id,uid,isLogin);

        personInfo=(personInfo&&personInfo.length)?personInfo[0]:{};
        repliedUserInfo=(repliedUserInfo&&repliedUserInfo.length)?repliedUserInfo[0]:{};
        isAuthor=(isLogin&&linkUser&&linkUser.uid&&(linkUser.uid==uid))?true:false;
        if(linkUser){
            linkUser.favNum=linkUser.fav?(linkUser.fav.length||0):0;
            if(linkUser.fav&&linkUser.fav.length){
                isFavActive=isLogin&&(linkUser.fav.some(function(item) {
                    return item==uid
                })?true:false);
            }
        }
        time=new Date(time).format().substr(0,16);

        //评论是否已经被用户点过赞
        
        //！！！！！！！！！！！！！！！！！！！！！！新添加的数据，一定要在后面重置为null
        temp={
            id,time,content,level,linkUser,linkOther,linkOrigin,personInfo,repliedUserInfo,childArr,isAuthor,isFavActive
        }
        reArr.push(temp);
        temp=null,
        id=null,
        time=null,
        content=null,
        level=null,
        linkUser=null,
        linkOther=null,
        linkOrigin=null,
        personInfo=null,
        childArr=null,
        isAuthor=false,
        isFavActive=false;
    });
    return reArr
}


//因为评论数只是拆解到第二层，后面所有的数据都挤在第二层，所以得解压数据结构
//把内部所有数组都平铺开
function reverseTrans(childArr=[]) {
    var temp;
    if(!window.TempArr){
        window.TempArr=[];
    }
    childArr.forEach(function(item) {
        temp=item.childArr;
        item.childArr=null;
        window.TempArr.push(item);
        if(temp&&temp.length){
            reverseTrans(temp);
        }
    });
}

//uid是文章作者的id,这个千万别和登陆者id[就是评论者id],被评论者id搞混了
function transData(arr,id,uid,isLogin) {
    var { Cookies,Base64}=window.Util;
    var arr=trans(arr,id,uid,isLogin),resultArr=[];
    arr.forEach(function(item) {
        var str=(item.childArr&&item.childArr.length)?reverseTrans(item.childArr):null;
        item.childArr=window.TempArr;
        window.TempArr=null;
        resultArr.push(item);
    })
    window.TempArr=null;
    return resultArr;
}



var commonFunc={
    transData
}
export default commonFunc


// transData([{id:2,linkOther:{targetId:1}},{id:3,linkOther:{targetId:1}},{id:4,linkOther:{targetId:2}},{id:5,linkOther:{targetId:2}},{id:6,linkOther:{targetId:3}}],1)


// reverseTrans([
// {
//     a: 1,
//     childAr: [
//         { a: 2, childAr: [] },
//         { a: 2, childAr: [{ a: 3, childAr: [] }, { a: 3, childAr: [] }, { a: 3, childAr: [] }, { a: 3, childAr: [] }] }, { a: 2, childAr: [] }, { a: 2, childAr: [] }
//     ]
// }, 
// { a: 1, childAr: [] }, 
// { a: 1, childAr: [] }, 
// { a: 1, childAr: [] }
// ])