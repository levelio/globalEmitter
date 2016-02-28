GlobalEmitter 
======
基于发布订阅模式的全局事件管理对象.

## 功能

1、通过命名空间机制,防止冲突
2、考虑到异步编程,可以先发布,再订阅

## 使用
普通使用
```
<script src="dist/globalEmitter.min.js"></script>
```

### API
* `create`: 接收一个字符串参数,表示要创建的命名空间名字.

* `on`: `on(key, fn, [last])`,订阅事件,`key`表示事件名称,`fn`表示事件回调, `last`为可选参数,如果传入 "last",表示如果某事件发布已经多次发布,再订阅时只触发最后一次发布.默认为全部触发.

* `off`: `off(key, [fn])`.取消订阅事件, `key`表示事件名称,`fn`表示事件回调,如果 `fn`不传入,则表示清除该事件类型下得所有订阅

* `one`: `off(key, fn, [last])`.订阅事件,清除重复订阅事件,只保留这一次订阅, `key`表示事件名称,`fn`表示事件回调,`last`为可选参数,如果传入 "last",表示如果某事件发布已经多次发布,再订阅时只触发最后一次发布.默认为全部触发.

* `emit`: `emit(key, [argument[,argument...]])` 发布事件,`key`表示事件名称,`argument`表示要发布的信息.

### 例子
#### 默认命名空间下
```
Event.on('click',function(data){ //再订阅事件
    console.log(data);
})
Event.emit('click', 1);    //先发布事件
```
#### 自定义命名空间下
```
Event.create('n1').emit('click', 1);    //先发布事件

Event.create('n1').on('click',function(data){ //再订阅事件
    console.log(data);
})
```
