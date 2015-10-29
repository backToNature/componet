!(function () {
    var events = {};
    var Events = {
        on: function (key, fn) {
            if (typeof fn !== 'function') {
                return;
            }
            events[key] = events[key] || [];
            events[key].push(fn);
        },
        once: function (key, fn) {
            if (typeof fn !== 'function' || (fn.once && fn.hasExeced)) {
                return;
            }
            fn.once = true;
            fn.hasExeced = false;
            events[key] = events[key] || [];
            events[key].push(fn);
        },
        trigger: function () {
            var key = arguments[0];
            var args = [].slice.call(arguments, 1);

            var fnList = events[key] || [], i;
            for (i = 0; i < fnList.length; i++) {
                var item = fnList[i];
                if (typeof item === 'function') {
                    if (item.once && item.hasExeced) {
                        return;
                    } else if(item.once && !item.hasExeced) {
                        item.hasExeced = true;
                        item.apply(window, args);
                    } else {
                        item.apply(window, args);
                    }
                }
            }
        }
    };
// RequireJS && SeaJS
    if (typeof define === 'function') {
        define(function() {
            return Events;
        });

// NodeJS
    } else if (typeof exports !== 'undefined') {
        module.exports = Events;
    } else {
        this.Events = Events;
    }
}());