Set WshShell = CreateObject("WScript.Shell")

' Lancer Apache directement (sans passer par un .bat)
WshShell.Run "C:\xampp\apache\bin\httpd.exe", 0, False

' Lancer MySQL directement
WshShell.Run "C:\xampp\mysql\bin\mysqld.exe", 0, False

' Attendre 5 secondes pour que les services démarrent
WScript.Sleep 5000

' Ouvrir le navigateur
WshShell.Run "http://localhost/PolyDocs", 1, False