import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FaEye, FaTrash, FaFileDownload, FaSearch } from 'react-icons/fa';
import { MdPayment } from 'react-icons/md';
import { toast, ToastContainer } from 'react-toastify';
import './PaymentDetails.css';

const API_BASE_URL = 'http://localhost:4000';

const PaymentDetails = () => {
    const [payments, setPayments] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/api/payment/all`);
            setPayments(response.data);
        } catch (err) {
            console.error('Error fetching payments:', err);
            toast.error('Error fetching payments');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'Pending' ? 'Complete' : 'Pending';
            await axios.put(`${API_BASE_URL}/api/payment/status/${id}`, { status: newStatus });
            fetchPayments();
            toast.success('Status updated successfully');
        } catch (err) {
            console.error('Error updating status:', err);
            toast.error('Error updating status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this payment?')) return;
        
        try {
            await axios.delete(`${API_BASE_URL}/api/payment/delete/${id}`);
            fetchPayments();
            toast.success('Payment deleted successfully');
        } catch (err) {
            console.error('Error deleting payment:', err);
            toast.error('Error deleting payment');
        }
    };

    const handleView = (id) => {
        navigate(`/payment/${id}`);
    };

    const generateReport = () => {
        try {
            const doc = new jsPDF();
            
            // Header
            doc.setFontSize(20);
            doc.setTextColor(45, 22, 140);
            doc.text('Serenity - Payment Management Report', doc.internal.pageSize.width/2, 20, { align: 'center' });
            
            // Date
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, doc.internal.pageSize.width/2, 30, { align: 'center' });

            // Summary calculations
            const totalPayments = payments.length;
            const totalRevenue = payments.reduce((sum, payment) => sum + payment.totalCost, 0);
            const completedPayments = payments.filter(p => p.status === 'Complete').length;
            const pendingPayments = totalPayments - completedPayments;

            // Table
            autoTable(doc, {
                startY: 40,
                head: [['Date', 'Customer', 'Location', 'Total Cost', 'Status']],
                body: payments.map((payment) => [
                    new Date(payment.createdAt).toLocaleDateString(),
                    `${payment.phone}\n${payment.email}`,
                    payment.deliveryLocation,
                    `Rs. ${payment.totalCost.toFixed(2)}`,
                    payment.status || 'Pending'
                ]),
                styles: { fontSize: 9 },
                headStyles: { 
                    fillColor: [45, 22, 140],
                    textColor: [255, 255, 255]
                }
            });

            // Summary
            const finalY = doc.lastAutoTable.finalY + 10;
            doc.setFontSize(14);
            doc.setTextColor(45, 22, 140);
            doc.text('Summary', 14, finalY);
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text([
                `Total Payments: ${totalPayments}`,
                `Completed Payments: ${completedPayments}`,
                `Pending Payments: ${pendingPayments}`,
                `Total Revenue: Rs. ${totalRevenue.toFixed(2)}`
            ], 14, finalY + 10);

            doc.save(`serenity_payment_report_${new Date().toISOString().slice(0,10)}.pdf`);
            toast.success('Report generated successfully');
        } catch (error) {
            console.error('Error generating report:', error);
            toast.error('Failed to generate report');
        }
    };

    const filteredPayments = payments.filter((payment) =>
        payment.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.deliveryLocation.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="payment-container">
            <div className="payment-header">
                <div className="payment-icon" />
                <h1>Payment Management</h1>
                <button onClick={generateReport} className="generate-report-btn">
                    <FaFileDownload /> Generate Report
                </button>
            </div>

            <div className="search-section">
                <div className="search-input-wrapper">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by phone, email, or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            <div className="table-container">
                <table className="payments-table">
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Location</th>
                            <th>Total Cost</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="text-center">Loading...</td>
                            </tr>
                        ) : filteredPayments.map((payment) => (
                            <tr key={payment._id}>
                                <td>
                                    <div className="customer-info">
                                        <div className="customer-phone">{payment.phone}</div>
                                        <div className="customer-email">{payment.email}</div>
                                    </div>
                                </td>
                                <td>{payment.deliveryLocation}</td>
                                <td>Rs. {payment.totalCost.toFixed(2)}</td>
                                <td>
                                    <span className={`status-badge ${
                                        payment.status === 'Complete' ? 'status-complete' : 'status-pending'
                                    }`}>
                                        {payment.status || 'Pending'}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button onClick={() => handleView(payment._id)} className="btn btn-view">
                                            <FaEye />
                                        </button>
                                        <button 
                                            onClick={() => handleStatusChange(payment._id, payment.status)}
                                            className="btn btn-status"
                                        >
                                            {payment.status === 'Complete' ? 'Mark Pending' : 'Complete'}
                                        </button>
                                        <button onClick={() => handleDelete(payment._id)} className="btn btn-delete">
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ToastContainer />
        </div>
    );
};

export default PaymentDetails;