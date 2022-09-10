export function isAndroid() {
    let ua = navigator.userAgent;
    return ua.indexOf('Android') > -1;
}

export function isIpad() {
    const ua = navigator.userAgent;
    if (ua.match(/ipad/ig)) {
        return true;
    } else {
        return false;
    }
}


export function isIE(ver) {
    let b = document.createElement('b');
    b.innerHTML = `<!--[if IE ${ver}]><i></i><![endif]-->`;
    return b.getElementsByTagName('i').length === 1;
}

export function isUC() {
    let ua = navigator.userAgent;
    return ua.indexOf('Linux') > -1;
}


export function isMobile(){
	return !!navigator.userAgent.match(/Mobile/gi);
}


//横屏竖屏转化调用事件
// window.addEventListener('orientationchange', function(){});