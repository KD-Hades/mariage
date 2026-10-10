# Invitation de mariage

Site statique avec formulaire RSVP traité par **Netlify Forms**. Aucun serveur
Node.js ni base PostgreSQL n'est nécessaire pour recueillir les réponses.

## Publier sur Netlify

1. Envoyer les dernières modifications du dépôt sur GitHub.
2. Dans Netlify, choisir **Add new project → Import an existing project**, connecter GitHub, puis sélectionner le dépôt.
3. Garder `netlify.toml` à la racine du dépôt. Il copie les fichiers du site dans `dist/` et configure ce dossier comme publication. Le dossier `backend/` et son fichier `.env` ne sont pas publiés.
4. Dans les paramètres du site Netlify, activer la détection des formulaires (**Form detection**), puis déclencher un nouveau déploiement.
5. Après le déploiement, ouvrir la section **Forms** du tableau de bord Netlify. Le formulaire `rsvp` doit y être détecté.
6. Envoyer une réponse de test depuis l'adresse Netlify du site, puis consulter **Forms → rsvp → Submissions** pour la vérifier.

Le site doit être visité à son adresse Netlify pour que Netlify Forms reçoive les réponses. Le dépôt peut rester sur GitHub, mais GitHub Pages ne traitera pas ces soumissions. L'ancien dossier `backend/` n'est plus utilisé par le site ; les services Render existants ne sont pas supprimés automatiquement.
