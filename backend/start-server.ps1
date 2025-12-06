# Start Manna Radio Backend Server
Write-Host "Starting Manna Radio Backend Server..." -ForegroundColor Cyan
Set-Location $PSScriptRoot
node server.js
