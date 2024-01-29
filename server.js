//console.log("Code wORKS !");
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import db from "./models/index.js";

dotenv.config();
const app = express();

const CONNECTION_URL = process.env.dbConfig;
const PORT = process.env.PORT || 4000;

// Configure CORS options to allow requests only from the specified origin
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://example.com",
];
var corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
// Apply CORS middleware restricting access to resources to the specified origin
app.use(cors(corsOptions));

// parse requests of content-type
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//db connection
console.log(process.env.dbConfig);
db.mongoose
  .connect(CONNECTION_URL)
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

app.get("/", (req, res) => {
  res.json({ message: "Auth app Works" });
});
//console.log(process.env.PORT);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
