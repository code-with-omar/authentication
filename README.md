## Chapter 1: User Create without password encryption

- Register
- Login
- Database matching

### 1.1 user Schema create

Note

- MongoDB use as a database

```javascript
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // Use `new` keyword
  email: {
    type: String,
    required: true, // Fixed typo
  },
  password: {
    // Fixed typo
    type: String,
    required: true, // Fixed typo
  },
  createdOn: {
    // Renamed to follow convention
    type: Date,
    default: Date.now, // Fixed default value
  },
});

module.exports = mongoose.model("User", userSchema); // Use singular, capitalized model name
```

### 1.2 Server create and mongoDB database connect and all require dependency

```javascript
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
// Port
const PORT = process.env.PORT || 5000;
// mongoDB database connection

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

### 1.3 User register

```javascript
const User = require("./models/user.model");
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
```
