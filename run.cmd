:loop
node ./server.mjs
timeout /t 5 /nobreak > NUL
goto loop