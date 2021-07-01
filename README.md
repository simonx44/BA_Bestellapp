# Bestellapp für die Bachelorarbeit

Information: Eine bessere Vorgehensweise statt sämtliche Ressourcen der Anwendung innerhalb eines Templates zu definieren, wäre es, die Ressourcen in einzelne Templates auszulagern.
Hierfür dient innerhalb von AWS SAM die Ressource "Type: AWS::Serverless::Application". 

## Beschreibung des Stacks

Der Anwendungsstack erzeugt ein serverloses Backend für eine Essens-Bestellapp.
Hierbei können sich sowohl Kunden wie auch Restaurants registrieren und anmelden.
Restaurants stellen eine Speisekarte bereit und erhalten einen Überblick über eingegangene Bestellungen.
Kunden können Bestellungen bei vorhandenen Restaurants tätigen. Zudem können auch Kunden ihre getätigten Bestellungen einsehen.

Die serverlose Anwendung wurde mit AWS SAM erstellt. Hierbei befinden sich sämtliche Ressourcen innerhalb des Templates (template.yml). Der Funktionscode für serverlose Funktionen und Abhängigkeiten befindet sich innerhalb des Ordners 'src'.

## Vorraussetzungen

Um SAM lokal ausführend zu können, wird die AWS CLI benötigt. Daher muss diese installiert werden.

https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-windows.html

Zudem muss die SAM CLI installiert sein:

https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html

Im Anschluss muss die lokale Entwicklungsumgebung noch mit einem AWS-Account verknüpft werden:

```
aws configure
```

Folgende Konfigurationen werden vorgenommen:

AWS Access Key ID: <Ihr AWS Access Key> <br>
AWS Secret Access Key: <Ihr Secret> <br>
Default region name: eu-central-1 <br>
Default output format. json <br>

Sollte Docker noch nicht installiert sein, kann dieses auch installiert werden. Docker wird jedoch nicht zwingend für ein Deployment benötigt.
Sollten Teile der Anwendung lokal gestestet werden, muss Docker installiert werden.

https://docs.docker.com/get-docker/

## Vorgehen für das Deployment

Bevor der Anwendungsstack deployed werden kann, müssen sämtliche Abhängigkeiten installiert werden.
Werden diese nicht installiert, stehen einzelne Funktionen des serverlosen Backend nicht zur Verfügung, da bei der Ausführung Fehler entstehen. Dies betrifft alle Funktionen, die eine eigene package.json besitzen und daher NPM-Module nutzen.

Nach einem Build kann das Backend in die AWS-Cloud deployed werden.

## Build

Um das Backend builden zu können, wird Docker benötigt. Der Grund ist, dass innerhalb der serverlosen Funktion 'PutPictureUrlInDB' die Bibliothek sharp genutzt wird. Erfolgt das Building ohne eine Docker-Umgebung, stehen für das Modul Windows-Anhängigkeiten bereit. Da Docker beziehungsweise eine Lambda-Funktion Linux im Hintergrund nutzt, wird entsprechend eine Linux-Umgebung benötigt, die durch den Einsatz eines Containers emuliert werden kann.
Folgender Befehl muss ausgeführt werden.

```
sam build --use-container
```

Alternativ, falls Docker nicht installiert ist:

```
sam build
```

Die Abbängigkeiten für die Funktion /src/s3/created müssen manuell installiert werden. Siehe folgende Doku:

https://sharp.pixelplumbing.com/install#aws-lambda

Nach einem Build erfolgt das Deployment aus dem Ordner .aws-sam

Wird im Anschluss nur eine einzelne Funktion geändert, kann diese wie folgt gebaut werden:

```
sam build <FunctionName>
```

## Deployment

Initiales Deployment:

Ein initiales Deployment wird über folgenden Befehl gestartet:

```
sam deploy -g
```

Hierbei werden Parameter durch den Nutzer an den zu erzeugenden Stack mitgegeben:

Innerhalb des Projektes werden innerhalb der samconfig.toml alle übergebenen Parameter gespeichert und bei einem Deployment ausgelesen.

Die Parameter werden im Folgenden beschrieben:

- CognitoDomainName: Name für Cognito, besitzt einen Default
- AppName: beliebiger Name für die Anwendung eintragen
- ClientDomains: Liste mit URLs die die Anwendung nutzten können - kann ignoriert werden
- SESMail: SES registrierte Mail - kann ignoriert werden, da die Nutzung von SES standardmäßig nicht möglich ist und erst aktiviert werden muss
- GithubRepository: Wird für das Hosting mittels AWS Amplfify benötigt
- PersonalAcessToken: Token für den Zugriff von auf das Github-Repo - Muss angegeben werden
- Branch: Github-Repo Branch des Frontend, der deployed werden soll

Alle weiteren Konfigurationen können mit 'yes' konfiguriert werden.

Token kann wie folgt erzeugt werden:
https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token

Steht kein GitHub-Repo oder Token zur Verfügung kann auf das Frontend verzichtet werden.
Hierbei steht ein zweites Template ohne Frontend zur Verfügung. Dieses kann wie folgt gebaut und deployed werden:

Build:

```
sam build --use-container  --template-file templateWithoutClient.yml
```

Deployment:

```
sam deploy --template-file templateWithoutClient.yml -g
```

## Bereitstellen des Frontends

Das Frontend lässt sich nach dem Deployment des serverlosen Backends lokal ausführen.
Informationen für die lokale Ausführung befinden sich innerhalb der README.md des Frontend (client/bestellapp_frontend_vue)

Wird das Frontend über Amplify deployed, müssen noch zwei Befehle ausgeführt werden. Diese können dem Output nach einem erfolgreichen Deployment entnommen werden.

Alterativ kann folgender Befehl ausgeführt werden, um die Befehler zu erhalten:

```
aws cloudformation describe-stacks --stack-name <Name des Stacks>
```

Diese Vorgehensweise ist nur bei einem intitalen Deployment nötig. Im Anschluss wird nach jeder Änderung des hinterlegten Git-Repos das Deployment automatisch durch Amplify gestartet.

1. Entwicklungsvaribalen anpassen. Form des Commands:

```
aws amplify update-app --app-id do68bi531l99o --environment-variables VUE_APP_API_ROOT=cogtest,VUE_APP_REGION=eu-central-1,VUE_APP_USER_POOL_ID=eu-central-1_QI3YWvRUC,VUE_APP_CLIENT_ID=3rcu02qt5umvvqp898e0d1e6s6,VUE_APP_URL=https://cogtest-457908813616.auth.eu-central-1.amazoncognito.com
```

Der Command wird für jeden Stack inital erzeugt und wird dem Output nach einem Deployment entnommen. Entprechend wird eine 1:1-Ausführung des Beispiels-Commands nicht funktionieren:

2. Build und Deploy des Frontend im Anschluss starten

Form:

```
aws amplify start-job --app-id <MyAmplifyAppId> --branch-name <BranchName> --job-type RELEASE
```
"# BA_Bestellapp" 
