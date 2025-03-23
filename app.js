require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user.model");

const app = express();
const PORT = process.env.PORT || 5000;
const dbURL = process.env.MONGO_URL;
mongoose
  .connect(dbURL)
  .then(() => console.log("Database connect"))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});
app.post("/register", (req, res) => {
  const { email, password } = req.body;
  try {
    const newUser = new User({ email, password });
    console.log(newUser);
    newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
