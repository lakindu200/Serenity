import express from 'express';
import Client from '../models/client_module.js';

const router = express.Router();

// Get all clients
router.get('/', async (req, res) => {
    try {
        const clients = await Client.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            clients: clients
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch clients",
            error: err.message
        });
    }
});

// Add new client
router.post('/add', async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !address) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check for existing client with same email
        const existingClient = await Client.findOne({ email });
        if (existingClient) {
            return res.status(400).json({
                success: false,
                message: "Client with this email already exists"
            });
        }

        // Create new client
        const newClient = new Client({
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            address: address.trim()
        });

        await newClient.save();

        res.status(201).json({
            success: true,
            message: "Client added successfully",
            client: newClient
        });
    } catch (err) {
        console.error('Error adding client:', err);
        res.status(500).json({
            success: false,
            message: "Failed to add client",
            error: err.message
        });
    }
});

// Delete client
router.delete('/delete/:id', async (req, res) => {
    try {
        console.log('Delete request received for client:', req.params.id);
        
        if (!req.params.id) {
            return res.status(400).json({
                success: false,
                message: "Client ID is required"
            });
        }

        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Client not found"
            });
        }

        const deletedClient = await Client.findByIdAndDelete(req.params.id);
        console.log('Client deleted:', deletedClient);

        res.status(200).json({
            success: true,
            message: "Client deleted successfully",
            client: deletedClient
        });
    } catch (err) {
        console.error('Error deleting client:', err);
        res.status(500).json({
            success: false,
            message: err.message || "Failed to delete client"
        });
    }
});

export default router;