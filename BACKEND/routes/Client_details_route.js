import express from 'express';
import Client from '../models/client_module.js';

const router = express.Router();

// Get all clients
router.route('/').get(async (req, res) => {
    try {
        const clients = await Client.find();
        res.status(200).json({
            status: "Success",
            clients: clients
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(400).json({
            status: "Error",
            message: "Failed to fetch clients",
            error: err.message
        });
    }
});

// Add new client
router.route('/add').post(async (req, res) => {
    try {
        const { _id, name, email, phone, address } = req.body;

        // Validate required fields
        if (!_id || !name || !email || !phone || !address) {
            return res.status(400).json({
                status: "Error",
                message: "All fields are required"
            });
        }

        const newClient = new Client({
            _id,
            name,
            email,
            phone: Number(phone),
            address
        });

        await newClient.save();
        res.status(201).json({
            status: "Success",
            message: "Client added successfully",
            client: newClient
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(400).json({
            status: "Error",
            message: "Failed to add client",
            error: err.message
        });
    }
});

// Delete client
router.route('/delete/:id').delete(async (req, res) => {
    try {
        const client = await Client.findByIdAndDelete(req.params.id);
        if (!client) {
            return res.status(404).json({
                status: "Error",
                message: "Client not found"
            });
        }
        res.status(200).json({
            status: "Success",
            message: "Client deleted successfully"
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(400).json({
            status: "Error",
            message: "Failed to delete client",
            error: err.message
        });
    }
});

// Get client by ID
router.route('/get/:id').get(async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({
                status: "Error",
                message: "Client not found"
            });
        }
        res.status(200).json({
            status: "Success",
            client: client
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(400).json({
            status: "Error",
            message: "Failed to fetch client",
            error: err.message
        });
    }
});

export default router;