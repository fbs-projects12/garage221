# ==============================================================================
# DOCKERFILE — Garage 221 (Node.js / Express / Prisma)
# ==============================================================================
# Ce fichier décrit comment construire l'image Docker du projet.
# On utilise un build multi-stage (en 2 étapes) pour obtenir une image
# finale légère, sans les outils de build qui ne servent qu'à la construction.
# ==============================================================================


# ==============================================================================
# STAGE 1 — Installation des dépendances + génération du client Prisma
# ==============================================================================
# On part d'une image Node.js 20 basée sur Alpine Linux (très légère ~5MB).
# Ce stage sert uniquement à préparer les fichiers nécessaires.
# Il ne sera PAS inclus dans l'image finale.
FROM node:20-alpine AS deps

# Définir le dossier de travail dans le conteneur
WORKDIR /app

# Copier uniquement les fichiers de dépendances en premier.
# Astuce Docker : si package.json ne change pas, Docker réutilise le cache
# de l'étape npm ci sans tout réinstaller à chaque build.
COPY package*.json ./

# Installer les dépendances de production uniquement (--omit=dev exclut nodemon,
# eslint, et tous les outils de développement qui ne servent pas en production)
RUN npm ci --omit=dev

# Copier le schéma Prisma (prisma/schema.prisma) dans le conteneur
COPY prisma ./prisma/

# Générer le client Prisma à partir du schéma.
# Cette commande crée le code JavaScript que l'app utilise pour
# communiquer avec la base de données MySQL.
RUN npx prisma generate


# ==============================================================================
# STAGE 2 — Image finale de production (légère)
# ==============================================================================
# On repart d'une image Node.js 20 Alpine propre.
# On copie uniquement ce dont l'app a besoin pour tourner (pas les outils de build).
FROM node:20-alpine AS runner

# Définir le dossier de travail dans le conteneur
WORKDIR /app

# Sécurité : créer un groupe et un utilisateur système non-root.
# Par défaut Docker tourne en root, ce qui est dangereux si l'app est compromise.
# Bonne pratique : toujours exécuter l'app avec un utilisateur aux droits limités.
RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 garage

# Copier les node_modules et le client Prisma générés depuis le stage 1.
# --from=deps indique qu'on prend ces fichiers du stage précédent, pas du disque local.
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma       ./prisma

# Copier tout le code source du projet (server.js, routes/, controllers/, etc.)
COPY . .

# Basculer vers l'utilisateur non-root créé plus haut
# Toutes les commandes suivantes (et l'app elle-même) s'exécuteront avec cet utilisateur
USER garage

# Variables d'environnement disponibles dans le conteneur au démarrage
ENV NODE_ENV=production   # Active le mode production dans Express (logs réduits, pas de stack traces)
ENV PORT=3000             # Port sur lequel l'app va écouter

# Déclarer le port que le conteneur expose vers l'extérieur.
# Cette ligne est documentaire : elle n'ouvre pas le port, c'est docker run -p qui le fait.
EXPOSE 3000

# Commande exécutée au démarrage du conteneur.
# Lance directement Node.js (pas npm start) pour éviter un processus intermédiaire.
#
# Alternative si tu veux appliquer les migrations Prisma avant chaque démarrage :
# CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
CMD ["node", "server.js"]
