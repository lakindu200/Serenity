import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const PaymentDetails = () => {
  const [payments, setPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Fetch all payments
  const fetchPayments = async () => {
    try {
      const response = await axios.get('http://localhost:8020/checkout/all');
      setPayments(response.data);
    } catch (err) {
      console.error('Error fetching payments:', err);
      alert('Error fetching payments. Please try again.');
    }
  };

  // Fetch payments on component mount
  useEffect(() => {
    fetchPayments();
  }, []);

  // Handle status change
  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Pending' ? 'Complete' : 'Pending';
    try {
      await axios.put(`http://localhost:8020/checkout/status/${id}`, { status: newStatus });
      fetchPayments(); // Refresh the payment list
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Error updating status. Please try again.');
    }
  };

  // Handle payment deletion
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8020/checkout/delete/${id}`);
      fetchPayments(); // Refresh the payment list
    } catch (err) {
      console.error('Error deleting payment:', err);
      alert('Error deleting payment. Please try again.');
    }
  };

  // Handle view details
  const handleView = (id) => {
    navigate(`/payment/${id}`); // Navigate to the payment details page
  };

  // Handle search
  const filteredPayments = payments.filter((payment) =>
    payment.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.deliveryLocation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Generate PDF report
  const generateReport = () => {
    try {
      if (!payments || payments.length === 0) {
        alert('No payment data available to generate report');
        return;
      }

      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text('Payment Report', 14, 22);
      doc.setFontSize(11);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

      // Add table
      doc.autoTable({
        startY: 40,
        head: [['Phone', 'Email', 'Location', 'Total Cost', 'Status']],
        body: payments.map(payment => [
          payment.phone,
          payment.email,
          payment.deliveryLocation,
          `Rs.${payment.totalCost.toFixed(2)}`,
          payment.status || 'Pending'
        ]),
        styles: { fontSize: 9 },
        headStyles: { 
          fillColor: [41, 128, 185],
          textColor: 255,
          fontSize: 10,
          fontStyle: 'bold'
        },
        alternateRowStyles: { fillColor: [245, 245, 245] }
      });

      // Save the PDF
      doc.save('payment_report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF report. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-12 text-white drop-shadow-lg">Payment Details</h1>

      {/* Search Bar and Report Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="w-full sm:w-1/2">
          <input
            type="text"
            placeholder="Search by phone, email, or location"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-3 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm shadow-lg"
          />
        </div>
        <button
          onClick={generateReport}
          className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
        >
          Generate Report
        </button>
      </div>

      {/* Payment Table */}
      <div className="overflow-x-auto bg-white/80 backdrop-blur-sm rounded-xl shadow-xl">
        <table className="min-w-full">
          <thead>
            <tr className="border-b-2 border-blue-100">
              <th className="px-6 py-4 text-left text-sm font-medium text-blue-800 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-blue-800 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-blue-800 uppercase tracking-wider">
                Delivery Location
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-blue-800 uppercase tracking-wider">
                Total Cost
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-blue-800 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-blue-800 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-100">
            {filteredPayments.map((payment) => (
              <tr key={payment._id} className="hover:bg-blue-50/50 transition-colors">
                <td className="px-6 py-4 text-gray-700">{payment.phone}</td>
                <td className="px-6 py-4 text-gray-700">{payment.email}</td>
                <td className="px-6 py-4 text-gray-700">{payment.deliveryLocation}</td>
                <td className="px-6 py-4 text-blue-600 font-medium">Rs.{payment.totalCost.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      payment.status === 'Complete'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {payment.status || 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 space-x-3">
                  <button
                    onClick={() => handleView(payment._id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleStatusChange(payment._id, payment.status || 'Pending')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Change Status
                  </button>
                  <button
                    onClick={() => handleDelete(payment._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentDetails;