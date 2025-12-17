import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

// Vérification de la présence de la variable d'environnement
if (!connectionString) {
    throw new Error('DATABASE_URL est manquant dans les variables d\'environnement.');
}

// Déclaration et initialisation du Pool
const pool = new Pool({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }, // Nécessaire pour les connexions Neon
});

// Exécute un test de connexion unique au démarrage pour valider la configuration
pool.connect()
    .then(client => {
        console.log("✅ Connexion à Neon établie et pool prêt.");
        client.release();
    })
    .catch(err => {
        console.error("❌ Échec critique de la connexion à Neon :", err.stack);
    });

/**
 * Exportation de la fonction query pour des appels rapides
 */
export const query = (text, params) => pool.query(text, params);

/**
 * Exportation du pool lui-même (nommée) pour les connexions directes
 * Utile pour gérer des transactions ou des besoins spécifiques dans les routes
 */
export const dbPool = pool; 

/**
 * Exportation par défaut sous forme d'objet
 * Assure la compatibilité avec l'importation 'pool' ou 'db' dans vos fichiers de routes
 */
export default { 
    pool: pool, 
    query: query 
};