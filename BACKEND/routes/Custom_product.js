import express from 'express';
import Product from '../models/custom_product.js';

const router = express.Router();

router.route('/create').post((req, res) => {
    const length = Number(req.body.length);
    const width = Number(req.body.width);
    const color = req.body.color;
    const material = req.body.material;

    const newProduct = new Product({
        length,
        width,
        color,
        material,
    });

    newProduct.save()
        .then(() => res.json('Product added!'))
        .catch((err) => {
            console.error(err);
            res.status(400).send({ status: "Product not added", error: err.message });
        });
});

router.route('/').get((req, res) => {
    Product.find()
        .then((products) => res.json(products))
        .catch((err) => {
            console.error(err);
            res.status(400).send({ status: "Products not fetched", error: err.message });
        });
});

router.route('/update/:id').put(async (req, res) => {
    let Id = req.params.id;
    const { length, width, color, material } = req.body;

    const updateProduct = {
        length,
        width,
        color,
        material,
    };

    try {
        await Product.findByIdAndUpdate(Id, updateProduct);
        res.status(200).send({ status: "Product updated" });
    } catch (err) {
        console.error(err);
        res.status(400).send({ status: "Product not updated", error: err.message });
    }
});

router.route('/delete/:id').delete(async (req, res) => {
    let Id = req.params.id;
    try {
        await Product.findByIdAndDelete(Id);
        res.status(200).send({ status: "Product deleted" });
    } catch (err) {
        console.error(err.message);
        res.status(400).send({ status: "Product not deleted", error: err.message });
    }
});

router.route('/get/:id').get(async (req, res) => {
    let Id = req.params.id;
    try {
        const product = await Product.findById(Id);
        res.status(200).send({ status: "Product fetched", product: product });
    } catch (err) {
        console.error(err.message);
        res.status(400).send({ status: "Product not fetched", error: err.message });
    }
});

export default router;