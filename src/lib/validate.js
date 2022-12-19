export function isRequire(param) {
    param = $.trim(param);
    return param && param.length;
}

export function isTel(param) {
    return /^1[34578]\d{9}$/.test(param);
}

//名字应该不会有超过21个字的，少数民族也不会有
export function isName(param) {
    param = $.trim(param);
    return /^[\u4e00-\u9fa5a-zA-Z\s]+$/.test(param) && param.length < 21;
}


export function range(val,rngObj){
	let len=(val||"").length;
	return len>=rngObj.min&&len<=rngObj.max;
}

export function isNormal(param) {//不包含特殊字符，只包含数字和字母
    param = (param||"").trim();
    return /^[A-Za-z0-9_\-]+$/.test(param);//匹配由数字、26个英文字母或者下划线组成的字符串
}

export function isURL(param) {//不包含特殊字符，只包含数字和字母
    param = (param||"").trim();
    return /(ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?/.test(param);//匹配由数字、26个英文字母或者下划线组成的字符串
}

export function isBankCard(param) {//银行卡，16位或者19位，粗略判断即可
    param = (param||"").trim().replace(/\s+/g,"");
    return /^\d{16}|\d{19}$/.test(param);//匹配由数字、26个英文字母或者下划线组成的字符串
}

export function isIDCard(param) {//银行卡，16位或者19位，粗略判断即可
    param = (param||"").trim().replace(/\s+/g,"");
    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(param);//匹配由数字、26个英文字母或者下划线组成的字符串
}

export function isUserName(val) {//正确的昵称，用户名
    let exp= /^[\u4e00-\u9fa5_a-zA-Z0-9-]{1,16}$/;
    return exp.test(val);
}

export function isPassward(val) {//正确格式的密码
    let exp= /^[_a-zA-Z0-9-]{1,16}$/;
    return exp.test(val);
}

 

