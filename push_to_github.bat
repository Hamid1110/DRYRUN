@echo off
echo =======================================================
echo Pushing DryRun code to https://github.com/Hamid1110/DRYRUN.git
echo =======================================================
cd /d "%~dp0"
git branch -M main
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Code successfully pushed to GitHub repository!
) else (
    echo [NOTE] If prompted above, please sign in via browser or enter your GitHub Personal Access Token.
)
pause
