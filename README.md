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
2. Créer un **Web Service** lié au dépôt GitHub, avec `backend` comme **Root Directory**.
3. Utiliser `npm install` comme commande de construction et `npm start` comme commande de démarrage.
4. Ajouter les variables d'environnement au service :
	- `DATABASE_URL` : l'URL interne de la base PostgreSQL Render.
	- `FRONTEND_ORIGINS` : l'origine exacte du site publié, par exemple `https://VOTRE-UTILISATEUR.github.io` (sans chemin `/mariage`).
5. Après le déploiement, ouvrir `https://VOTRE-SERVICE.onrender.com/healthz`. Une réponse `{"ok":true}` confirme que l'API et la base répondent.
6. Dans `index.html`, remplacer `https://VOTRE-BACKEND.onrender.com/api/rsvp` par l'URL réelle `https://VOTRE-SERVICE.onrender.com/api/rsvp`, puis envoyer cette modification sur GitHub.
7. Envoyer une réponse test et vérifier qu'elle apparaît dans la table `rsvps` de la base PostgreSQL.

La table est créée automatiquement au démarrage. L'API n'expose aucune route pour lire les réponses publiquement.
