require("dotenv").config();
const express = require("express");
const cors = require("cors");

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require("./models/user.model");
const app = express();
const PORT = process.env.PORT || 5000;
const dbURL = process.env.MONGO_URL;
mongoose
  .connect(dbURL)
  .then(() => console.log("Database connect"))
  .catch((error) => {
    console.log(error);
    const omar="omar"
    process.exit(1);
  });

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      const newUser = new User({
        email: email,
        password: hash,
      });
      await newUser.save();
      res.status(201).json(newUser);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          res.status(200).json({ status: "valid user" });
        }
      });
    } else {
      return res.status(401).json({ status: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
