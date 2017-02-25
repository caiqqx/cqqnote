var utils = utils || {};

// control variable of func "myPrint"
var isPrintFlag = false;
// var isPrintFlag = true;

/**
 * Check and invoke callback function
 */
utils.invokeCallback = function (cb) {
    if (!!cb && typeof cb === 'function') {
        cb.apply(null, Array.prototype.slice.call(arguments, 1));
    }
};

/**
 * inherits properties
 * */
utils.inherits = function (child, parent) {
    if ('function' !== typeof child)
        throw new TypeError('#extend- child should be Function');

    if ('function' !== typeof parent)
        throw new TypeError('#extend- parent should be Function');

    if (child === parent)
        return;

    var c = function () {
    };
    c.prototype = parent.prototype;
    child.prototype = new c;
    child.prototype.constructor = child;
};

utils.distance = function (x1, y1, x2, y2) {
    return Math.sqrt(utils.distance2(x1, y1, x2, y2));
};

utils.distance2 = function (x1, y1, x2, y2) {
    if (typeof x1 === 'object') {
        y2 = y1.y;
        x2 = y1.x;
        y1 = x1.y;
        x1 = x1.x;
    }
    var dx = x2 - x1;
    var dy = y2 - y1;
    return dx * dx + dy * dy;
};

utils.getDistance = function (currentPos, targetPos) {
    return Math.sqrt(Math.pow(currentPos.x - targetPos.x, 2) + Math.pow(currentPos.y - targetPos.y, 2));
};

/**
 * 生成配置计算公式
 * @param str
 * @param errFun
 * @returns {Object}
 */
utils.mySaleFunEval = function (str, errFun) {
    var formulaStr = 'var fun = function(){ return ' + str + '};fun;';
    try {
        return eval(formulaStr);
    } catch (e) {
        cc.log('执行eval错误', formulaStr);
        errFun && errFun();
        throw e;
    }
};

utils.replaceFormula = function (str) {
    return str.replace(/\.\./g, ',');
};

/**
 * clone an object
 */
utils.clone = function (origin) {
    if (!origin) {
        return;
    }

    var obj = {};
    for (var f in origin) {
        if (origin.hasOwnProperty(f)) {
            obj[f] = origin[f];
        }
    }
    return obj;
};

/**
 * 深度复制对象
 */
utils.cloneObj = function (obj) {
    var o;
    switch (typeof obj) {
        case 'undefined':
            break;
        case 'string':
            o = obj + '';
            break;
        case 'number':
            o = obj - 0;
            break;
        case 'boolean':
            o = obj;
            break;
        case 'object':
            if (obj === null) {
                o = null;
            } else {
                if (obj instanceof Array) {
                    o = [];
                    for (var i = 0, len = obj.length; i < len; i++) {
                        o.push(utils.cloneObj(obj[i]));
                    }
                } else {
                    o = {};
                    for (var k in obj) {
                        o[k] = utils.cloneObj(obj[k]);
                    }
                }
            }
            break;
        default:
            o = obj;
            break;
    }
    return o;
}

/**
 * 拷贝对象属性
 * @param  {[type]} ori        拷贝来源
 * @param  {[type]} tar        拷贝对象
 * @param  {[type]} canRewrite 是否覆盖,默认为true
 * @return {[type]}
 */
utils.copyObj = function (ori, tar, canRewrite) {
    if (typeof canRewrite == "undefined")
        canRewrite = true;

    if (typeof ori == "undefined") {
        cc.log("对象为空, ", ori, tar);
        return;
    }

    for (var key in ori) {
        var item = ori[key];
        if (typeof tar != "undefined" && typeof tar[key] != "undefined") {
            if (canRewrite) {
                if (typeof ori[key] == "object")
                    utils.copyObj(ori[key], tar[key], canRewrite);
                else
                    tar[key] = ori[key];
            }
        } else {
            if (typeof ori[key] == "object")
                utils.copyObj(ori[key], tar[key], canRewrite);
            else {
                if (typeof tar == "undefined")
                    tar = ori instanceof Array ? [] : {};
                tar[key] = ori[key];
            }
        }
    }
};

utils.size = function (obj) {
    if (!obj) {
        return 0;
    }

    var size = 0;
    for (var f in obj) {
        if (obj.hasOwnProperty(f)) {
            size++;
        }
    }

    return size;
};

//往源数组里面追加元素
utils.append = function (object1, object2) {
    for (var i in object2) {
        object1.push(object2[i]);
    }
    return object1;
};

//往源数组里面插入元素
utils.insert = function (object1, object2) {
    for (var i in object2) {
        object1[i] = object2[i];
    }
    return object1;
};

utils.compareArray = function (arr1, arr2) {
    if (arr1.length != arr2.length) {
        return false;
    }
    for (var i = 0, len = arr1.length; i < len; ++i) {
        if (arr1[i] != arr2[i]) {
            return false;
        }
    }
    return true;
};

// print the file name and the line number ~ begin
function getStack() {
    var orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function (_, stack) {
        return stack;
    };
    var err = new Error();
    Error.captureStackTrace(err, arguments.callee);
    var stack = err.stack;
    Error.prepareStackTrace = orig;
    return stack;
}

function getFileName(stack) {
    return stack[1].getFileName();
}

function getLineNumber(stack) {
    return stack[1].getLineNumber();
}

utils.myPrint = function () {
    if (isPrintFlag) {
        var len = arguments.length;
        if (len <= 0) {
            return;
        }
        var stack = getStack();
        var aimStr = '\'' + getFileName(stack) + '\' @' + getLineNumber(stack) + ' :\n';
        for (var i = 0; i < len; ++i) {
            aimStr += arguments[i] + ' ';
        }
        console.log('\n' + aimStr);
    }
};
// print the file name and the line number ~ end

utils.getFileMd5 = function (areaId) {
    if (!cc.sys.isNative) return "";
    var filename = getDataManager().getMapPathFromAreaId(areaId);
    if (jsb.fileUtils.fullPathForFilename(filename) === "") return "";
    var md = hex_md5(jsb.fileUtils.getStringFromFile(filename));
    cc.log(filename + "--------" + md);
    return md;
};

utils.getDropRandom = function (drops) {
    var dropRandom = [];
    for (var monsterId in drops.seeds) {
        dropRandom.push({
            monsterId: monsterId,
            seed: drops.seeds[monsterId]
        });
    }
    dropRandom.push({
        monsterId: 0,
        seed: drops.seed2
    });
    return dropRandom;
};

utils.getRandomSeed = function () {
    return Math.floor(Math.random() * 2000000000);
};

// 计算中文长度
utils.getStringRealLength = function (str) {
    return str.replace(/[^\x00-\xff]/g, '__').length;
};

utils.convertNumToStr = function (num) {
    var chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    var chnUnitSection = ["", "万", "亿", "万亿", "亿亿"];
    var chnUnitChar = ["", "十", "百", "千"];

    var sectionToChinese = function (section) {
        var strIns = '', chnStr = '';
        var unitPos = 0;
        var zero = true;
        while (section > 0) {
            var v = section % 10;
            if (v === 0) {
                if (!zero) {
                    zero = true;
                    chnStr = chnNumChar[v] + chnStr;
                }
            } else {
                zero = false;
                strIns = chnNumChar[v];
                strIns += chnUnitChar[unitPos];
                chnStr = strIns + chnStr;
            }
            unitPos++;
            section = Math.floor(section / 10);
        }
        return chnStr;
    };

    var unitPos = 0;
    var strIns = '', chnStr = '';
    var needZero = false;

    if (num === 0) {
        return chnNumChar[0];
    }

    while (num > 0) {
        var section = num % 10000;
        if (needZero) {
            chnStr = chnNumChar[0] + chnStr;
        }
        strIns = sectionToChinese(section);
        strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0];
        chnStr = strIns + chnStr;
        needZero = (section < 1000) && (section > 0);
        num = Math.floor(num / 10000);
        unitPos++;
    }
    var len = chnStr.length;
    //十的简度 如：11--(一十一)-->(十一)
    if (len >= 2) {
        if (chnStr.charAt(0) == "一" && chnStr.charAt(1) == "十") {
            chnStr = chnStr.substring(1, len);
        }
    }
    return chnStr;
};

utils.sign = function (v) {
    return v >= 0 ? 1 : -1;
};

/**
 * 判断字符串是否为空或者都是空格
 * @param str
 * @returns {boolean}
 */
utils.stringisNull = function (str) {
    if (str == "") return true;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    return re.test(str);
};

/**
 * 毫秒转时间
 * @param  {int} msd 时间戳
 * @return {object} {hour, min, second}
 */
utils.millisecondToDate = function (msd) {
    var time = parseFloat(msd) / 1000;
    var hour = parseFloat(time / 3600.0);
    var data = {};
    data.hour = parseInt(hour);
    var min = parseFloat((hour - data.hour) * 60);
    data.min = parseInt(min);
    data.second = parseInt((min - data.min) * 60);
    return data;
};

utils.formatTime2 = function (_time) {
    _time = Math.floor(_time);
    var curTime = getDataManager().getServerTime();
    _time = Math.floor(curTime - _time);

    if (_time <= 0)
        return "1秒前";

    var mt = Math.floor(_time / (30 * 86400000));
    var day = Math.floor(_time / 86400000);
    var hh = Math.floor(_time / 3600000);
    var mm = Math.floor(_time / 60000);
    if (mt > 1) {
        return (mt + "个月前");
    } else if (day >= 1) {
        return (day + "天前");
    } else if (hh >= 1) {
        return (hh + "小时前");
    } else if (mm >= 1) {
        return (mm + "分钟前");
    } else {
        return (Math.floor(_time / 1000) + "秒前");
    }
};

/**
 * 返回时间数字格式(分：秒)
 * @param _time 单位秒s
 * @returns {*}
 */
utils.formatTime3 = function (_time) {
    _time = Math.floor(_time);
    if (_time <= 0) return "00:00";
    var tf = function (i) {
        return (i < 10 ? "0" : "") + i;
    };
    var mm = Math.floor(_time / 60);
    var ss = (_time - (mm * 60));
    return tf(mm) + ":" + tf(ss);
};

/**
 * 返回时间文字格式,向下取整(天,小时,分钟)
 * @param _time 单位毫秒
 * @param overTxt 结束文本,默认 已到期
 */
utils.formatTime4 = function (_time, overTxt) {
    overTxt = overTxt || "已到期";
    if (_time <= 0)
        return overTxt;
    if (_time > 86400000)
        return Math.floor(_time / 86400000) + "天" + Math.floor(_time % 86400000 / 3600000) + "小时";
    if (_time > 3600000)
        return Math.floor(_time / 3600000) + "小时" + Math.floor(_time % 3600000 / 60000) + "分钟";
    if (_time > 60000)
        return Math.floor(_time / 60000) + "分钟";
    else
        return "1分钟";
};
/**
 * 返回时间格式(1970.01.01)
 * @param _time 单位毫秒
 * @param hasTime 是否显示小时,默认false
 */
utils.formatTime5 = function (_time, hasTime) {
    var tf = function (i) {
        return (i < 10 ? "0" : "") + i;
    };
    var date = new Date(_time);
    var obj = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        date: date.getDate(),
        hour: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds()
    };
    var str = "";
    if (hasTime)
        str = tf(obj.year) + "." + tf(obj.month) + "." + tf(obj.date) + " " + tf(obj.hour) + ":" + tf(obj.minutes) + ":" + tf(obj.second);
    else
        str = tf(obj.year) + "." + tf(obj.month) + "." + tf(obj.date);
    return str;
};

/**
 * 返回时间格式(1970年1月1日)
 */
utils.formatTime6 = function (_time, hasYear, hasMonth, hasDate, hasHours, hasMinutes, hasSeconds) {
    var tf = function (i) {
        return (i < 10 ? "0" : "") + i;
    };
    var date = new Date(_time);
    var obj = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        date: date.getDate(),
        hour: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds()
    };
    var str = "";
    if (hasYear) {
        str += (tf(obj.year) + "年");
    }
    if (hasMonth) {
        str += (tf(obj.month) + "月");
    }
    if (hasDate) {
        str += (tf(obj.date) + "日");
    }
    if (hasHours) {
        str += (tf(obj.hour) + "");
    }
    if (hasMinutes) {
        str += (":" + tf(obj.minutes));
    }
    if (hasSeconds) {
        str += (":" + tf(obj.second));
    }
    return str;
};

utils.formatTime = function (_time) {
    _time = Math.floor(_time);
    if (_time <= 0) return "00:00:00";
    var tf = function (i) {
        return (i < 10 ? "0" : "") + i;
    };
    var hh = Math.floor(_time / 3600);
    var mm = Math.floor((_time - (hh * 3600)) / 60);
    var ss = (_time - (hh * 3600) - (mm * 60));
    return tf(hh) + ":" + tf(mm) + ":" + tf(ss);
};

utils.formatMoney = function (_money) {
    if (_money >= 10000000)
        return Math.floor(_money / 10000000) + "千万";
    else if (_money >= 1000000)
        return Math.floor(_money / 1000000) + "百万";
    else if (_money >= 10000)
        return Math.floor(_money / 10000) + "万";
    else
        return _money;
};

/**
 * 自增，生成实体id
 * @returns {Function}
 */
utils.generateInts = function () {
    var incInt = 0;
    return function () {
        ++incInt;
        if (incInt >= 2000000000) {
            incInt = 1;
        }
        return incInt;
    }
};

//绘制boundingbox
utils.drawNodeBoundingBox = function (node, parentNode) {
    var drawNode = cc.DrawNode.create();
    drawNode.setDrawColor(cc.color(255, 0, 0, 255));
    parentNode.addChild(drawNode, 10000);
    var rect = node.getBoundingBox();
    cc.log("rect ------>>", rect.x, rect.y, rect.width, rect.height);
    drawNode.clear();
    drawNode.drawRect(cc.p(rect.x, rect.y), cc.p(cc.rectGetMaxX(rect), cc.rectGetMaxY(rect)));
};

//给按钮文本加描边
utils.setButtonStroke = function (button, color, size) {
    var buttonLabel = button.getTitleRenderer();
    if (buttonLabel) {
        buttonLabel.enableStroke(color, size);
    }
};

//按钮状态
utils.setButtonEnabled = function (button, bool, enaTxt, disTxt, enaColor, enaStrokeColor, disColor, disStrokeColor) {
    button.setTouchEnabled(bool);
    button.setBright(bool);
    if (bool) {
        if (enaTxt)
            button.setTitleText(enaTxt);
        button.setTitleColor(enaColor ? cc.hexToColor(enaColor) : cc.hexToColor("#891818"));
        utils.setButtonStroke(button, enaStrokeColor ? cc.hexToColor(enaStrokeColor) : cc.hexToColor("#EEE5B8"), 2)
    } else {
        if (disTxt)
            button.setTitleText(disTxt);
        button.setTitleColor(disColor ? cc.hexToColor(disColor) : cc.hexToColor("#4D4D4D"));
        utils.setButtonStroke(button, disStrokeColor ? cc.hexToColor(disStrokeColor) : cc.hexToColor("#BFBFBF"), 2)
    }
};

/**
 * lable数字自增
 * @param delay
 * @param label
 * @param preVal
 * @param nowVal
 * @param finishCb
 */
utils.autoCountLabel = function (label, preVal, nowVal, finishCb, delay) {
    if (preVal == nowVal) {
        label.setString(nowVal);
        return;
    }
    label.stopAllActions();
    delay = delay || 0;
    var currentVal = preVal;
    var deltaVal = 0;
    var add = 0;
    var countFun = function () {
        deltaVal = nowVal - preVal;
        add = Math.ceil(deltaVal / 60);
        currentVal += add;
        if (currentVal >= nowVal) {
            label.setString(nowVal);
            finishCb && finishCb();
            label.stopActionByTag(9999);
            return;
        }
        label.setString(currentVal);
    };
    var runLabelAction = function (__label) {
        var labelAction = cc.repeatForever(cc.sequence(
            cc.delayTime(0.0167),
            cc.callFunc(countFun, __label)
        ));
        labelAction.setTag(9999);
        __label.runAction(labelAction);
    };
    if (delay > 0) {
        label.runAction(cc.sequence([
            cc.delayTime(delay),
            cc.callFunc(runLabelAction, label, label)
        ]));
    } else {
        runLabelAction(label);
    }
};

/**
 * 去掉换行
 * @param key
 * @returns {XML|string|*}
 */
utils.clearBr = function (key) {
    key = key.replace(/<\/?.+?>/g, "");
    key = key.replace(/[\r\n]/g, "");
    return key;
};

// 实例化类
utils.newClass = function (cc, args) {
    if (args && args.length > 0) {
        switch (args.length) {
            case 1:
                return new cc(args[0]);
            case 2:
                return new cc(args[0], args[1]);
            case 3:
                return new cc(args[0], args[1], args[2]);
            case 4:
                return new cc(args[0], args[1], args[2], args[3]);
            case 5:
                return new cc(args[0], args[1], args[2], args[3], args[4]);
            case 6:
                return new cc(args[0], args[1], args[2], args[3], args[4], args[5]);
            default:
                cc.error("args.length 超出");
                return;
        }

    }
    return new cc();
};


/**
 * sort排序比较
 * @param  {string} name  键值
 * @param  {function} minor 比较函数的递归
 * @return {Number}
 *
 * @example
 * var arr[{name:"11", num:11},{name:"22", num:22}];
 * arr.sort(utils.sortCompare("name", utils.sortCompare(num)));
 */
utils.sortCompare = function (name, minor) {
    return function (o, p) {
        var a, b;
        if (o && p && typeof o === 'object' && typeof p === 'object') {
            a = o[name];
            b = p[name];
            if (a === b) {
                return typeof minor === 'function' ? minor(o, p) : 0;
            }
            if (typeof a === typeof b) {
                return a < b ? -1 : 1;
            }
            return typeof a < typeof b ? -1 : 1;
        } else {
            cc.error("sort error, obj is null", o, p);
        }
    }
};

/**
 * 保留n位小数
 * @param  {Number} value 原值
 * @param  {int} len   长度
 * @return {Number}
 */
utils.toFixed = function (value, len) {
    len = len || 1;
    var f = parseFloat(value);
    if (isNaN(f))
        return;

    var mNum = Math.pow(10, len);
    f = Math.round(value * mNum) / mNum;
    return f;
};

//强制保留2位小数，如：2，会在2后面补上00.即2.00
utils.toDecimal2 = function (x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    var f = Math.round(x * 100) / 100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
};

// Http Get 请求
utils.HttpGet = function (fullUrl, fnCallback, target, savePath, data) {
    var xhr = cc.loader.getXMLHttpRequest();
    if (savePath) {
        xhr.responseType = "file";
        xhr.savePath = savePath;
    }
    xhr.open("GET", fullUrl);
    xhr.setRequestHeader('referer', 'http://www.4399.com');
    var ndProtected = new cc.Node();
    xhr.onerror = function () {
        if (!cc.sys.isObjectValid(ndProtected)) {
            return; // 节点已被删了, 可能是游戏被重新加载了
        }
        utils.SafeRemoveNode(ndProtected);
        fnCallback.call(target, false);
    };
    xhr.onreadystatechange = function () {
        if (!cc.sys.isObjectValid(ndProtected)) {
            return; // 节点已被删了, 可能是游戏被重新加载了
        }
        utils.SafeRemoveNode(ndProtected);
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 207)) { // 成功
            fnCallback.call(target, true, xhr.response, data);
        } else { // 失败
            fnCallback.call(target, false);
        }
    };
    xhr.send();
    cc.director.getRunningScene().addChild(ndProtected);
    return xhr;
};
// 安全删除某个节点
utils.SafeRemoveNode = function (delNode) {
    if (cc.sys.isObjectValid(delNode)) {
        delNode.removeFromParent(true);
    }
};

utils.getUserHeadPath = function (_userId) {
    var writePath = "";
    if (cc.sys.isNative) {
        writePath = jsb.fileUtils.getWritablePath() + "userheadDir";
        if (!jsb.fileUtils.isDirectoryExist(writePath)) {
            jsb.fileUtils.createDirectory(writePath);
        }
        writePath = jsb.fileUtils.getWritablePath() + "userheadDir/headImg_" + _userId + ".png";
    }
    return writePath;
};

utils.requestHeadImage = function (_userId, _cb1, _cb2) {
    var realUserId = _userId.split('|');
    var platform = realUserId[1];
    var userId = realUserId[0];
    var path = utils.getUserHeadPath(userId);
    cc.log("---path-->", path, userId, platform);
    if (path != "") {
        if (jsb.fileUtils.isFileExist(path)) {
            _cb2 && _cb2(path);
        } else {
            _cb1 && _cb1();
            utils.HttpGet("http://a.img4399.com/" + userId + "/small", function (beOk, textResp, data) {
                if (beOk) {
                    _cb1 && _cb1();
                    _cb2 && _cb2(path);
                }
            }, this, path, userId);
        }
    } else {
        _cb1 && _cb1();
    }
};

utils.removeHeadImage = function () {
    if (cc.sys.isNative && jsb.fileUtils) {
        var writePath = jsb.fileUtils.getWritablePath() + "userheadDir/";
        if (jsb.fileUtils.isDirectoryExist(writePath)) {
            var bool = jsb.fileUtils.removeDirectory(writePath);
            if (!bool) {
                MessageLayer.create("缓存删除失败！");
            }
        }
    }
};

/*计算文本大小*/
utils.getOneWordSize = function (_word, _fontSize) {
    var wordText = new ccui.Text();
    wordText.setFontName(gc.FontName);
    wordText.setFontSize(_fontSize);
    wordText.setString(_word);
    var box = wordText.getBoundingBox();
    wordText = null;
    return box;
};

utils.checkStringLength = function (str) {
    var strlen = 0;
    for (var i = 0, len = str.length; i < len; i++) {
        if (str.charCodeAt(i) > 255) //如果是汉字，则字符串长度加2
            strlen += 2;
        else
            strlen++;
    }
    return strlen;
};

utils.checkStringWidth = function (str, fontSize) {
    var totalWidth = 0;
    var word;
    for (var i = 0; i < str.length; i++) {
        word = utils.getOneWordSize(str.charAt(i), fontSize);
        totalWidth += word.width;
    }
    return totalWidth;
};

// 获取某月的天数
utils.getDayNum = function (time) {
    var nowTime = time ? new Date(time) : new Date();
    return new Date(nowTime.getYear(), nowTime.getMonth(), 0).getDate();
};

utils.dealUserId = function (_userId) {
    _userId = _userId + "";
    var realUserId = _userId.split('|');
    return realUserId[0];
};

utils.isEnoughPointTicket = function (pointTicket) {
    return getDataManager().getPointTicket() >= pointTicket;
};

// 检查是否同一天
utils.isSameDay = function (time1, time2) {
    if (time1 && time2) {
        var date1 = new Date(time1);
        var year1 = date1.getFullYear();
        var month1 = date1.getMonth();
        var day1 = date1.getDate();

        var date2 = new Date(time2);
        var year2 = date2.getFullYear();
        var month2 = date2.getMonth();
        var day2 = date2.getDate();
        return year1 == year2 && month1 == month2 && day1 == day2;
    } else
        return false;
};

utils.isEmptyObject = function (obj) {
    for (var key in obj)
        return false;
    return true
};