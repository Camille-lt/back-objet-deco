import express from 'express';
import db from '../db/db.config.js'; 

const router = express.Router();
// 🚨 NOUVELLE ROUTE : GET /api/panier
// Récupère le contenu du panier actif de l'utilisateur simulé (ID 1)
router.get('/', async (req, res) => {
    // 🚨 NOTE : ID utilisateur simulé pour le test
    const SIMULATED_USER_ID = 1; 

    try {
        const query = `
            SELECT
                b.id AS panier_id,
                lp.quantite,
                p.id AS produit_id,
                p.nom,
                p.prix,
                p.image_url
            FROM paniers b
            JOIN lignes_paniers lp ON b.id = lp.panier_id
            JOIN produits p ON lp.produit_id = p.id
            WHERE b.user_id = $1 AND b.statut = 'actif';
        `;

        const result = await db.query(query, [SIMULATED_USER_ID]);

        if (result.rows.length === 0) {
            // Renvoie un panier vide si aucun panier actif n'est trouvé
            return res.json({ panier: [], total: 0 });
        }

        // Calculer le total du panier (optionnel, mais utile)
        const total = result.rows.reduce((sum, item) => sum + (item.prix * item.quantite), 0);

        res.json({
            panier: result.rows,
            total: total,
            panier_id: result.rows[0].panier_id
        });

    } catch (error) {
        console.error("Erreur lors de la lecture du panier :", error);
        res.status(500).json({ error: "Erreur serveur lors de la récupération du panier." });
    }
});

/**
 * POST /api/panier/add
 * Ajout d'un produit au panier (nécessite l'ID du produit, la quantité, et simule un userId).
 */
router.post('/add', async (req, res) => {
    // 🚨 NOTE : Simuler un ID utilisateur pour le test (doit être géré par l'authentification en prod)
    const SIMULATED_USER_ID = 1; 
    
    const { productId, quantity } = req.body;
    
    // Validation simple
    if (!productId || !quantity || quantity < 1) {
        return res.status(400).json({ error: "Données de panier invalides (productId ou quantité manquant)." });
    }

    // 🚨 Démarrer une transaction pour garantir la cohérence
    const client = await db.pool.connect(); 

    try {
        await client.query('BEGIN'); // Début de la transaction

        // 1. Trouver ou Créer le Panier Actif pour l'utilisateur
        let panierId;
        const findPanierQuery = `
            SELECT id FROM paniers
            WHERE user_id = $1 AND statut = 'actif'
        `;
        let panierResult = await client.query(findPanierQuery, [SIMULATED_USER_ID]);

        if (panierResult.rows.length === 0) {
            // Créer un nouveau panier s'il n'existe pas
            const createPanierQuery = `
                INSERT INTO paniers (user_id, statut)
                VALUES ($1, 'actif')
                RETURNING id;
            `;
            panierResult = await client.query(createPanierQuery, [SIMULATED_USER_ID]);
        }
        panierId = panierResult.rows[0].id;


        // 2. Insérer ou Mettre à Jour l'article dans le panier
        const insertLigneQuery = `
            INSERT INTO lignes_paniers (panier_id, produit_id, quantite)
            VALUES ($1, $2, $3)
            ON CONFLICT (panier_id, produit_id) DO UPDATE
            SET quantite = lignes_paniers.quantite + EXCLUDED.quantite
            RETURNING *;
        `;
        
        await client.query(insertLigneQuery, [panierId, productId, quantity]);

        await client.query('COMMIT'); // Fin de la transaction et validation

        res.status(200).json({ 
            success: true, 
            message: "Produit ajouté/mis à jour dans le panier.",
            panierId: panierId,
        });
        
    } catch (error) {
        await client.query('ROLLBACK'); // Annuler toutes les opérations en cas d'erreur
        console.error("Erreur lors de l'ajout au panier:", error);
        res.status(500).json({ error: "Erreur serveur lors de l'ajout au panier." });
    } finally {
        client.release(); // Relâcher le client dans le pool
    }
});

export default router;