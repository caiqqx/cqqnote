
#!/bin/sh  
echo stop server first
TOM_HOME="zmxywz-"
ps -ef|grep $TOM_HOME|grep -v grep|grep -v kill
if [ $? -eq 0 ];then
    kill -9 `ps -ef|grep $TOM_HOME|grep -v grep|grep -v kill|awk '{print $2}'`
else
    echo $TOM_HOME' No Found Process'  
fi
cd ~/game-server
sleep 5
nohup /home/linzhiwei/node4.2/node-v4.2.3-linux-x64/bin/node app > /dev/null 2>&1 &
echo restart fininsh.
sleep 20
ps -ef |grep $TOM_HOME
echo please check the servers run status.[linwuxian@kp157 game-server]$ 
