if not exist "_temp" md _temp

call python _compareSrc.py

call cocos jscompile -s _temp -d _temp

del _temp\*.js /f /s /q

pause