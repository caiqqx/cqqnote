## Cocos2dx js编译打包
包名最好不要有纯数字eg.com.1234.xxx

下载cocos2dx解压配置好路径
预编译库文件    cocos gen-libs ...

新建项目
android 需要修改项目frameworks\runtime-src\proj.android\build_native.py 里面的引擎路径 

运行'build_native.py'
成功后就可以开始打包 cocos compile ...

debug版本:
> `cocos compile -s D:\packagePlace\zmxywz -p android -o D:\packagePlace\package --ap android-19`

release 版本：
> `cocos compile -s D:\packagePlace\zmxywz2 -p android  -m release -o D:\packagePlace\package --ap android-19`

导入android工程下面自己的项目工程跟libcocos2dx工程（cocos/2d/platform/android/java）

## 隐藏手机虚拟按键
有的手机会有虚拟按键，这时候会挡住我们游戏内容，所以需要把它设置隐藏掉，需要修改Acitivity类。eg.修改Cocos2dxActivity.java类。

### 1. 修改onCreate方法:
``` java
@Override
    protected void onCreate(final Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (Build.VERSION.SDK_INT >= 19) {
            View decorView = getWindow().getDecorView();
            decorView.setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_FULLSCREEN
                | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
        }
        
        // to do something...
        
        if (Build.VERSION.SDK_INT >= 19) {
            mGLSurfaceView.getViewTreeObserver().addOnGlobalFocusChangeListener(new OnGlobalFocusChangeListener() {
                
                @Override
                public void onGlobalFocusChanged(View arg0, View arg1) {
                    // TODO Auto-generated method stub
                    if (Build.VERSION.SDK_INT >= 19) {
                        View decorView = getWindow().getDecorView();
                        decorView.setSystemUiVisibility(
                            View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                            | View.SYSTEM_UI_FLAG_FULLSCREEN
                            | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
                    }
                }
            });
        }
    }
```

### 2. 修改onWindowFocusChanged方法：

``` java
@Override
    public void onWindowFocusChanged(boolean hasFocus) {
        Log.d(TAG, "onWindowFocusChanged() hasFocus=" + hasFocus);
        super.onWindowFocusChanged(hasFocus);
        
        this.hasFocus = hasFocus;
        resumeIfHasFocus();
        if (Build.VERSION.SDK_INT >= 19) {
            View decorView = getWindow().getDecorView();
            decorView.setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_FULLSCREEN
                | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
        }
    }
```
