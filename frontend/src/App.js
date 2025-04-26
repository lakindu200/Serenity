import logo from './logo.svg';
import './App.css';

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import WarrantyForm from './components/warranty/WarrantyForm';
import TermsAndConditions from './components/warranty/TermsAndConditions';
import WarrantyClaims from './components/warranty/WarrantyClaims';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Header */}
       
        
        <div>
        {Array.from({ length: 5 }).map((_, index) => (
          <br key={index} />
        ))}
      </div>
      
        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Container>
            <Routes>
              <Route path="/" element={<WarrantyForm />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/warrantyclaims" element={<WarrantyClaims />} />
            </Routes>
          </Container>
        </Box>
        <div>

        {Array.from({ length: 5 }).map((_, index) => (
          <br key={index} />
        ))}
      </div>
      
        
        
      </div>
    </Router>
  );
}

export default App;
