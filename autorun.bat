@ECHO OFF
SET HOME=%cd%
if not exist %HOME%/node_modules/.bin (
   start /wait /min cmd /k "cd %HOME% & npm run init"
)
start /min cmd /k "cd %HOME% & npm run serve"
start /min cmd /k "cd %HOME% & npm run builder"
