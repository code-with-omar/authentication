## Chapter 1: User Create without password encryption

- Register
- Login
- Database matching
- save(), find({property: value}) property used here.And password human readable

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
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = new User({ email, password });

    newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
});
```

### 1.4 User login

```javascript
const User = require("./models/user.model");
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    console.log(user);
    if (user && user.password === password) {
      res.status(200).json({ status: "valid user" });
    } else {
      return res.status(401).json({ status: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
```

## Chapter 2 :Database Encryption

- Here use mongoose-encryption
- Go to the documentation of mongoose-encryption https://www.npmjs.com/package/mongoose-encryption
- Install mongoose-encryption
  ```cmd
  npm i mongoose-encryption
  ```

### 2.1 create new mongoose Schema

### 2.1.1 Require dependancy create Schema

```javascript
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  // whatever else
});
```

### 2.1.2 create an encryption key inside .env file

```javascript
ENCRYPTION_KEY = thisismyencryptionkeyforregisterlogin;
```

### 2.1.2 Use plugin Schema with secret

```javascript
userSchema.plugin(encrypt, {
  secret: encKey,
  encryptedFields: ["password"],
});
```

### 2.1.3 Full mongoose Schema

```javascript
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

const encKey = process.env.ENCRYPTION_KEY;
userSchema.plugin(encrypt, {
  secret: encKey,
  encryptedFields: ["password"],
});
module.exports = mongoose.model("User", userSchema);
```

### Chapter 3:Hashing password

- No Nedd any cncryption key; we will use hashing algorithm

- Hackers can not convert to plain text as no encryption key is available

- md5 package: https://www.npmjs.com/package/md5

```cmd
install md5 npm package: npm install md5

```

### Register

```javascript
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = new User({ email, password: md5(req.body.password) }); // Hashing function use

    newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
});
```

### Login

```Javascript
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    // md5(password) make hashing
    if (user && user.password === md5(password)) {
      res.status(200).json({ status: "valid user" });
    } else {
      return res.status(401).json({ status: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
```
