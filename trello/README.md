# Import Trello QueueLess Clinics

Ce dossier contient l'organisation Trello generee pour le projet. Le board est pense pour un suivi en developpement local, sans taches de production ou de deploiement final.

## Fichiers

- `queueless-trello-board.json` : listes de sprint, cartes, checklists, labels, priorites, dependances et assignations.
- `trello.config.example.json` : modele de configuration sans secrets reels.
- `trello.config.local.json` : configuration locale ignoree par Git, a renseigner avec les identifiants Trello.
- `../scripts/import-trello-board.js` : script Node.js d'import automatique.

## Verification sans creation Trello

```bash
node scripts/import-trello-board.js
```

## Import reel

Renseigner dans `trello/trello.config.local.json` :

- `trello.boardId`
- `trello.apiKey`
- `trello.token`
- `memberIds.Fourat Jebali`
- `memberIds.Med Amin Neji`
- `memberIds.Salim Halila`

Puis lancer :

```bash
node scripts/import-trello-board.js --execute
```

Le script cree ou reutilise les listes par nom, cree les cartes, ajoute les labels, ajoute les checklists et assigne les membres quand leurs IDs Trello sont fournis.
