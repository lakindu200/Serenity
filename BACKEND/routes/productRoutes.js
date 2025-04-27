import express from "express";
import {
    add,
    getProductById,
    updateProduct,
    getAllProducts,
    deactivateProduct,
    activateProduct,
    getFilteredAndSortedProducts,
} from "../controllers/productController.js";
// import { getFilteredAndSortedProducts } from "../controllers/productController.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const tempDir = path.join(__dirname, "../uploads/temp");
        fs.mkdirSync(tempDir, { recursive: true });
        cb(null, tempDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error("Only images (jpeg, jpg, png, webp) are allowed"));
    },
    limits: { fileSize: 5 * 1024 * 1024 },
});

const productRoutes = express.Router();

productRoutes.post("/add", upload.single("image"), add);
productRoutes.get("/filtered", getFilteredAndSortedProducts);
productRoutes.get("/:id", getProductById);
productRoutes.put("/update/:id", upload.single("image"), updateProduct);
productRoutes.get("/", getAllProducts);
productRoutes.put("/deactivate/:id", deactivateProduct);
productRoutes.put("/activate/:id", activateProduct);

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        console.log('Fetching products...');
        const products = await Product.find({});
        console.log(`Found ${products.length} products`);
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            message: 'Error fetching products',
            error: error.message
        });
    }
});

export default productRoutes;