# Étape 1 : Utiliser une image Node.js
FROM node:latest

# Étape 2 : Créer un répertoire de travail
WORKDIR /app

# Étape 3 : Copier les fichiers du projet
COPY ./app .

# Étape 4 : Installer les dépendances
RUN npm install

# Étape 5 : Exposer le port
EXPOSE 3000

# Étape 6 : Commande pour démarrer l'application
CMD ["node", "index.js"]
