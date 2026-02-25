// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const cors = require("cors");

// dotenv.config();

// const app = express();

// app.use(cors());
// app.use(express.json());

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.log(err));

// app.use("/api/auth", require("./routes/authRoutes"));

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ✅ Root Route (ADD THIS HERE)
app.get("/", (req, res) => {
  res.status(200).json({
    message: "SBJ Clothings API is running 🚀",
  });
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));

// Connect DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
