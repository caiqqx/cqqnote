下载cocos2dx解压配置好路径(运行setup.py)
/r先预编译库文件，不然会有很多库丢失    cocos gen-libs ...
新建项目，包名最好不要有纯数字eg.com.1234.xxx

Android：
android 需要修改项目frameworks\runtime-src\proj.android\build_native.py 里面的引擎路径
运行build_native.py
成功后就可以开始打包 cocos compile ...
