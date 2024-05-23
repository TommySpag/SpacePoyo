# SpacePoyo
Github repository of our [Pixi.js](https://pixijs.com/) game Space Poyo

## Description
Space Poyo est un jeu platformeur, où Poyo s'envole dans l'espace!

## Comment ça marche
Il y a trois type de mouvements: gauche, droite et saut.
Quand Poyo saute et arrive sur une platforme, une nouvelle sera créée et le score augmente.
Ce jeu utilise les fonctionnalité de chromecast pour émettre le jeu et contrôler Poyo.

## Guide de conception
### Glossaire
- Platformeur : Jeu auquel on doit sauter sur des plateformes
- Chromecast : Appareil servant à émettre un type de média

### Principe de base
On se connecte au chromecast sur le jeu, comme un serveur, et on utilise la page de la manette comme client qui lui envoie des commandes.

### Actions possibles
- Connexion à un chromecast
- Envoie de direction au jeu par rapport au personnage
- Déconnexion

### États possibles
- Connecté au chromecast, ou non
- Personnage stationnaire
- Personnage sautant et allant vers la gauche ou la droite
- Personnage bougeant vers la gauche ou la droite

### Liste des contrôles
- Bouton permettant de se connecter ou se déconnecter
- Bouton permettant d'aller vers la gauche
- Bouton permettant d'aller vers la droite
- Bouton permettant de sauter

### Limitation des contrôles
Comme la manette est faite sur le web, le mouvement du personnage n'est pas aussi fluide que si la manette était tactile, car il faut utiliser la souris.

## Test de 5 secondes


## Tests d'usabilité
