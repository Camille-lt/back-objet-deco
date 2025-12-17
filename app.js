import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
// Importation du module de connexion à la BDD
import db from './db/db.config.js'; 

const app = express();

// Importation des routes nécessaires
import produitRoutes from './routes/productRoutes.js'; 
import basketRoutes from './routes/basketRoutes.js'; // 🚨 NOUVEL IMPORT


// Middlewares : Doivent être déclarés en PREMIER
app.use(cors());
app.use(express.json()); // Nécessaire pour lire req.body (ajout au panier)


// Route API (Produits : /api/produits et /api/produits/:id)
app.use('/api/produits', produitRoutes);
// 🚨 Route Panier (pour POST /api/panier/add)
app.use('/api/panier', basketRoutes);


// Route test (racine)
app.get("/", (req, res) => {
  res.send("API Objet Déco en ligne !");
});


const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`🚀 Server running: http://localhost:${port}`);
  // Le test de connexion Neon est dans db/db.config.js et s'exécute au démarrage
});