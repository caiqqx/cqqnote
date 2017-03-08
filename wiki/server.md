## 一些常用的命令

- 上传 `rz`

- 下载 `sz`

- 新建文件夹 `mkdir`

- 删除文件：`rm` 参数 文件，参数`－rf` 表示递归和强制，千万要小心使用，如果执行了`rm -rf /` 你的系统就全没了

- 显示当前目录的路径名`pwd`

## 服务器操作

- 重启方法1：

  `ps -ef |grep zmxywz`   找出当前进程id
  `kill` 杀进程
  `nohup /home/linzhiwei/node4.2/node-v4.2.3-linux-x64/bin/node app >/dev/null 2>&1 &`    启动到后台
  或者是`/home/linzhiwei/node4.2/node-v4.2.3-linux-x64/bin/node app`  启动输出错误到屏幕
- 重启方法2：
  直接使用脚本 [start.sh](../server/start.sh)
