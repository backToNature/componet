/*jslint browser: true, vars: true, nomen: true, indent: 4, maxlen: 80, plusplus: true, sloppy: true, newcap: true, sub: true, regexp: true, continue: true*/
/*global console: true, changyan: true*/

/**
 * @author guohao
 * @version [v1.0] 2015-08-13
 * @description 自定义model库
 */
var $$events = Events;
var dataCollection = {};
var _ = window._;
var model = (function () {
    function Model(data, fn) {
        if (!_.isObject(data)) {
            return this;
        }
        this.cid = _.uniqueId('cyanModel_');
        dataCollection[this.cid] = data;
        if (_.isFunction(fn)) {
            fn();
        }
    }

    Model.prototype.get = function (key) {
        return dataCollection[this.cid][key];
    };

    Model.prototype.has = function (key) {
        return _.has(dataCollection[this.cid], key);
    };

    Model.prototype.set = function (key, value) {
        var changing, prev, current, temp = {};
        if (key === null) {
            return this;
        }
        if (!this.has(key)) {
            return this;
        }
        changing = this._changing;
        this._changing = true;

        if (!changing) {
            this._previousData = _.clone(dataCollection[this.cid]);
            this.changed = {};
        }
        temp[key] = value;
        dataCollection[this.cid] = _.extend(dataCollection[this.cid], temp);
        current = dataCollection[this.cid]; prev = this._previousData;

        if (!_.isEqual(current[key], prev[key])) {
            $$events.trigger(this.cid, dataCollection[this.cid]);
            $$events.trigger(this.cid + key, dataCollection[this.cid]);
        }

        if (changing) {
            return this;
        }

        this._changing = false;
    };

    Model.prototype.on = function (str, fn) {
        try {
            if (!_.isFunction("fn") || !_.isString("str")) {
                throw 'error params';
            }
        } catch (e) {

        }

        var arr = str.split(':');
        if (arr.length == 1) {
            $$events.on(this.cid, fn);
        } else if (arr.length == 2) {
            $$events.on(this.cid + arr[1], fn);
        }
    };

    Model.prototype.once = function (str, fn) {
        try {
            if (!_.isFunction("fn") || !_.isString("str")) {
                throw 'error params';
            }
        } catch (e) {

        }

        var arr = str.split(':');
        if (arr.length == 1) {
            $$events.once(this.cid, fn);
        } else if (arr.length == 2) {
            $$events.once(this.cid + arr[1], fn);
        }
    };
    return Model;
}());

window.model = model;