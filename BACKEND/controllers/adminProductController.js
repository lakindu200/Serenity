import Product from "../models/productModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const add = async (req, res) => {
    try {
        const {
            Product_name,
            product_type,
            Category,
            size,
            Material,
            price: priceStr,
            stock_quantity: stockStr,
            status,
        } = req.body;

        if (!Product_name?.trim()) throw new Error("Product name is required");
        if (!product_type?.trim()) throw new Error("Product type is required");
        if (!Category?.trim()) throw new Error("Category is required");
        if (!size?.trim()) throw new Error("Size is required");
        if (!Material?.trim()) throw new Error("Material is required");

        const price = parseFloat(priceStr);
        const stock_quantity = parseInt(stockStr);

        if (isNaN(price) || price <= 0) throw new Error("Price must be a valid number greater than 0");
        if (isNaN(stock_quantity) || stock_quantity < 0) throw new Error("Stock quantity must be a valid non-negative integer");

        if (!req.file) throw new Error("Image is required");

        const productData = {
            Product_name: Product_name.trim(),
            product_type,
            Category,
            size,
            Material,
            price,
            stock_quantity,
            status: status || "active",
        };

        const product = new Product(productData);
        await product.save();

        const tempPath = req.file.path;
        const productId = product._id.toString();
        const finalPath = path.join(__dirname, "../uploads/products", productId, `image_1${path.extname(req.file.originalname)}`);

        if (!fs.existsSync(tempPath)) {
            throw new Error(`Temporary file not found at ${tempPath}`);
        }

        fs.mkdirSync(path.dirname(finalPath), { recursive: true });

        try {
            fs.renameSync(tempPath, finalPath);
        } catch (error) {
            throw new Error(`Failed to move file: ${error.message}`);
        }

        product.image_path = `/uploads/products/${productId}/image_1${path.extname(req.file.originalname)}`;
        await product.save();

        res.status(201).json({ message: "Product added successfully", product });
    } catch (error) {
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Failed to delete temp file:", err);
            });
        }
        console.error("Error adding product:", error);
        res.status(400).json({ message: error.message || "Failed to add product" });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message || "Failed to fetch product" });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const {
            Product_name,
            product_type,
            Category,
            size,
            Material,
            price: priceStr,
            stock_quantity: stockStr,
            status,
        } = req.body;

        if (!Product_name?.trim()) throw new Error("Product name is required");
        if (!product_type?.trim()) throw new Error("Product type is required");
        if (!Category?.trim()) throw new Error("Category is required");
        if (!size?.trim()) throw new Error("Size is required");
        if (!Material?.trim()) throw new Error("Material is required");

        const price = parseFloat(priceStr);
        const stock_quantity = parseInt(stockStr);

        if (isNaN(price) || price <= 0) throw new Error("Price must be a valid number greater than 0");
        if (isNaN(stock_quantity) || stock_quantity < 0) throw new Error("Stock quantity must be a valid non-negative integer");

        const product = await Product.findById(req.params.id);
        if (!product) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(404).json({ message: "Product not found" });
        }

        product.Product_name = Product_name.trim();
        product.product_type = product_type;
        product.Category = Category;
        product.size = size;
        product.Material = Material.trim();
        product.price = price;
        product.stock_quantity = stock_quantity;
        product.status = status || product.status || "active";

        if (req.file) {
            if (product.image_path) {
                const oldImagePath = path.join(__dirname, "..", product.image_path);
                if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
            }

            const tempPath = req.file.path;
            const productId = product._id.toString();
            const finalPath = path.join(__dirname, "../uploads/products", productId, `image_1${path.extname(req.file.originalname)}`);

            console.log("tempPath:", tempPath);
            console.log("finalPath:", finalPath);

            if (!fs.existsSync(tempPath)) {
                throw new Error(`Temporary file not found at ${tempPath}`);
            }

            fs.mkdirSync(path.dirname(finalPath), { recursive: true });

            try {
                fs.renameSync(tempPath, finalPath);
            } catch (error) {
                throw new Error(`Failed to move file: ${error.message}`);
            }

            product.image_path = `/uploads/products/${productId}/image_1${path.extname(req.file.originalname)}`;
        }

        await product.save();

        res.status(200).json({ message: "Product updated successfully", product });
    } catch (error) {
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Failed to delete temp file:", err);
            });
        }
        console.error("Error updating product:", error);
        res.status(400).json({ message: error.message || "Failed to update product" });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message || "Failed to fetch products" });
    }
};

export const deactivateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.status = "inactive";
        await product.save();

        res.status(200).json({ message: "Product marked as inactive successfully", product });
    } catch (error) {
        res.status(500).json({ message: error.message || "Failed to deactivate product" });
    }
};

export const activateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.status = "active";
        await product.save();

        res.status(200).json({ message: "Product marked as active successfully", product });
    } catch (error) {
        res.status(500).json({ message: error.message || "Failed to active product" });
    }
};

export const getFilteredAndSortedProducts = async (req, res) => {

    try {
        const { product_type, Category, size, sort } = req.query;
        const query = { status: "active" };

        if (product_type?.trim()) query.product_type = product_type;
        if (Category?.trim()) query.Category = Category;
        if (size?.trim()) query.size = size;

        const sortOption = sort === "price-low" ? { price: 1 } : sort === "price-high" ? { price: -1 } : {};

        const products = await Product.find(query).sort(sortOption);

        res.status(200).json(products);
    } catch (error) {
        console.log("Error fetching filtered products:", error);
        res.status(500).json({ message: error.message || "Failed to fetch filtered products" });
    }
};