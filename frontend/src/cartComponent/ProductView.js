import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductView = () => {
  const products = [
    {
      id: '1',
      name: 'Mattress',
      price: 25000.0,
      image: 'https://th.bing.com/th/id/R.002457785a6fc87010ccd2797716e855?rik=4LGq%2f8tPHN2k5A&pid=ImgRaw&r=0',
    },
    {
      id: '2',
      name: 'Pillow',
      price: 2500.0,
      image: 'https://th.bing.com/th/id/R.9e753a5c21253c338ec84fef38a6d0c0?rik=ak1FcR%2bKGbLubw&riu=http%3a%2f%2fimperialroyal.ae%2fupload%2fgallery%2fphotos%2f144.jpg&ehk=0BU17sazBfBzeA5qKPGyH5KdSQDl8qljeGuW6JfGNN0%3d&risl=&pid=ImgRaw&r=0',
    },
  ];

  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState(
    products.reduce((acc, product) => {
      acc[product.id] = 1;
      return acc;
    }, {})
  );

  const handleQuantityChange = (productId, value) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: value,
    }));
  };

  const addToCart = async (productId, name, price) => {
    const quantity = quantities[productId];
    try {
      const response = await axios.post('http://localhost:8020/cart/add', {
        productName: name,
        price,
        quantity,
      });
      setCart(response.data.items);
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('There was an error adding the product to the cart.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-8">
      <h1 className="text-4xl font-bold text-center mb-12 text-white drop-shadow-lg">Our Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <img src={product.image} alt={product.name} className="w-full h-56 object-cover" />
            <div className="p-6">
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">{product.name}</h3>
              <p className="text-xl text-indigo-600 font-medium mb-4">RS.{product.price.toFixed(2)}</p>

              <div className="flex items-center mb-6">
                <label htmlFor={`quantity-${product.id}`} className="mr-3 text-gray-700">
                  Quantity:
                </label>
                <input
                  type="number"
                  id={`quantity-${product.id}`}
                  min="1"
                  value={quantities[product.id]}
                  onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                  className="w-20 px-3 py-2 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <button
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-300 font-medium text-lg"
                onClick={() => addToCart(product.id, product.name, product.price)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-12">
        <Link
          to="/cart"
          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors duration-300 font-medium text-lg shadow-lg hover:shadow-xl"
        >
          Go to Cart
        </Link>
      </div>
    </div>
  );
};

export default ProductView;
