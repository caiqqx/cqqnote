if not exist "_temp" md _temp

call compileRes.bat

call compileSrc.bat

echo d | xcopy /S /R /Y /E _temp 热更新版本

rd /s /q _temp

cd 热更新版本
call python assetsManager.py

pause