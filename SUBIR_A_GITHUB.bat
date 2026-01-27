@echo off
echo ========================================
echo SUBIENDO TIPHERETH A GITHUB
echo ========================================
echo.

cd "C:\Users\usuario\OneDrive\maya harmony station"

echo Iniciando Git...
git init

echo Agregando archivos...
git add .

echo Creando commit...
git commit -m "Initial commit: Tiphereth Harmony Station v5.1.0"

echo.
echo IMPORTANTE: Copie el comando que GitHub le mostró que empieza con:
echo git remote add origin https://github.com/[su-usuario]/tiphereth-harmony-station.git
echo.
pause

echo Subiendo a GitHub...
git branch -M main
git push -u origin main

echo.
echo ========================================
echo LISTO! Ahora vaya a Vercel:
echo https://vercel.com/new?teamSlug=ricardo-maya-romos-projects
echo ========================================
pause
