@echo off
chcp 65001 >nul
echo ?? Зупинка процесів на порті 3000...

for /f "tokens=5" %%p in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    echo ?? Знайдено процес з PID: %%p
    taskkill /PID %%p /F >nul 2>&1
    if errorlevel 1 (
        echo ? Не вдалося зупинити процес %%p
    ) else (
        echo ? Процес %%p зупинено
    )
)

echo.
echo ?? Порт 3000 очищено!
echo ?? Тепер можна запустити: npm start
pause