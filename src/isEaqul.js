!(function () {
    var isEqual = {
        eq: function (a, b) {
            var _this = this;
            // 如果两个变量完全等同，且不为0，则返回true。如果是0的话，要保证符号一样(0和-0认为不相等)
            if (a === b) return (a !== 0 || 1 / a === 1 / b);
            // 如果两个变量都是null或都是undefined，返回true
            if (a == null || b == null) return a === b;
            // 特殊处理NaN类型，NaN === NaN = false; NaN == NaN == false
            if (a !== a) return b !== b;
            // Exhaust primitive checks
            var type = typeof a;
            if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
            console.log(_this.deepEq);
            return _this.deepEq(a, b);
        },
        isFunction: function (obj) {
            return typeof obj == 'function' || false;
        },
        isObject: function (obj) {
            var type = typeof obj;
            return type === 'function' || type === 'object' && !!obj;
        },
        has: function (obj, key) {
            return obj != null && hasOwnProperty.call(obj, key);
        },
        keys: function (obj) {
            var _this = this;
            if (!_this.isObject(obj)) return [];
            if (Object.keys) return Object.keys(obj);
            var keys = [];
            for (var key in obj) if (_this.has(obj, key)) keys.push(key);
            // Ahem, IE < 9.
            if (hasEnumBug) collectNonEnumProps(obj, keys);
            return keys;
        },
        deepEq: function (a, b) {
            var _this = this;
            var className = Object.prototype.toString.call(a);
            if (className !== Object.prototype.toString.call(b)) return false;
            switch (className) {
              // Strings, numbers, regular expressions, dates, and booleans are compared by value.
              case '[object RegExp]':
              // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
              case '[object String]':
                // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
                // equivalent to `new String("5")`.
                return '' + a === '' + b;
              case '[object Number]':
                // `NaN`s are equivalent, but non-reflexive.
                // Object(NaN) is equivalent to NaN
                if (+a !== +a) return +b !== +b;
                // An `egal` comparison is performed for other numeric values.
                return +a === 0 ? 1 / +a === 1 / b : +a === +b;
              case '[object Date]':
              case '[object Boolean]':
                // Coerce dates and booleans to numeric primitive values. Dates are compared by their
                // millisecond representations. Note that invalid dates with millisecond representations
                // of `NaN` are not equivalent.
                return +a === +b;
            }

            var areArrays = className === '[object Array]';
            if (!areArrays) {
              if (typeof a != 'object' || typeof b != 'object') return false;

              // Objects with different constructors are not equivalent, but `Object`s or `Array`s
              // from different frames are.
              var aCtor = a.constructor, bCtor = b.constructor;
              if (aCtor !== bCtor && !(_this.isFunction(aCtor) && aCtor instanceof aCtor &&
                                       _this.isFunction(bCtor) && bCtor instanceof bCtor)
                                  && ('constructor' in a && 'constructor' in b)) {
                return false;
              }
            }
          
            var aStack = [];
            var bStack = [];
            var length = aStack.length;
            while (length--) {
              
              if (aStack[length] === a) return bStack[length] === b;
            }

            aStack.push(a);
            bStack.push(b);

            if (areArrays) {
              // Compare array lengths to determine if a deep comparison is necessary.
              length = a.length;
              if (length !== b.length) return false;
              // Deep compare the contents, ignoring non-numeric properties.
              while (length--) {
                if (!eq(a[length], b[length], aStack, bStack)) return false;
              }
            } else {
              // Deep compare objects.
              var keys = _this.keys(a), key;
              length = keys.length;
              // Ensure that both objects contain the same number of properties before comparing deep equality.
              if (_this.keys(b).length !== length) return false;
              while (length--) {
                // Deep compare each member
                key = keys[length];
                if (!(_this.has(b, key) && _this.eq(a[key], b[key], aStack, bStack))) return false;
              }
            }
            // Remove the first object from the stack of traversed objects.
            aStack.pop();
            bStack.pop();
            return true;
        }
    };
// RequireJS && SeaJS
    if (typeof define === 'function') {
        define(function() {
            return isEqual;
        });
// NodeJS
    } else if (typeof exports !== 'undefined') {
        module.exports = isEqual;
    } else {
        this.isEqual = isEqual;
    }
}());