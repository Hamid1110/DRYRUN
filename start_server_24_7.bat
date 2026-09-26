@echo off
title DryRun 24/7 Server Runner
echo ========================================================
echo Starting DryRun Production Server and Global Tunnel...
echo ========================================================
cd /d "%~dp0"

:: Start Next.js server in the background on port 3001
echo [1/2] Starting Next.js server on port 3001...
start "DryRun Next.js Server" /min cmd /c "npm run start -- -p 3001"

timeout /t 5 /nobreak >nul

:: Start Cloudflare global tunnel
echo [2/2] Starting Cloudflare Global Tunnel...
echo A public https://*.trycloudflare.com link will appear below.
echo You can open this link from ANY phone, laptop, or network globally!
echo ========================================================
"C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --url http://localhost:3001
pause
