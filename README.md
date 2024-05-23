# SpacePoyo
Github repository of our [Pixi.js](https://pixijs.com/) game Space Poyo

## Description
Space Poyo est un jeu platformeur, où Poyo s'envole dans l'espace!

## Comment ça marche
Il y a trois types de mouvements: gauche, droite et saut.
Quand Poyo saute et arrive sur une plateforme, une nouvelle sera créée et le score augmente.
Ce jeu utilise les fonctionnalités de Chromecast pour émettre le jeu et contrôler Poyo.

## Guide de conception
### Glossaire
- Platformeur : Jeu auquel on doit sauter sur des plateformes
- Chromecast : Appareil servant à émettre un type de média

### Principe de base
On se connecte au Chromecast sur le jeu, comme un serveur, et on utilise la page de la manette comme client qui lui envoie des commandes.

### Actions possibles
- Connexion à un Chromecast
- Envoi de direction au jeu par rapport au personnage
- Déconnexion

### États possibles
- Connecté au Chromecast, ou non
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
Après avoir laissé un testeur voir le jeu et la manette pendant 5 secondes, nous lui avons posé quelques questions.

### Avez-vous compris ce que vous devez faire pour jouer?
Le testeur, ayant beaucoup d'expérience avec les jeux vidéos, a rapidement répondu qu'il fallait sauter sur la plateforme avec les boutons directionnels.

### Est-ce que vous avez envie de l'essayer?
Il a répondu que savoir comment le jeu allait fonctionner était quelque chose qui lui faisait vouloir l'essayer, et que visuellement, ça donnait envie de le tester.

### Quelle partie vous intrigue le plus?
Il nous a dit que le deuxième saut, de la première plateforme à la deuxième, était quelque chose qu'il était curieux de découvrir comment il fonctionnerait.

## Tests d'usabilité
(En préparation)
