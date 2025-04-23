import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';





import ProductView from './cartComponent/ProductView';
import CartView from './cartComponent/CartView';
import PaymentDetails from './cartComponent/PaymentDetails';
import PaymentDetailPage from './cartComponent/PaymentDetailPage';





function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Router>
        <Routes>
          <Route path='/paymentdetails' element={<PaymentDetails />} />
          <Route path="/payment/:id" element={<PaymentDetailPage />} />
          <Route path="/" element={<ProductView />} />
          <Route path="/cartview" element={<CartView />} />
        </Routes>
      </Router>
    </div>
  );
}
export default App;
