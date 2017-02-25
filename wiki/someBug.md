## 遇到的bug总结
- 如果报`this._super`不是方法，可能是该文件是jsc，其它文件是js，jsc是优先加载。
所以看看是不是热更新文件夹里面还存有该类的jsc.
- 如果卡在logo界面，可以试着查看下是否有js文件没有写到jsList里面。
- 接入4399SDK, 导入项目关联后，需要把libs里面的armeabi-v7a与x86文件夹删除
- If you get errors in the Eclipse when you imported the Android project. Don't worry, just import the libcocos2dx project will get ride of it.
- If you imported all the projects and the errors remains, you might need to build the libcocos2dx project manually and to see whether there is a libcocos2dx.jar file under the bin directory.
- If you installed the project in your Android phone but it crashed when launching. You should make sure there is a libxxx.so file under the libs/armeabi directory.