const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const axios = require('axios');

const app = express();
const port = 3000;
app.use(bodyParser.json());

// Configuration de la connexion à MariaDB
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'api_user',
  password: process.env.DB_PASSWORD || 'password123',
  database: process.env.DB_NAME || 'api_db',
});

// Test de connexion
(async () => {
  try {
    await db.query('SELECT 1');
    console.log('Connecté à la base de données MariaDB.');
  } catch (err) {
    console.error('Erreur de connexion à la base de données :', err.message);
  }
})();

// Endpoint exemple
app.get('/', async (req, res) => {
  try {
    const [results] = await db.query('SELECT NOW() AS now');
    res.status(200).json(results[0]);
  } catch (err) {
    console.error('Erreur lors de la récupération de la date et heure actuelle :', err.message);
    res.status(500).send('Erreur serveur lors de la récupération de la date et heure actuelle.');
  }
});

// Ping
app.get('/ping', (req, res) => {
  res.send('pong');
});

// Create cities table
app.post('/create-cities-table', async (req, res) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS cities (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      insee_code VARCHAR(5) NOT NULL,
      postal_code VARCHAR(130) NOT NULL,
      population INT,
      departement_code VARCHAR(5) NOT NULL,
      departement_name VARCHAR(50) NOT NULL,
      region_code VARCHAR(5) NOT NULL,
      region_name VARCHAR(50) NOT NULL
    )
  `;

  try {
    const [result] = await db.query(createTableQuery);
    res.status(200).send('Table créée avec succès.');
  } catch (err) {
    console.error('Erreur lors de la création de la table :', err.message);
    res.status(500).send('Erreur serveur lors de la création de la table.');
  }
});

// Show cities table
app.get('/show-cities-table', async (req, res) => {
  const showCitiesQuery = `SELECT * FROM cities`;

  try {
    const [results] = await db.query(showCitiesQuery);
    res.status(200).json(results);
  } catch (err) {
    console.error('Erreur lors de la récupération des villes :', err.message);
    res.status(500).send('Erreur serveur lors de la récupération des villes.');
  }
});

// Delete cities table
app.delete('/delete-cities-table', async (req, res) => {
  const dropTableQuery = `DROP TABLE IF EXISTS cities`;

  try {
    const [result] = await db.query(dropTableQuery);
    res.status(200).send('Table supprimée avec succès.');
  } catch (err) {
    console.error('Erreur lors de la suppression de la table :', err.message);
    res.status(500).send('Erreur serveur lors de la suppression de la table.');
  }
});

// Fetch data to insert cities
app.post('/fetch-and-insert-cities', async (req, res) => {
  try {
    // const { data } = await axios.get('https://geo.api.gouv.fr/communes?codeDepartement=06&fields=nom,code,codesPostaux,departement,region,population'); // Que les Alpes Maritimes
    const { data } = await axios.get('https://geo.api.gouv.fr/communes?fields=nom,code,codesPostaux,departement,region,population'); // Toute la France

    const insertCityQuery = `
      INSERT INTO cities (name, insee_code, postal_code, population, departement_code, departement_name, region_code, region_name)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    for (const commune of data) {
      const {
        nom,
        code,
        codesPostaux,
        population,
        departement,
        region
      } = commune;

      const postalCodes = codesPostaux.join(',');

      await db.query(insertCityQuery, [
        nom,
        code,
        postalCodes,
        population,
        departement.code,
        departement.nom,
        region.code,
        region.nom
      ]);
    }

    res.status(200).send('Toutes les villes ont été insérées avec succès dans la base de données.');
  } catch (err) {
    console.error('Erreur lors de la récupération ou de l\'insertion des villes :', err.message);
    res.status(500).send('Erreur serveur lors de la récupération ou de l\'insertion des villes.');
  }
});

app.get('/get-schema', async (req, res) => {
  try {
    const schemaQuery = `
      SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_KEY, EXTRA
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ?
      ORDER BY TABLE_NAME, ORDINAL_POSITION;
    `;

    const databaseName = process.env.DB_NAME || 'api_db';
    const [rows] = await db.query(schemaQuery, [databaseName]);

    const schema = rows.reduce((acc, column) => {
      const {
        TABLE_NAME,
        COLUMN_NAME,
        DATA_TYPE,
        IS_NULLABLE,
        COLUMN_KEY,
        EXTRA
      } = column;

      if (!acc[TABLE_NAME]) {
        acc[TABLE_NAME] = [];
      }

      acc[TABLE_NAME].push({
        column_name: COLUMN_NAME,
        data_type: DATA_TYPE,
        is_nullable: IS_NULLABLE,
        key: COLUMN_KEY,
        extra: EXTRA,
      });

      return acc;
    }, {});

    res.status(200).json(schema);
  } catch (err) {
    console.error('Erreur lors de la récupération du schéma de la base de données :', err.message);
    res.status(500).send('Erreur serveur lors de la récupération du schéma de la base de données.');
  }
});

app.post('/execute-query', async (req, res) => {
  const { query } = req.body;

  // Vérifier si une requête SQL est fournie
  if (!query) {
    return res.status(400).send('Aucune requête SQL fournie.');
  }

  try {
    // Exécuter la requête SQL
    const [results] = await db.query(query);

    // Retourner les résultats
    res.status(200).json({
      message: 'Requête exécutée avec succès.',
      results,
    });
  } catch (err) {
    console.error('Erreur lors de l\'exécution de la requête SQL :', err.message);
    res.status(500).json({
      message: 'Erreur lors de l\'exécution de la requête SQL.',
      error: err.message,
    });
  }
});


app.listen(port, () => {
  console.log(`Serveur API démarré sur http://localhost:${port}`);
});
