@ECHO OFF
SET HOME=%cd%
SET PORTS[0]=8080
SET PORTS[1]=8888
FOR /F "delims=" %%n IN ("%PORTS%") DO (
   @echo find the process which use port [%%n]
   FOR /F "tokens=1-5" %%i IN ('netstat -ano^|findstr ":%%n"') DO (
      tasklist /FI "PID eq %%m"|find /i "PID" && (
      echo PID:%%m 运行中,kill the process [%%m] who use the port [%%n]
      taskkill /F /pid %%m
      ) || echo PID:%%m 未运行
   )
)
IF not EXIST %HOME%/node_modules/.bin (
   START /wait /min cmd /k "cd %HOME% & npm run init"
)
START /min cmd /k "cd %HOME% & npm run serve"
START /min cmd /k "cd %HOME% & npm run builder"
