/**
 * Created by hezhiqiang on 16/2/28.
 */
var GlobalEmitter = (function () {
    var Event, _default = 'default';
    Event = function () {
        var _on, _off, _emit, _create, namespaceCache = {};
        var _slice = Array.prototype.slice, _shift = Array.prototype.shift, _unshift = Array.prototype.unshift;
        var each = function (array, callback) {
            var ret;
            for (var i = 0, l = array.length; i < l; i++) {
                var n = array[i];
                ret = callback.call(n, n, i);
                if (ret === false) { //如果方法返回 false 代表需要结束循环
                    break;
                }
            }
        };
        _on = function (cache, key, fn) {
            if (!cache[key]) {
                cache[key] = [];
            }
            cache[key].push(fn);
        };
        _off = function (cache, key, fn) {
            var res = cache[key];
            if (res) {
                if (fn) {
                    each(res, function (n, i) {
                        if (n === fn) {
                            _slice.call(res, i, 1);
                            return false;
                        }
                    });
                } else {
                    res = [];
                }
            }
        };
        _emit = function () {
            var cache = _shift.apply(arguments), key = _shift.apply(arguments), args = arguments, res, _self = this;
            if (!(res = cache[key]) || !res.length) {
                return;
            }
            each(res, function (n) {
                n.apply(_self, args);
            });
        };
        _create = function (namespace) {
            var namespace = namespace || _default;
            var cache = {}, offlineStack = {};
            var ret = {
                on: function (key, fn, last) { // last: 注册事件的时候触发全部缓存通知还是只触发栈顶的通知
                    var offlineEvent = offlineStack[key];
                    _on(cache, key, fn);

                    //遍历 offlineStack 查询 key = key 的对象,如果查询到了,就执行
                    if (!offlineEvent) {
                        return;
                    }
                    if (last === 'last') {
                        offlineEvent.length && offlineEvent.pop()(); //执行栈顶的通知
                    } else {
                        each(offlineEvent, function () {
                            this();
                        });
                    }
                    offlineEvent = null;
                },
                one: function (key, fn, last) { //删除相同key下,其他的事件,绑定当前一个
                    _off(cache, key, fn);
                    this.on(key, fn, last);
                },
                off: function (key, fn) {
                    _off(cache, key, fn);
                },
                emit: function () {
                    _unshift.call(arguments, cache);
                    var _self = this, args = arguments, key = arguments[1], fn;
                    var offlineEvent = offlineStack[key];
                    fn = function () {
                        _emit.apply(_self, args);//_self 一定要绑定在 this 上,否则  _emit 隐式绑定的 this 是 全局对象
                    };
                    if (offlineEvent === undefined) { //offline 不是null  说明还没有人注册事件
                        if (offlineEvent instanceof Array) {
                            offlineEvent.push(fn)
                        } else {
                            offlineEvent = offlineStack[key] = [];
                            offlineEvent.push(fn);
                        }
                        return;
                    }
                    fn();
                }
            };
            return namespace ?
                (namespaceCache[namespace] ?
                    namespaceCache[namespace]
                    : namespaceCache[namespace] = ret)
                : ret;
        };
        return {
            create: _create,
            on: function (key, fn, last) {
                var event = this.create();
                event.on(key, fn, last);
            },
            one: function (key, fn, last) {
                var event = this.create();
                event.one(key, fn, last);
            },
            off: function (key, fn) {
                var event = this.create();
                event.off(key, fn);
            },
            emit: function () {
                var event = this.create();
                event.emit.apply(this, arguments);
            }
        }
    }();
    return Event;
})();