@echo off
:: Se placer dans le dossier XAMPP pour trouver les exécutables
cd /d "C:\xampp"

:: Lancer Apache et MySQL de manière silencieuse (via l'exécutable direct)
start "" "apache\bin\httpd.exe"
start "" "mysql\bin\mysqld.exe"

:: Attendre 5 secondes pour que la connexion MySQL s'établisse
timeout /t 5 /nobreak > nul

:: Ouvrir le projet dans le navigateur par défaut
start "" "http://localhost/PolyDocs"

exit