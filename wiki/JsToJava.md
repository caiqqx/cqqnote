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

## 手机读写文件

----

有时候需要手机记录游戏本地的log，cocos2dx js的 jsb.fileUtils没有创建文本的方法，所以需要用java来创建

```java
public void _createText (final String _path, final String _fileName) {
		Log.i("--createText--","createText");
		activity.runOnUiThread(new Runnable () { 
			@Override 
            public void run() {
		        File file = new File(_path);
		        Log.i("createText",_path);
		        if (!file.exists()) {
		            try {
		                //按照指定的路径创建文件夹 
		                file.mkdirs();
		                Log.i("createText","create dir success");
		            } catch (Exception e) {
		                // TODO: handle exception
		            }
		        }
		        File dir = new File(_path + "/" +_fileName);
		        if (!dir.exists()) {
		              try {
		                  //在指定的文件夹中创建文件  
		                  dir.createNewFile();
		                  Log.i("createText","create file success");
		            } catch (Exception e) {
		            }
		        }
			} 
		});
	}
```

在java层创建，然后在js层调用;

```javascript
sdkApi.js
sdkApi.createText = function (_path, _fileName) {
    if (!cc.sys.isNative) return;
    if (cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod("org/plugin/manager/PluginManager", "createText", "(Ljava/lang/String;Ljava/lang/String;)V", _path, _fileName);
    }
};

utils.js
//创建文本
utils.createText = function (_fileName) {
    if(cc.sys.isNative && jsb.fileUtils){
        var writePath = jsb.fileUtils.getWritablePath() + "zmxywzLog";
        sdkApi.createText(writePath, _fileName+".txt");
    }
};

//写日志
utils.writeLog = function (_fileName, _contentStr) {
    if(cc.sys.isNative && jsb.fileUtils){
        var writePath = jsb.fileUtils.getWritablePath() + "zmxywzLog/" + _fileName + ".txt";
        jsb.fileUtils.writeStringToFile(_contentStr, writePath);
    }
};
```