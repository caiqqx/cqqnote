/**
 * Created by cqq on 2016/3/7.
 */
var LogicRandom = function (seed, a, c, m) {
    this.seed = seed;
    this.initSeed = seed;
    this.a = a || 214013;
    this.c = c || 2531011;
    this.m = m || 4294967296;
    this.randomNum = 0;
};

LogicRandom.prototype.getRandom = function () {
    if (!this.random2) {
        this.random2 = this.random.bind(this);
    }
    return this.random2;
};

LogicRandom.prototype.random = function (begin, end) {
    begin = (begin == undefined ? 0 : begin);
    end = (end == undefined ? 1 : end);
    ++ this.randomNum;
    if (begin === end) {
        return begin;
    }
    if (begin > end) {
        var tmp = begin;
        begin = end;
        end = tmp;
    }
    this.seed = (this.seed * this.a + this.c) % this.m;
    return (this.seed / this.m) * (end - begin) + begin;
};

LogicRandom.prototype.randomInt = function (begin, end) {
    if (begin === end) {
        return begin;
    }
    if (begin > end) {
        var tmp = begin;
        begin = end;
        end = tmp;
    }
    return Math.floor(this.random() * (end - begin + 1)) % (end - begin + 1) + begin;
};

//概率是否触发
LogicRandom.prototype.randomOcced = function (radio) {
    if (!radio) {
        return false;
    }
    return this.random() <= radio;
};

LogicRandom.prototype.getArrayRand = function (probs) {
    var totalProbs = 0;
    for (var i in probs) {
        totalProbs += probs[i];
    }

    var rand = this.random() * totalProbs;
    for (var j in probs) {
        if (rand <= probs[j]) {
            return Number(j);
        }
        rand = rand - probs[j];
    }

    return 0;
};

LogicRandom.prototype.arrayNoRepeatRandom = function (arr, num) {
    if (arr.length > 5 * num) {
        var randoms = {};
        var arrs = [];
        for (var i = 0; i < num; ++ i) {
            var r;
            do {
                r = this.randomInt(0, arr.length - 1);
            } while (randoms[r]);
            randoms[r] = true;
            arrs.push(arr[r]);
        }

        return arrs;
    }
    if (arr.length == num) {
        return arr;
    }
    var arrs = [];
    var tmps = [];
    for (var i in arr) {
        tmps.push(arr[i]);
    }
    for (var i = 0; i < num; ++ i) {
        if (tmps.length == 0) {
            break;
        }
        var r = this.randomInt(0, tmps.length - 1);
        arrs.push(tmps[r]);
        tmps.splice(r, 1);
    }
    return arrs;
};

LogicRandom.prototype.getCheckRandomMd5 = function(){
    this.randomInt(1,100000000);
    return Math.floor(this.randomInt(1,100000000) / 5.7659922261);
};