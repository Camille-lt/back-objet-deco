<img width="1402" height="917" alt="Capture d’écran 2026-02-19 à 19 10 17" src="https://github.com/user-attachments/assets/36f4fca9-021c-4a47-92d8-1cf9df120564" />
<img width="1899" height="961" alt="Capture d’écran 2026-02-19 à 19 19 44" src="https://github.com/user-attachments/assets/82540e98-a8ea-4951-aff5-be4cb2b58f7b" />

🛠️ **HOME MAKING - Back-end (API)**
📖 **Présentation**
Ce dépôt contient l'API REST de HOME MAKING, une plateforme e-commerce de mobilier haut de gamme. Développé en autonomie, ce serveur gère la logique métier, l'authentification sécurisée et la persistance des données.
Il est conçu pour fonctionner de pair avec le HOME MAKING - Front-end: [https://github.com/Camille-lt/front-objet-deco]

🚀 **Stack Technique**
Runtime : Node.js
Framework : Express.js
Base de données : SQL (PostgreSQL)
Authentification : JSON Web Tokens (JWT)
Architecture : RESTful API

✨**Fonctionnalités Clés**

- Gestion des Produits : CRUD complet pour le catalogue de mobilier.
- Système d'Authentification : Inscription et connexion sécurisées avec hachage des mots de passe et génération de tokens JWT.
- Gestion du Panier & Commandes : Logique de persistance des choix utilisateurs et traitement des commandes.
- Sécurité : Mise en place de middlewares pour la protection des routes privées.

🚦 **Endpoints Principaux**
- POST /api/auth/register : Création d'un nouveau compte client.
- POST /api/auth/login : Connexion et récupération du token.
- GET /api/products : Récupération de la liste des meubles.
- POST /api/cart : Mise à jour du panier (Route sécurisée).

🛠️ **Installation et Configuration**
Cloner le projet :

****Bash****
git clone [(https://github.com/Camille-lt/back-objet-deco/]
cd back-objet-deco
Installer les dépendances :

Bash
npm install
Variables d'environnement :
Créez un fichier .env à la racine et configurez les variables suivantes :

**Extrait de code**
PORT=5000
DATABASE_URL=votre_url_sql
JWT_SECRET=votre_secret_super_secure
Lancer le serveur :

Bash
npm start
