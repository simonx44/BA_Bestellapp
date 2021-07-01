# Frontend der serverlosen Bestell app

Folgende Schritte müssen ausgeführt werden, um das Frontend lokal auszuführen

## Installation der Abhäbigkeiten
```
npm install
```
### Vor dem lokalen Ausführen des Frontends
Die Datei .env anlegen, falls nicht vorhanden. Die Datei kann hierbei direkt im Root-Ordner des Frontend angelegt werden
==> Bestellapp_frontend_vue/.env

Folgender Entwicklungsvaribalen müssen vorhanden sein:

VUE_APP_API_ROOT=https://mftr5vx45j.execute-api.eu-central-1.amazonaws.com  
VUE_APP_REGION=eu-central-1
VUE_APP_USER_POOL_ID=eu-central-1_En1tVhn92
VUE_APP_CLIENT_ID=3j7f2g9ntg6r75ipg7nofa149o
VUE_APP_URL=http://localhost:8000

Variablen kopieren und diese mittels des Output des SAM-Templates nach einem Deployment anpassen.
Aktuelle Werte werden NICHT funtkionieren.
Dies gilt nur für die lokale Ausführung.

Folgende Varibalen müssen geändert werden:
- VUE_APP_API_ROOT: URL für die serverlose Rest-API - SAM OUTPUT*:  ApiUrl
- VUE_APP_USER_POOL_ID: Cognito Userpool ID - SAM OUTPUT*: UserPool
- VUE_APP_CLIENT_ID: Userpool Client für den clientseitigen Zugriff auf den Userpool - SAM OUTPUT*:  UserPoolClientId

Der SAM OUTPUT gibt an, wo diese gefunden werden können.
Dieser wird nach einem erfolgreichen Deployment des Backends erzeugt und lässt sich über die Konsole auslesen.

### Lokales Ausführen des Frontends
```
npm run serve
```

### Kompilieren und Optimierung vor dem Deployment
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

