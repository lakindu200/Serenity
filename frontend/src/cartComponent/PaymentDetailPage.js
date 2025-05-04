import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:4000';

const PaymentDetailPage = () => {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/payment/${id}`);
        setPayment(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching payment details:', err);
        setError('Error fetching payment details: ' + err.message);
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 p-6 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-lg">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 p-6 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-lg text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 p-6 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-lg">No payment details found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 p-6">
      <div className="container mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Payment Details</h1>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Customer Information</h2>
          <div className="space-y-2">
            <p><strong>Phone:</strong> {payment.phone}</p>
            <p><strong>Email:</strong> {payment.email}</p>
            <p><strong>Address:</strong> {payment.address}</p>
            <p><strong>Delivery Location:</strong> {payment.deliveryLocation}</p>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-2">
            <p><strong>Subtotal:</strong> Rs.{payment.subtotal.toFixed(2)}</p>
            <p><strong>Delivery Fee:</strong> Rs.{payment.deliveryFee.toFixed(2)}</p>
            <p><strong>Total Cost:</strong> Rs.{payment.totalCost.toFixed(2)}</p>
            <p>
              <strong>Status:</strong>{' '}
              <span className={`px-2 py-1 text-sm rounded-full ${payment.status === 'Complete' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {payment.status || 'Pending'}
              </span>
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Products</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase">Product Name</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase">Quantity</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase">Price</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payment.products.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">{product.productName}</td>
                    <td className="py-3 px-4">{product.quantity}</td>
                    <td className="py-3 px-4">Rs.{product.price.toFixed(2)}</td>
                    <td className="py-3 px-4">Rs.{(product.quantity * product.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default PaymentDetailPage;
