require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
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

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  console.log({ email, password }); // Debugging output
  res.status(201).json({ email, password });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
