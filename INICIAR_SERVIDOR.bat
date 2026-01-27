@echo off
echo ========================================
echo TIPHERET HARMONY STATION
echo Iniciando servidor...
echo ========================================
echo.
echo NOTA: Para acceder desde tu celular:
echo 1. Asegurate de que tu PC y celular esten en la misma red WiFi
echo 2. Desde tu celular, ve a: http://TU_IP_LOCAL:3000
echo.
echo Para ver tu IP local, abre otra ventana CMD y ejecuta: ipconfig
echo.

cd /d "%~dp0"

echo Iniciando servidor en modo red local...
set HOST=0.0.0.0
call npm run dev

pause
