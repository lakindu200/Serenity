import express from 'express';
import Product from '../models/custom_product.js';
import Client from '../models/client_module.js';

const router = express.Router();

// Get all orders with populated client details
router.get('/', async (req, res) => {
    try {
        console.log('Fetching all custom orders...');
        
        const products = await Product.find()
            .populate('clientId')
            .sort({ createdAt: -1 });

        console.log(`Found ${products.length} orders`);

        // Transform the data for frontend consumption
        const formattedProducts = products.map(product => ({
            _id: product._id,
            orderNumber: product._id.toString().slice(-6).toUpperCase(),
            productDetails: {
                length: product.length,
                width: product.width,
                color: product.color,
                material: product.material,
                pillow: {
                    type: product.pillow_type,
                    size: product.pillow_size,
                    color: product.pillow_color,
                    quantity: product.pillow_quantity
                }
            },
            client: {
                name: product.clientId?.name || 'N/A',
                email: product.clientId?.email || 'N/A',
                phone: product.clientId?.phone || 'N/A',
                address: product.clientId?.address || 'N/A'
            },
            payment: {
                subtotal: product.subtotal,
                paymentAmount: product.paymentAmount,
                balance: product.balance
            },
            status: product.status,
            orderDate: product.orderDate,
            createdAt: product.createdAt
        }));

        res.status(200).json({
            success: true,
            count: formattedProducts.length,
            products: formattedProducts
        });

    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: err.message
        });
    }
});

// Add new custom order
router.post('/add', async (req, res) => {
    try {
        const {
            length, width, color, material,
            pillow_type, pillow_size, pillow_color, pillow_quantity,
            clientName, clientEmail, clientPhone, clientAddress,
            subtotal, paymentAmount, balance
        } = req.body;

        // First create/update client
        try {
            let client = await Client.findOne({ email: clientEmail });
            
            if (!client) {
                client = new Client({
                    name: clientName,
                    email: clientEmail,
                    phone: clientPhone,
                    address: clientAddress
                });
                await client.save();
            }

            // Create custom product with client reference
            const newOrder = new Product({
                length: Math.abs(Number(length)),
                width: Math.abs(Number(width)),
                color: color.trim(),
                material,
                pillow_type,
                pillow_size,
                pillow_color: pillow_color.trim(),
                pillow_quantity: Math.abs(Number(pillow_quantity)),
                clientId: client._id,
                subtotal: Math.abs(Number(subtotal)),
                paymentAmount: Math.abs(Number(paymentAmount)),
                balance: Number(balance),
                status: 'pending'
            });

            const savedOrder = await newOrder.save();

            res.status(201).json({
                success: true,
                message: "Order created successfully",
                order: savedOrder,
                client: {
                    id: client._id,
                    name: client.name,
                    email: client.email
                }
            });

        } catch (error) {
            console.error('Error handling client:', error);
            throw new Error('Failed to process client information');
        }

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: "Failed to create order",
            error: error.message
        });
    }
});

// Get single order by ID with populated client details
router.get('/get/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate({
                path: 'clientId',
                select: 'name email phone address'
            })
            .lean();
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Format the product data
        const formattedProduct = {
            _id: product._id,
            orderNumber: product._id.toString().slice(-6).toUpperCase(),
            productDetails: {
                length: product.length,
                width: product.width,
                color: product.color,
                material: product.material,
                pillow: {
                    type: product.pillow_type,
                    size: product.pillow_size,
                    color: product.pillow_color,
                    quantity: product.pillow_quantity
                }
            },
            client: {
                name: product.clientId?.name || 'N/A',
                email: product.clientId?.email || 'N/A',
                phone: product.clientId?.phone || 'N/A',
                address: product.clientId?.address || 'N/A'
            },
            payment: {
                subtotal: product.subtotal,
                paymentAmount: product.paymentAmount,
                balance: product.balance
            },
            status: product.status,
            orderDate: product.orderDate,
            createdAt: product.createdAt
        };

        res.status(200).json({
            success: true,
            product: formattedProduct
        });
    } catch (err) {
        console.error('Error fetching order:', err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch order",
            error: err.message
        });
    }
});

// Add delete endpoint
router.delete('/delete/:id', async (req, res) => {
    try {
        const order = await Product.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Order deleted successfully'
        });
    } catch (err) {
        console.error('Error deleting order:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to delete order',
            error: err.message
        });
    }
});

// Add update endpoint
router.put('/update/:id', async (req, res) => {
    try {
        const {
            length, width, color, material,
            pillow_type, pillow_size, pillow_color, pillow_quantity,
            status
        } = req.body;

        const updatedOrder = await Product.findByIdAndUpdate(
            req.params.id,
            {
                length: Math.abs(Number(length)),
                width: Math.abs(Number(width)),
                color: color.trim(),
                material,
                pillow_type,
                pillow_size,
                pillow_color: pillow_color.trim(),
                pillow_quantity: Math.abs(Number(pillow_quantity)),
                status
            },
            { new: true, runValidators: true }
        ).populate('clientId');

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order updated successfully',
            order: updatedOrder
        });
    } catch (err) {
        console.error('Error updating order:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to update order',
            error: err.message
        });
    }
});

export default router;