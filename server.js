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
  name: { type: Sequelize.STRING },
  person: { type: Sequelize.STRING },
  votes: { type: Sequelize.INTEGER },
  bracket: { type: Sequelize.STRING },
});

// Sync the model with the database
sequelize.sync(); // add force: true to drop the db and recreate it

// Middleware
app.use(express.json());

// Endpoints
app.get("/api/dinosaurs", async (req, res) => {
  const dinosaurs = await Dinosaur.findAll();
  res.json(dinosaurs);
});

app.post("/api/dinosaurs", async (req, res) => {
  const dinosaur = await Dinosaur.create(req.body);
  res.json(dinosaur);
});

app.post("/api/dinosaurs/:bracket/:name", async (req, res) => {
  const dinosaur = await Dinosaur.findOne({
    where: { bracket: req.params.bracket, name: req.params.bracket },
  });
  if (dinosaur) {
    dinosaur.increment("votes", { by: 1 });
    res.json(dinosaur);
  } else {
    console.log("error", dinosaur);
  }
});

// Protection middleware
// app.use((req, res, next) => {
//   const token = req.headers.authorization;
//   if (token !== "secret-token") {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
//   next();
// });

// Start the server
app.listen(3001, () => {
  console.log("Server started on port 3001");
});
