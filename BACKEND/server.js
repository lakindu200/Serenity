import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";

const app = express();
const port = 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/product", productRoutes);

connectDB();

app.get("/", (req, res) => {
    res.send("API Working");
});

app.listen(port, () => console.log(`listening on localhost:${port}`));