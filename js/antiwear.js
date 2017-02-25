/**
 * Created by cqq on 2016/2/15.
 * 数据加密储存,防止内存修改。
 * 目前只能支持数字
 */
var Antiwear = function (encrypt) {
    this.encrypt =encrypt;
    //pseudo value
    this.data = {};
    //realy value
    this._data = {};

    this.decodeVal =null;

    //131 972
    //108 220
};

Antiwear.prototype.destory = function () {
    this.encrypt =null;
    this.decodeVal =null;
    delete this.encrypt;
    delete this.data;
    delete this._data;
};

Antiwear.prototype.setEncryptProperty = function (property, value) {
    this.data[property] = value;
    if(!this._data[property]){
        this._data[property] =[];
    }else{
        this._data[property].length =0;
    }
    this.encrypt.encode(value, this._data[property]);
    //cc.log("property", property, value, this._data[property]);
};

Antiwear.prototype.getEncryptProperty = function (property) {
    if (property == null){
        return null;
    }
    this.decodeVal = this.encrypt.decode(this._data[property]);
    if (this.decodeVal != this.data[property]){
        this.defaultErrorHandler();
    }
    return this.decodeVal;
};

/*
* 自动生成注释，prop 属性名  defVal初始值   proto可选参数
* */
Antiwear.prototype.defineEncryptGetterSetter = function (prop, defVal, proto) {
    var self =this;
    var desc = { enumerable: false, configurable: true };
    desc.set = function (v) {
        self.setEncryptProperty(prop, v);
    };
    desc.get = function () {
        return self.getEncryptProperty(prop);
    };
    if(proto){
        Object.defineProperty(proto, prop, desc);
        proto[prop] =defVal;
    }else{
        Object.defineProperty(this, prop, desc);
        this[prop] =defVal;
    }
};

Antiwear.prototype.defaultErrorHandler = function () {
    cc.log("数据验证失败,请勿修改");
    checkDataFailDeal();
};

var SimpleEncrypt = function () {
    var _ran =Math.random() * 10000;
    var _max =655360;

    var encodeCommand = function (v) {
        return (v ^ _ran)>>_max;
    };

    var decodeCommand = function (v) {
        return ((v << _max) ^ _ran);
    };

    /**
     * 加密
     * @param	data
     */
    this.encode = function (data) {
        return encodeCommand(data);
    };

    /**
     * 解密
     * @param	data
     */
    this.decode = function (data) {
        return decodeCommand(data);
    };
};

//二进制数据加密，先转Unicode编码，在拆封每个字符偏移加密存成数组,比较消耗内存（不建议）
var BinaryEncrypt = function () {
    var _ran =Math.random() * 10000;
    var _max =655360;
    var result ="";

    var encodeCommand = function (v) {
        return (v ^ _ran)>>_max;
    };

    var decodeCommand = function (v) {
        return ((v << _max) ^ _ran);
    };

    var bin2String =function(array) {
        result ="";
        for (var i = 0; i < array.length; i++) {
            result += String.fromCharCode(parseInt(decodeCommand(array[i]), 2));
        }
        return Number(result);
    };

    var string2Bin =function(str, dataAry) {
        str =str.toString();
        for (var i = 0; i < str.length; i++) {
            dataAry.push(encodeCommand(str.charCodeAt(i).toString(2)));
        }
    };

    /**
     * 加密
     * @param	data
     */
    this.encode = function (data, dataAry) {
        return string2Bin(data, dataAry);
    };

    /**
     * 解密
     * @param	data
     */
    this.decode = function (data) {
        if (typeof data === 'object' && Object.prototype.toString.call(data) === '[object Array]'){
            return bin2String(data);
        }else{
            console.log("数据类型不正确");
        }
    };
};

var hasCheckDataFailDeal = false;
var checkDataFailDeal = function () {
    if (hasCheckDataFailDeal) {
        return;
    }
    hasCheckDataFailDeal = true;
    if (cc.sys.isNative) {
        if (viewManager.getCurrentSceneName() == viewConst.SCENE_NAME.BATTLE_SCENE) {
            //cc.director.getRunningScene().manager.pause();
        }
        var timeId =setTimeout(function () {
            clearTimeout(timeId);
            cc.director.end();
        }, 10000);  //10秒之后一定退出
    }
    pomelo.newRequest('scene.playerHandler.findWG', {error:new Error().stack}, function () {
        DialogView.show(["外挂", "警告！检测到数据异常，请勿使用外挂作弊，违者将受到惩罚!", 0, function () {
            if (cc.sys.isNative) {
                cc.director.end();
            }
        }]);
    });
};

var hasCheckFastFailDeal = false;
var checkFastFailDeal = function (clientInterval, serverInterval) {
    if (clientInterval > serverInterval + 5000 && (clientInterval - serverInterval) / clientInterval > 0.2) {
        if (hasCheckFastFailDeal) {
            return;
        }
        hasCheckFastFailDeal = true;
        if (cc.sys.isNative) {
            if (viewManager.getCurrentSceneName() == viewConst.SCENE_NAME.BATTLE_SCENE) {
                //cc.director.getRunningScene().manager.pause();
            }
            setTimeout(function () {
                cc.director.end();
            }, 30000);  //10秒之后一定退出
        }
        DialogView.show(["外挂", "警告！请勿在游戏过程中修改系统时间或者使用加速器!", 0, function () {
            if (cc.sys.isNative) {
                cc.director.end();
            }
        }]);
    }
};