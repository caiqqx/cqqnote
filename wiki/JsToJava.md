# JavaScript调用Java
---

``` javascript
//返回字符串
var nickName =jsb.reflection.callStaticMethod("org/plugin/manager/PluginManager", "getNickName", "()Ljava/lang/String;");

//返回空
jsb.reflection.callStaticMethod("org/plugin/manager/PluginManager", "quitGame", "()V");

//传string参数
jsb.reflection.callStaticMethod("org/plugin/manager/PluginManager", "startLevel", "(Ljava/lang/String;)V", level);

//传参数string;int;double
jsb.reflection.callStaticMethod("org/plugin/manager/PluginManager", "useItem", "(Ljava/lang/String;ID)V", item, number, price);
```
