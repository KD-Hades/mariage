# TAN Pearl

Ajoutez le fichier de police web `TAN-Pearl.woff2` dans ce dossier.
Le site utilisera TAN Pearl pour les noms Chrysler et Vanella.

Si vous disposez d'un fichier `.otf` ou `.ttf`, modifiez le `src` de la règle
`@font-face` à la fin de `theme.css` pour indiquer son nom et son format :

```css
src: url("fonts/TAN-Pearl.otf") format("opentype");
```

Sans fichier de police, la police de secours Viaoda Libre reste utilisée.

## Gastonia Script
Le titre « Une promesse, une vie à deux » utilise `Gastonia Script.ttf`.
Sans ce fichier, le titre utilise Alex Brush.

