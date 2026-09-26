@echo off
title Cloudflare Global Tunnel
echo ========================================================
echo Starting Cloudflare Global Tunnel for http://localhost:3001
echo ========================================================
"C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --url http://localhost:3001
pause
