# ==============================================================================
# STAGE 1 — Installation des dépendances + génération du client Prisma
# ==============================================================================
FROM node:20-alpine AS deps

WORKDIR /app

# Copier les fichiers de dépendances en premier (optimise le cache Docker)
COPY package*.json ./

# Installer uniquement les dépendances de production (pas nodemon)
RUN npm ci --omit=dev

# Copier le schéma Prisma et générer le client
COPY prisma ./prisma/
RUN npx prisma generate


# ==============================================================================
# STAGE 2 — Image finale de production (légère)
# ==============================================================================
FROM node:20-alpine AS runner

WORKDIR /app

# Sécurité : créer un utilisateur non-root pour exécuter l'app
RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 garage

# Copier les dépendances et le client Prisma depuis le stage 1
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma       ./prisma

# Copier tout le code source du projet
COPY . .

# Passer à l'utilisateur non-root (bonne pratique de sécurité)
USER garage

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=3000

# Port exposé par le conteneur
EXPOSE 3000

# Démarrage de l'application
# Note : pour appliquer les migrations Prisma avant démarrage, utilisez :
# CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
CMD ["node", "server.js"]
