@echo off
title DryRun - Pull Latest Code & Start Global Server
cd /d "%~dp0"

echo ========================================================
echo [1/4] Pulling latest updates from GitHub...
echo ========================================================
git pull origin main
if %errorlevel% neq 0 (
    echo [Warning] Git pull encountered an issue. Continuing with local files...
)

echo ========================================================
echo [2/4] Checking and installing dependencies...
echo ========================================================
call npm install

echo ========================================================
echo [3/4] Building Next.js production application...
echo ========================================================
call npm run build

echo ========================================================
echo [4/4] Starting production server & Cloudflare Global Tunnel...
echo ========================================================
start "DryRun Production Server" /min cmd /c "npm run start -- -p 3001"

timeout /t 4 /nobreak >nul

where cloudflared >nul 2>nul
if %errorlevel% equ 0 (
    cloudflared tunnel --url http://localhost:3001
) else if exist "C:\Program Files (x86)\cloudflared\cloudflared.exe" (
    "C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --url http://localhost:3001
) else (
    echo [Notice] Cloudflare tunnel is not installed on this PC yet.
    echo Installing Cloudflare tunnel now...
    winget install --id Cloudflare.cloudflared --accept-package-agreements --accept-source-agreements
    "C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --url http://localhost:3001
)

pause
