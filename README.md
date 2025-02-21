# Twitch API Batch Project

Ce projet permet de récupérer des informations en batch sur un utilisateur Twitch et son planning de diffusion en utilisant l'API officielle de Twitch. L'API expose deux fonctionnalités principales :

1. **Récupérer les informations d'un utilisateur Twitch**
2. **Récupérer le planning de diffusion d'un utilisateur Twitch**

Le but de ce projet est d'optimiser les appels à l'API de Twitch en regroupant la récupération des informations de l'utilisateur et de son planning dans un même appel.

## Prérequis

Avant d'exécuter le projet, vous devez avoir les éléments suivants :

- [Node.js](https://nodejs.org/) installé (version 14.x ou supérieure).
- [Yarn](https://yarnpkg.com/) installé pour la gestion des dépendances.
- Un **Client-ID** de Twitch et un **Access Token** valide. Vous pouvez obtenir ces informations en vous inscrivant sur le [Twitch Developer Console](https://dev.twitch.tv/console/apps).

## Installation

1. Clonez ce dépôt sur votre machine locale :
    ```bash
    git clone git@github.com:Anthr0pophobe/TwitchAPI.git
    ```

2. Accédez au répertoire du projet :
    ```bash
    cd twitchApi
    ```

3. Installez les dépendances avec **Yarn** :
    ```bash
    yarn install
    ```

4. Configurez vos variables d'environnement pour Twitch dans un fichier `.env` :
    ```bash
    TWITCH_CLIENT=<votre-client-id>
    TWITCH_ACCESS_TOKEN=<votre-access-token>
    MONGOUSER=<votre-username-mongo>
    MONGOPASSWORD=<votre-mot-de-passe-mongo>
    ```

## Démarrage

Pour démarrer le serveur localement, utilisez la commande suivante :

```bash
npm run dev
```

Cela lancera le serveur Express sur http://localhost:3000.

Accéder à la Documentation Swagger
Une fois le serveur démarré, vous pouvez accéder à la documentation de l'API générée par Swagger à l'adresse suivante :

```bash
http://localhost:3000/api/docs
``` 

Cette page contient la documentation interactive de toutes les routes disponibles dans l'API, incluant les endpoints pour récupérer les informations d'un utilisateur Twitch et son planning de diffusion.



