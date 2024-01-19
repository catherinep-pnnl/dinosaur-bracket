const express = require("express");
const { Sequelize } = require("sequelize");
require("dotenv").config();

const app = express();

// Connect to MySQL database from the server
const sequelize = new Sequelize("dinosaurs", "root", process.env.DB_PASSWORD, {
  dialect: "mysql",
  host: "localhost",
});

// Define a model
const Dinosaur = sequelize.define("Dinosaur", {
  name: { type: Sequelize.STRING, allowNull: false },
  votes: { type: Sequelize.INTEGER, allowNull: false },
  bracket: { type: Sequelize.STRING, allowNull: false },
});

// Sync the model with the database
sequelize.sync({ force: true }); // TODO: remove true when ready to go to prod

// Middleware
app.use(express.json());

// Endpoints
app.get("/dinosaurs", async (req, res) => {
  const dinosaurs = await Dinosaur.findAll();
  res.json(dinosaurs);
});

app.post("/dinosaurs", async (req, res) => {
  const { name, votes } = req.body;
  const dinosaur = await Dinosaur.update({ name, votes }); // have to find by name and bracket, and update the votes
  res.json(dinosaur);
});

// Protection middleware
app.use((req, res, next) => {
  const token = req.headers.authorization;
  if (token !== "secret-token") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
});

// Start the server
app.listen(3000, () => {
  console.log("Server started on port 3001");
});
