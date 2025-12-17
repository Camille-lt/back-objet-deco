import express from 'express';
// On importe 'pool' depuis votre config
import pool from "../db/db.config.js"; 

const router = express.Router();

/**
 * GET /api/produits
 * Récupère tous les produits avec jointures pour le catalogue.
 */
router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT 
        p.*, 
        c.nom AS categorie_nom, 
        s.nom AS style_nom
      FROM produits p
      LEFT JOIN categories c ON p.categorie_id = c.id
      LEFT JOIN styles s ON p.style_id = s.id
      ORDER BY p.id ASC
    `;
    // 🚨 Correction : Utiliser 'pool' au lieu de 'db'
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("💥 Erreur lors de la récupération du catalogue :", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/produits/:id
 * Récupère un produit unique par son ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 🚨 Correction : Ajout d'un espace avant le deuxième JOIN pour éviter l'erreur SQL
    const query = `
      SELECT
        p.*,
        s.nom AS style_nom, 
        c.nom AS categorie_nom
      FROM produits p 
      LEFT JOIN styles s ON p.style_id = s.id 
      LEFT JOIN categories c ON p.categorie_id = c.id
      WHERE p.id = $1;
    `;

    // 🚨 Correction : Utiliser 'pool' au lieu de 'db'
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
        return res.status(404).json({ error: "Produit non trouvé." });
    }

    res.json(result.rows[0]);
  } catch (error) {
    // 🚨 Correction : Utilisation des backticks (`) pour le template literal
    console.error(`Erreur lors de la récupération du produit ${req.params.id}:`, error);
    res.status(500).json({ error: "Erreur serveur lors de la récupération du produit." });
  }
});

export default router;