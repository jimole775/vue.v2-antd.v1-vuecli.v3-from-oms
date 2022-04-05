@ECHO OFF
SET HOME=%cd%
SET PORTS[0]=8080
SET PORTS[1]=8888
for /f "delims=" %%n in ("%PORTS%") do (
   @echo find the process which use port [%%n]
   for /f "tokens=1-5" %%i in ('netstat -ano^|findstr ":%%n"') do (
      tasklist /FI "PID eq %%m"|find /i "PID" && (
      echo PID:%%m 运行中,kill the process [%%m] who use the port [%%n]
      taskkill /F /pid %%m
      ) || echo PID:%%m 未运行
   )
)
if not exist %HOME%/node_modules/.bin (
   start /wait /min cmd /k "cd %HOME% & npm run init"
)
start /min cmd /k "cd %HOME% & npm run serve"
start /min cmd /k "cd %HOME% & npm run builder"
