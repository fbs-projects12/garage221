const app = require('./app');
const { prisma } = require('./src/models');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log('Base de données connectée avec Prisma !');
    app.listen(PORT, () => {
      console.log(`Garage 221 — API démarrée sur http://localhost:${PORT}/api`);
      console.log(`Swagger disponible sur http://localhost:${PORT}/api-docs`);
    });
  } catch (err) {
    console.error('Erreur de connexion à la base de données :', err);
    process.exit(1);
  }
}

startServer();