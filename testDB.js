import pool from "./db/db.config";

async function testConnection() {
  try {
    console.log("🔹 Test de connexion à la BDD...");
    const result = await pool.query("SELECT * FROM produits LIMIT 5"); // On ne prend que 5 lignes
    console.log("✅ Connexion OK ! Voici un extrait des données :");
    console.table(result.rows);
    process.exit(0); // Quitte le script
  } catch (err) {
    console.error("❌ Erreur lors du test de connexion :", err);
    process.exit(1); // Quitte avec erreur
  }
}

testConnection();