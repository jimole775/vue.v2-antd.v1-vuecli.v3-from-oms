@ECHO OFF

SET HOME=%cd%
FOR %%n IN (8080 8888) DO (
   @echo find the process which use port [%%n]
   FOR /F "tokens=1-5" %%i IN ('netstat -ano^|findstr ":%%n"') DO (
      TASKLIST /FI "PID eq %%m"|find /i "PID" && (
         echo PID:%%m running!, kill the process [%%m] who use the port [%%n]
         TASKKILL /F /pid %%m
      ) || echo PID:%%m is not runned!
   )
)

IF not EXIST %HOME%/node_modules/.bin (
   START /wait /min cmd /k "cd %HOME% & npm run init"
)

START /min cmd /k "cd %HOME% & npm run serve"
START /min cmd /k "cd %HOME% & npm run builder"
