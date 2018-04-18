# Cocos2dx js
---

### 内容目录
[TOC]

### 1. JavaScript学习
- [JavaScript秘密花园](http://www.jb51.net/onlineread/JavaScript-Garden-CN/)

### 2. 工具跟bug
- [java调用js方法](JavaToJs.md)
- [js调用java方法](JsToJava.md)
- [开发过程遇到的一些bug](someBug.md)

### 3. 龙骨动画`ccs.Armature`
- 监听骨骼动画过程发出的事件 
``` javascript
armature.getAnimation().setFrameEventCallFunc(this.boneFrameEventCb, this);
boneFrameEventCb : function(bone, frameEventName, originFrameIndex, currentFrameIndex){

}
```
- 监听骨骼动画播放结束事件
``` javascript
armature.getAnimation().setMovementEventCallFunc(this.movementEventCb, this);
movementEventCb : function(armature, movementType, movementID){
    if (movementType == ccs.MovementEventType.complete && (movementID == "idle")) {
        //播放结束
    }
}
```
- 添加替换动画某个骨骼
``` javascript
var addNewBone = function(boneName){
    var bone = this.armature.getBone(boneName);
    if (bone) {
        bone.addDisplay(armature, 0);
        bone.changeDisplayWithIndex(0, true);
        bone.setIgnoreMovementBoneData(true);
    }
}
```
- 触摸事件里面，ios的边缘区域会有触摸延时，需要在AppController.mm里面添加以下代码
``` Object-C
after [window makeKeyAndVisible];

for(UIGestureRecognizer* gesture in window.gestureRecognizers){
    gesture.delaysTouchesBegan =NO;
}
```

