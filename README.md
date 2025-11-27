## Twitter Clone – Backend & Frontend

Projet full‑stack de type **clone de Twitter / X**, composé :
- **Backend** : API REST Node.js/Express avec MongoDB/Mongoose (authentification JWT, gestion des posts, commentaires, reposts, likes, follow, notifications…)
- **Frontend** : SPA **React 19 + TypeScript** avec **Vite**, **Redux Toolkit**, **React Router**, **Axios**, **TailwindCSS 4** et quelques composants **MUI**.

Ce dépôt est un **monorepo** avec deux dossiers principaux : `backend/` et `frontend/`.

---

## Fonctionnalités principales

- **Authentification & profils**
  - Inscription / connexion (`/api/users`)
  - Authentification par **JWT**
  - Récupération et mise à jour du profil (username, bio, avatar…)
  - Vérification de session côté frontend via un guard d’authentification

- **Réseau social (type Twitter)**
  - Création / édition / suppression de **posts**
  - **Likes** de posts, liste des posts aimés
  - **Commentaires** sur les posts
  - **Reposts** / retweets
  - Fil d’actualité :
    - **Flux global**
    - **Flux “following”** (posts des personnes suivies)
    - **Onglet “trending”** (posts les plus likés sur les derniers jours)

- **Suivi / Followers**
  - Follow / unfollow d’utilisateurs
  - Liste des followers et des comptes suivis

- **Notifications**
  - Notifications automatiques pour certains évènements (like, follow, etc.)
  - Conteneur de notifications dans l’app React (`NotificationsContainer`)

---

## Stack technique

- **Backend**
  - Node.js / Express
  - MongoDB avec Mongoose
  - Authentification via **JWT**
  - Sécurité basique avec **bcryptjs** pour les mots de passe
  - CORS, JSON body parsing

- **Frontend**
  - React 19 + TypeScript
  - Vite
  - Redux Toolkit (`store` global dans `src/app/store.ts`)
  - React Router (routing dans `src/app/routes.tsx`)
  - Axios pour les appels API (`src/api/axiosConfig.ts`)
  - TailwindCSS 4 + quelques composants Material UI

---

## Structure du projet

```text
.
├── backend/
│   ├── src/
│   │   ├── config/        # Connexion MongoDB (db.js)
│   │   ├── controllers/   # Logique métier (users, posts, comments, reposts, notifications)
│   │   ├── middlewares/   # Middleware d’auth (JWT)
│   │   ├── models/        # Schémas Mongoose
│   │   ├── routes/        # Routes Express /api/*
│   │   └── server.js      # Bootstrap de l’API
│   ├── seeders/           # Données de seed (users, posts, comments…)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/           # Store Redux, hooks, définition des routes
    │   ├── components/    # Layout global, modales génériques, loading…
    │   ├── domains/       # Dossiers par “domaine” (auth, posts, users, comments, reposts, notifications, alerts)
    │   ├── pages/         # Pages principales (Index, Login, Post, Profile…)
    │   ├── api/           # Config axios
    │   └── utils/         # Helpers et formatteurs
    ├── index.html
    └── package.json
```

---

## Prérequis

- **Node.js** (version récente LTS recommandée)
- **npm** ou **pnpm** / **yarn**
- Une instance **MongoDB** (locale ou distante)

---

## Installation

Cloner le dépôt puis installer les dépendances des deux parties :

```bash
git clone git@github.com:alapierre-ops/twitterClone.git twitterClone
cd twitterClone

cd backend
npm install

cd ../frontend
npm install
```

---

## Configuration des variables d’environnement (backend)

Dans `backend/`, créer un fichier `.env` :

```bash
cd backend
cp .env.example .env
```

---

## Lancer l’API backend

Depuis le dossier `backend/` :

```bash
npm run dev
```

L’API tourne par défaut sur `http://localhost:5000` et expose les routes :
- `GET /api/posts`, `POST /api/posts`, etc.
- `POST /api/users/register`, `POST /api/users/login`, etc.
- `GET /api/comments/...`, `GET /api/reposts/...`, `GET /api/notifications/...`  
(cf. contenu du dossier `routes/` pour le détail complet).

### Seed de la base

Il existe un script de seed pour remplir la base avec des **utilisateurs**, **posts** et **commentaires** de test :

```bash
cd backend

# Insérer les données
npm run seed

# Détruire les données
npm run seed:destroy
```

---

## Lancer le frontend

Depuis le dossier `frontend/` :

```bash
cd frontend

npm run dev
```

Par défaut, Vite sert l’app sur `http://localhost:5173`.  
Le frontend communique avec l’API via Axios (baseURL configurée dans `src/api/axiosConfig.ts`).

---

## Architecture frontend (aperçu)

- **Routing** : défini dans `src/app/routes.tsx`, avec des pages comme :
  - `Index` (feed principal)
  - `Login`
  - `Post` (détail d’un post)
  - `Profile`
- **Store global** : `src/app/store.ts` assemble les slices :
  - `auth`, `posts`, `userState`, `alerts`, `comments`, `reposts`, `notifications`
- **UI & UX**
  - Layout principal dans `src/components/Layout.tsx`
  - Modales génériques (`Modal.tsx`, `LoginModal.tsx`, `SignupModal.tsx`, etc.)
  - Gestion globale des notifications à l’écran (`NotificationsContainer.tsx`)