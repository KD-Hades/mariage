# Invitation de mariage

Site statique publié sur GitHub Pages. Le formulaire RSVP utilise une API Node.js
dans `backend/` et une base PostgreSQL.

## Développement local

1. Installer Node.js 20 ou supérieur et PostgreSQL.
2. Créer une base de données appelée `mariage`.
3. Dans `backend/`, copier `.env.example` vers `.env` et ajuster `DATABASE_URL`.
4. Dans un terminal PowerShell :

	```powershell
	cd backend
	npm install
	npm test
	$env:DATABASE_URL="postgresql://localhost:5432/mariage"
	npm start
	```

	L'API est alors disponible sur `http://localhost:3000`.

## Déploiement du backend sur Render

1. Créer une base PostgreSQL dans Render.
2. Créer un **Web Service** lié au dépôt GitHub, avec `backend` comme **Root Directory**. Régler la commande de construction sur `npm install` et celle de démarrage sur `npm start`.
3. Avant le premier déploiement, ouvrir la section **Environment** du Web Service et ajouter :
	- `DATABASE_URL` : coller l'**Internal Database URL** affichée dans la page de la base PostgreSQL créée à l'étape 1. C'est l'adresse qui permet au backend de se connecter à la base.
	- `FRONTEND_ORIGINS` : mettre l'origine exacte du site publié, par exemple `https://VOTRE-UTILISATEUR.github.io` (sans chemin `/mariage`).

	Sans `DATABASE_URL`, le backend s'arrête au démarrage. Enregistrer les variables, puis lancer ou relancer le déploiement.
4. Quand le déploiement indique **Live**, copier l'URL du Web Service affichée par Render, par exemple `https://mariage-rsvp-api.onrender.com`, puis ouvrir cette adresse suivie de `/healthz`, par exemple `https://mariage-rsvp-api.onrender.com/healthz`. La réponse `{"ok":true}` confirme que le backend a démarré et peut joindre PostgreSQL.
5. Dans `index.html`, remplacer `https://VOTRE-BACKEND.onrender.com/api/rsvp` par l'URL du Web Service copiée à l'étape précédente, suivie de `/api/rsvp`. Envoyer ensuite cette modification sur GitHub.
6. Envoyer une réponse test et vérifier qu'elle apparaît dans la table `rsvps` de la base PostgreSQL.

La table est créée automatiquement au démarrage. L'API n'expose aucune route pour lire les réponses publiquement.
