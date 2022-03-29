@echo off
set HOME=%cd%
echo %HOME%
if exist %HOME%/node_modules/.bin (
   start cmd /k "cd %HOME% & npm run serve"
) else (
   start cmd /k "cd %HOME% & npm run init & npm run serve"
)
start cmd /k "cd %HOME% & npm run builder"
