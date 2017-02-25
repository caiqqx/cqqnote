/**
 * Created by lkz on 2016/3/4.
 */
function Operate(){

}

Operate.setArrFloat = function (arr) {
    for (var i = 0; i < arr.length; i++) {
        arr[i] = parseFloat(arr[i]);
    }
    return arr;
};

Operate.analysisDataFormat = function (arr) {
    var result = [];
    for(var i = 0; i < arr.length; i++){
        result.push("res/data/" + arr[i] + ".json");
    }
    return result;
};

Operate.getNumFromStr = function (s) {
    return parseInt(s.replace(/[^0-9]/ig, ""));
};

Operate.cloneObj = function(obj) {
    var o;
    if (typeof obj == "object") {
        if (obj === null) {
            o = null;
        } else {
            if (obj instanceof Array) {
                o = [];
                for (var i = 0, len = obj.length; i < len; i++) {
                    o.push(this.cloneObj(obj[i]));
                }
            } else {
                o = {};
                for (var j in obj) {
                    o[j] = this.cloneObj(obj[j]);
                }
            }
        }
    } else {
        o = obj;
    }
    return o;
};

Operate.getTwoEntityDistance = function (entity1, entity2) {
    return Math.sqrt(Math.pow(entity1.x - entity2.x, 2) + Math.pow(entity1.y - entity2.y, 2));
};

Operate.getTwoPosDistance = function (pos1, pos2) {
    return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
};

//弧度
Operate.getTwoRadian = function (pos1, pos2) {
    var dx = pos1.x - pos2.x,
        dy = pos1.y - pos2.y,
        radian = Math.atan2(dy, dx);
    return radian;
};

//角度
Operate.getTwoAngle = function (pos1, pos2) {
    var cAngle = this.getTwoRadian(pos1, pos2) * 180 / Math.PI;
    cAngle = cAngle < 0 ? cAngle + 360 : cAngle;
    return cAngle;
};

//根据中心点坐标，获得随机离中心点distance距离的随机坐标
Operate.getRandomDistancePos = function (pos, distance) {
    var offset1 = -distance * .5 + Math.random() * distance;
    var offset2 = -distance * .5 + Math.random() * distance;
    return cc.p(pos.x + offset1, pos.y + offset2);
};

Operate.getSpeedByAngle = function (pos1, pos2, spd) {
    var radian = Operate.getTwoRadian(pos1, pos2);
    var pos = cc.p(Math.cos(radian) * spd, Math.sin(radian) * spd);
    return pos;
};