if not exist "_temp" md "_temp"

if not exist "_temp\res" md "_temp\res"

copy /y pngquant.exe "_temp\res\pngquant.exe"

copy /y JPG-C_v1.1.exe "_temp\res\JPG-C_v1.1.exe"

call python _compareRes.py

cd "_temp/res"

echo "开始处理..."

for /R %%i in (*.png) do (
  pngquant -f --ext .png --quality 50-80 "%%i"
)

for /R %%i in (*.jpg) do (
  JPG-C_v1.1 -m 1 -f "%%i"
)

cd ..

cd ..

del _temp\res\pngquant.exe
del _temp\res\JPG-C_v1.1.exe
pause
