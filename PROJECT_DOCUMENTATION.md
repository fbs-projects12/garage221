# Garage 221 - Documentation du projet

## Contexte métier

Garage 221 gère :
- les mécaniciens,
- les véhicules des clients,
- les interventions réalisées,
- les pièces utilisées pendant chaque intervention.

Le projet expose une API REST pour ces entités et applique des règles métier strictes.

---

## Entités et contraintes

### Mécanicien
Champs :
- `prenom` (obligatoire)
- `nom` (obligatoire)
- `email` (obligatoire, unique)
- `telephone` (optionnel)
- `specialite` (obligatoire, valeurs acceptées : `moteur`, `carrosserie`, `electricite`, `autre`)

Contraintes assurées :
- email unique
- spécialité obligatoire
- prénom et nom obligatoires

### Véhicule
Champs :
- `immatriculation` (obligatoire, unique)
- `marque` (obligatoire)
- `modele` (obligatoire)
- `nomProprietaire` (obligatoire)
- `telProprietaire` (optionnel)

Contraintes assurées :
- immatriculation unique
- marque, modèle, nom du propriétaire obligatoires

### Intervention
Champs :
- `mecanicienId` (obligatoire)
- `vehiculeId` (obligatoire)
- `dateIntervention` (obligatoire)
- `description` (obligatoire)
- `statut` (enum : `EN_ATTENTE`, `EN_COURS`, `TERMINEE`)
- `coutMainOeuvre` (nombre `>= 0`)

Contraintes assurées :
- `mecanicienId` et `vehiculeId` doivent exister en base
- `dateIntervention` doit être une date valide
- description obligatoire
- coût main d'œuvre >= 0
- création d'une intervention initialise `statut` à `EN_ATTENTE`

### Pièce utilisée
Champs :
- `interventionId` (obligatoire)
- `libelle` (obligatoire)
- `quantite` (entier strictement > 0)
- `prixUnitaire` (nombre strictement > 0)

Contraintes assurées :
- `interventionId` doit exister
- libellé obligatoire
- quantité entière positive
- prix unitaire positif
- coût total pièces calculé par `quantite * prixUnitaire`

---

## Règles métier implémentées

### Création d'un mécanicien
- Validation des champs via `src/validators/schemas.js`
- Enregistrement via `src/services/mecanicien.service.js`
- Email unique géré par Prisma / base de données

### Enregistrement d'un véhicule
- Validation des champs via `src/validators/schemas.js`
- Enregistrement via `src/services/vehicule.service.js`
- Immatriculation unique géré par Prisma / base de données

### Création d'une intervention
- Vérification que le mécanicien et le véhicule existent
- Validation de la date, description et coût
- Création avec `statut` forcé à `EN_ATTENTE`

### Ajout d'une pièce
- Vérification que l'intervention existe
- Validation du libellé, quantité et prix unitaire
- Enregistrement via `src/services/piece.service.js`

### Suppression / cohérence
- Interdit de supprimer un mécanicien avec des interventions `EN_COURS`
- Interdit de supprimer un véhicule ayant des interventions liées
- Interdit de supprimer une intervention si des pièces y sont liées

---

## Architecture du code

### Structure principale

```
app.js
server.js
src/
  config/
    database.js
  controllers/
  middlewares/
  models/
  routes/
  services/
  validators/
prisma/
  schema.prisma
```

### Responsabilités

- `server.js`
  - lance l’application
  - démarre la connexion Prisma

- `app.js`
  - configure Express
  - connecte les routes et middlewares

- `src/config/database.js`
  - instancie `PrismaClient`

- `src/models/index.js`
  - expose l’instance Prisma utilisée par les services

- `src/validators/schemas.js`
  - définit tous les schémas Zod de validation

- `src/middlewares/validate.js`
  - applique la validation sur `req.body`
  - renvoie `400` avec les messages d’erreur Zod en cas de rejet

- `src/routes/*`
  - exposent les endpoints REST
  - invoquent les contrôleurs
  - appliquent la validation des requêtes

- `src/controllers/*`
  - traitent la logique HTTP de base
  - délèguent au service approprié

- `src/services/*`
  - contiennent la logique métier et les règles de cohérence
  - appellent Prisma via `prisma.<model>...`

---

## Communication entre fichiers

1. `routes` reçoivent une requête HTTP.
2. `routes` appliquent `validate(schema)` lorsque nécessaire.
3. `routes` appellent `controllers`.
4. `controllers` appellent `services`.
5. `services` utilisent `src/models/index.js` pour accéder à `prisma`.
6. `prisma` exécute les opérations en base.
7. Les erreurs Prisma ou levées par le service sont captées par le middleware d’erreur global.

---

## Schéma Prisma

Les entités Prisma se trouvent dans `prisma/schema.prisma` et correspondent aux tables suivantes :
- `Mecanicien`
- `Vehicule`
- `Intervention`
- `PieceUtilisee`
- `StatutIntervention` (enum)

Les relations sont :
- `Mecanicien` 1:N `Intervention`
- `Vehicule` 1:N `Intervention`
- `Intervention` 1:N `PieceUtilisee`

---

## Validation Zod

Les schémas de validation sont dans `src/validators/schemas.js` :
- `mecanicienSchema`
- `vehiculeSchema`
- `interventionSchema`
- `pieceSchema`

Le middleware `src/middlewares/validate.js` transforme les erreurs Zod en réponse JSON claire.

---

## Points de vigilance

- Les routes `PUT` utilisent le même schéma que `POST`, donc elles attendent encore l’intégralité du corps du même format.
- La validation de date est faite sur une chaîne de caractères vérifiant `Date.parse()`.
- Le calcul du coût total des pièces existe dans `src/services/piece.service.js` via la méthode `coutTotal()`.

---

## Conclusion

Oui, le code implémente strictement les exigences métier principales du texte :
- gestion des mécaniciens,
- gestion des véhicules,
- création d’interventions avec vérification d’existence,
- ajout de pièces avec validation,
- règles de cohérence de suppression.

Ce fichier peut servir de guide pour un développeur qui veut comprendre le projet, ses entités, sa structure, et comment les fichiers communiquent entre eux.
