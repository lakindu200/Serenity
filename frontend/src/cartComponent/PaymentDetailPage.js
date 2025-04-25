import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PaymentDetailPage = () => {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8020/checkout/${id}`);
        setPayment(response.data);
      } catch (err) {
        setError('Error fetching payment details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [id]);

  const togglePreview = () => setPreviewOpen(!previewOpen);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
        <p className="text-white text-lg">{error}</p>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
        <p className="text-white text-lg">No payment details found.</p>
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

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Receipt</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePreview}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                {previewOpen ? 'Hide Preview' : 'Show Preview'}
              </button>
              <a
                href={`http://localhost:8020/uploads/${payment.receiptPath}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 underline"
              >
                Download Receipt
              </a>
            </div>

            {previewOpen && (
              <div className="mt-4 border rounded-lg p-4">
                <img
                  src={`http://localhost:8020/uploads/${payment.receiptPath}`}
                  alt="Receipt"
                  className="max-w-full h-auto rounded-lg shadow-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x600?text=Receipt+Not+Found';
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {previewOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={togglePreview}
        >
          <div 
            className="bg-white p-4 rounded-lg max-w-4xl max-h-[90vh] overflow-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-end mb-2">
              <button 
                onClick={togglePreview}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            <img
              src={`http://localhost:8020/uploads/${payment.receiptPath}`}
              alt="Receipt Full Preview"
              className="w-full h-auto"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/800x1200?text=Receipt+Not+Found';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentDetailPage;
