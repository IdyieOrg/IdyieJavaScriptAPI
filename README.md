# Idyie JavaScript API

## **Table des matières**
- [Développeurs](#développeurs)
- [Description](#description)
- [Installation](#installation)
  - [Prérequis](#prérequis)
  - [Configuration](#configuration)
  - [Lancer le projet](#lancer-le-projet)
- [Collection Postman](#collection-postman)

### Développeurs
- Levet Corentin - (corentin.levet@epitech.eu)
- Vanelle Gwendoline - (gwendoline.vanelle@epitech.eu)
- Grisel Hugo - (hugo.grisel@epitech.eu)

## **Description**


## **Installation**

### **Prérequis**

Pour ce projet, vous aurez besoin d'au moins sur votre ordinateur :
- [mysql]() (dernière version)
```bash
sudo dnf install mysql-server
sudo systemctl start mysqld
sudo systemctl enable mysqld
```

> Si vous souhaitez utiliser l'installation Docker fournie
- [Docker](https://docs.docker.com/engine/install/)
- [Docker compose](https://docs.docker.com/compose/install/)

> Si vous souhaitez utiliser vos dépendances locales
- [Node.js](https://nodejs.org/en) v21.2.0

### **Configuration**
Pour configurer la Database, vous pouvez suivre les étapes suivantes :

1. Connectez-vous à votre serveur MySQL en tant que root :
```bash
sudo mysql -u root -p
```

2. Créez une nouvelle base de données :
```sql
CREATE DATABASE api_db;
```

3. Créez un nouvel utilisateur :
```sql
CREATE USER 'api_user'@'localhost' IDENTIFIED BY 'password123'
```

4. Donnez à cet utilisateur les droits sur la base de données :
```sql
GRANT ALL PRIVILEGES ON api_db.* TO
'api_user'@'localhost';
```

### **Lancer le projet**
Il y a deux façons de lancer le projet :

> En utilisant Docker compose

Pour commencer, construisez les conteneurs en utilisant :
```bash
docker compose build
```

Une fois les conteneurs construits, vous pouvez lancer le projet en utilisant :
```bash
docker compose up -d
```

Maintenant, vous pouvez accéder au projet sur [localhost:3000](http://localhost:3000) !

> En utilisant votre installation locale
```bash
cd app
npm install
npm start
```

Maintenant, vous devriez pouvoir accéder au projet sur [localhost:3000](http://localhost:3000) !

## **Collection Postman**
Vous pouvez trouver la collection Postman [ici](https://idyie3.postman.co/workspace/b448ee5a-e027-4789-99bc-4413def99ee8/collection/34591253-7941f888-3206-4caf-afbb-6935d8e12c0a)