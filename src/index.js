// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const app = express();

// // Middlewares
// app.use(cors());
// app.use(express.json());

// // ✅ Root Route (ADD THIS HERE)
// app.get("/", (req, res) => {
//   res.status(200).json({
//     message: "SBJ Clothings API is running 🚀",
//   });
// });

// // Routes
// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/orders", require("./routes/orderRoutes"));

// // Connect DB
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.error(err));

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ================= MIDDLEWARES =================
const allowedOrigins = [
  "http://localhost:3000",
  "https://sbj-clothing.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.set("trust proxy", 1); // optional but safe

// ================= ROOT ROUTE =================
app.get("/", (req, res) => {
  res.status(200).json({
    message: "SBJ Clothings API is running 🚀",
  });
});

// ================= ROUTES =================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

// ================= MONGODB CONNECTION =================
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err.message));

// Auto-reconnect on disconnect
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected... reconnecting");
  mongoose.connect(process.env.MONGO_URI).catch((err) =>
    console.error("❌ Reconnect failed:", err.message)
  );
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.message);
  res.status(500).json({
    error: "Something went wrong",
    details: err.message,
  });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


