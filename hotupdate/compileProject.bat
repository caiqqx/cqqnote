if not exist "_temp" md _temp

call compileRes.bat

call compileSrc.bat

echo d | xcopy /S /R /Y /E _temp �ȸ��°汾

rd /s /q _temp

cd �ȸ��°汾
call python assetsManager.py

pause