# Invitation de mariage

Site statique avec formulaire RSVP traité par **Netlify Forms**. Aucun serveur
Node.js ni base PostgreSQL n'est nécessaire pour recueillir les réponses.

## Ajouter la musique

1. Placez votre fichier MP3 dans le dossier `audio/` (par exemple `notre-chanson.mp3`).
2. Dans `index.html`, remplacez `const MUSIC_SOURCE = "";` par `const MUSIC_SOURCE = "audio/notre-chanson.mp3";`.
3. Ajustez `MUSIC_VOLUME` si nécessaire : `0.35` correspond à 35 %.

La musique joue en boucle à l'ouverture de l'enveloppe. Un bouton permet de
la mettre en pause et de la reprendre. Si le navigateur bloque la lecture,
le visiteur peut l'activer avec le bouton. Sans source configurée, le bouton
reste masqué. Vous pouvez aussi utiliser une URL directe vers un fichier audio.
Le dossier `audio/` est inclus dans la publication Netlify.

## Publier sur Netlify
 
La galerie utilise un Coverflow 3D : navigation avec les flèches, les touches
gauche/droite du clavier et le balayage horizontal sur mobile. Pour ajouter des
photos, ajoutez des images dans le bloc `.gallery` de `index.html`.
Le compteur s'adapte automatiquement. Sans JavaScript, les photos restent en grille.
Les animations respectent la préférence système de réduction des mouvements.

1. Envoyer les dernières modifications du dépôt sur GitHub.
2. Dans Netlify, choisir **Add new project → Import an existing project**, connecter GitHub, puis sélectionner le dépôt.
3. Garder `netlify.toml` à la racine du dépôt. Il copie les fichiers du site dans `dist/` et configure ce dossier comme publication. Le dossier `backend/` et son fichier `.env` ne sont pas publiés.
4. Dans les paramètres du site Netlify, activer la détection des formulaires (**Form detection**), puis déclencher un nouveau déploiement.
5. Après le déploiement, ouvrir la section **Forms** du tableau de bord Netlify. Le formulaire `rsvp` doit y être détecté.
6. Envoyer une réponse de test depuis l'adresse Netlify du site, puis consulter **Forms → rsvp → Submissions** pour la vérifier.

Le site doit être visité à son adresse Netlify pour que Netlify Forms reçoive les réponses. Le dépôt peut rester sur GitHub, mais GitHub Pages ne traitera pas ces soumissions. L'ancien dossier `backend/` n'est plus utilisé par le site ; les services Render existants ne sont pas supprimés automatiquement.
