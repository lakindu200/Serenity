import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FaEye, FaTrash, FaFileDownload, FaSearch } from 'react-icons/fa';
import { MdPayment } from 'react-icons/md';
import './PaymentDetails.css';

const PaymentDetails = () => {
  const [payments, setPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all payments
  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:4000/api/payment/all');
      setPayments(response.data);
    } catch (err) {
      console.error('Error fetching payments:', err);
      alert('Error fetching payments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Pending' ? 'Complete' : 'Pending';
      await axios.put(`http://localhost:4000/api/payment/status/${id}`, { status: newStatus });
      fetchPayments();
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Error updating status. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this payment?')) return;
    
    try {
      await axios.delete(`http://localhost:4000/api/payment/delete/${id}`);
      fetchPayments();
    } catch (err) {
      console.error('Error deleting payment:', err);
      alert('Error deleting payment. Please try again.');
    }
  };

  const handleView = (id) => {
    navigate(`/payment/${id}`);
  };

  const generateReport = () => {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    doc.text('Payment Report', 15, 20);
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 15, 30);

    // Add table
    doc.autoTable({
      startY: 40,
      head: [['Phone', 'Email', 'Location', 'Total Cost', 'Status']],
      body: payments.map((payment) => [
        payment.phone,
        payment.email,
        payment.deliveryLocation,
        `Rs.${payment.totalCost.toFixed(2)}`,
        payment.status || 'Pending',
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.save('payment_report.pdf');
  };

  const filteredPayments = payments.filter((payment) =>
    payment.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.deliveryLocation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      
      <div className="payment-container">
        <div className="payment-header">
          <MdPayment className="payment-icon" />
          <h1>Payment Management</h1>
          <button onClick={generateReport} className="generate-report-btn">
            <FaFileDownload className="mr-2" />
            Generate Report
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
                      <div className="customer-name">{payment.phone}</div>
                      <div className="customer-email">{payment.email}</div>
                    </div>
                  </td>
                  <td>{payment.deliveryLocation}</td>
                  <td className="total-cost">Rs.{payment.totalCost.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${
                      payment.status === 'Complete' 
                        ? 'status-complete' 
                        : 'status-pending'}`}
                    >
                      {payment.status || 'Pending'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleView(payment._id)}
                        className="btn btn-view"
                      >
                        <FaEye size={20} />
                      </button>
                      <button
                        onClick={() => handleStatusChange(payment._id, payment.status || 'Pending')}
                        className={`btn btn-status`}
                      >
                        {payment.status === 'Complete' ? 'Mark Pending' : 'Complete'}
                      </button>
                      <button
                        onClick={() => handleDelete(payment._id)}
                        className="btn btn-delete"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </>
  );
};

export default PaymentDetails;