# dine Marketplace

## Déploiement rapide


```bash
git add .
git commit -m "Translate UI, update branding and defaults"
git push
```

```powershell
npm install
#$env:ADMIN_KEY = "Amsardine229"  # définir la clé admin pour la session
node server.js
```

- Utiliser `pm2` en production (exemple):

```bash
npm install -g pm2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

- Variables d'environnement recommandées:

	- `ADMIN_KEY` — clé d'administration (mettre `Amsardine229` en prod si vous le souhaitez)
	- `PORT` — port d'écoute (par défaut `3000`)

Le serveur sert les fichiers statiques depuis le dossier `public`.

Si vous voulez, je peux aussi ajouter un fichier `systemd` d'exemple ou committer ces changements pour vous.

## SEO — faire apparaître le site dans Google

1. Remplacez `https://example.com/` dans `public/index.html`, `sitemap.xml` et `robots.txt` par votre domaine réel.
2. Vérifiez que le site est accessible publiquement via ce domaine (DNS et HTTPS configurés).
3. Allez sur Google Search Console (https://search.google.com/search-console), ajoutez votre propriété (domaine), puis soumettez `https://your-domain/sitemap.xml`.
4. Assurez-vous que `public/index.html` contient une `meta description` claire (déjà ajoutée) et un `title` optimisé pour "dine".
5. Créez des backlinks (annonces, réseaux sociaux, annuaires) pointant vers votre domaine pour améliorer la visibilité.

Remarque: le positionnement sur "Dine" dépendra aussi de la concurrence et du contexte — pour un bon référencement, vous devrez assurer du contenu unique, des pages mobiles rapides et des backlinks de qualité. Je peux vous aider à automatiser la génération d'une image OG, vérifier la vitesse mobile, ou soumettre le sitemap à la Search Console si vous me fournissez le domaine.

A simple clothing marketplace with a responsive customer catalog and an admin interface for adding, editing, and removing items.

## Features

- Modern responsive product gallery
- Category filter and search
- Admin page to manage products
- WhatsApp chat link for each product
- Image URL support for any external image host or uploaded admin images