@echo off
powershell.exe -NoProfile -STA -ExecutionPolicy Bypass -File "%~dp0installer.ps1"
if errorlevel 1 echo Installation non terminee. Lisez le message ci-dessus.
pause
