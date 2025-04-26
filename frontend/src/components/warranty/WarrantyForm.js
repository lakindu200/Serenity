import React, { useState } from "react";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Container,
  Grid,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { jsPDF } from 'jspdf';
import "jspdf-autotable";
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './WarrantyForm.css';

const WarrantyClaimForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    phoneNumber: "",
    email: "",
    brandModel: "",
    size: [],
    orderNumber: "",
    purchaseDate: "",
    proofOfPurchase: "",
    warrantyCertNumber: "",
    warrantyStart: "",
    warrantyEnd: "",
    warrantyType: "",
    problemType: "",
    issueStartDate: "",
    images: [],
    video: null, 
    resolution: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, size: checked ? [...formData.size, name] : formData.size.filter(s => s !== name) });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.images.length > 3) {
      toast.error("You can upload a maximum of 3 images.");
      return;
    }
    setFormData({ ...formData, images: [...formData.images, ...files] });
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setFormData({ ...formData, video: file });
    } else {
      toast.error("Please upload a valid video file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    
    // Add basic text fields
    Object.keys(formData).forEach(key => {
      if (key === 'size') {
        formDataToSend.append('size', JSON.stringify(formData.size));
      } else if (key !== 'images' && key !== 'video' && key !== 'acknowledgeTerms' && key !== 'confirmAccuracy') {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Add images
    if (formData.images.length > 0) {
      formData.images.forEach(image => {
        formDataToSend.append('images', image);
      });
    }

    // Add video if exists
    if (formData.video) {
      formDataToSend.append('video', formData.video);
    }

    try {
      const response = await axios.post(
        'http://localhost:4000/api/warranty/submit-claim',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log('Upload Progress:', percentCompleted);
          },
        }
      );

      if (response.data.success) {
        toast.success("Warranty claim submitted successfully!");
        generatePDF(formData);
        // Reset form
        setFormData({
          fullName: "",
          address: "",
          phoneNumber: "",
          email: "",
          brandModel: "",
          size: [],
          orderNumber: "",
          purchaseDate: "",
          proofOfPurchase: "",
          warrantyCertNumber: "",
          warrantyStart: "",
          warrantyEnd: "",
          warrantyType: "",
          problemType: "",
          issueStartDate: "",
          images: [],
          video: null,
          resolution: "",
          acknowledgeTerms: false,
          confirmAccuracy: false
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.response?.data?.message || "Error submitting warranty claim. Please try again.");
    }
  };

  // Function to generate the PDF
  const generatePDF = async (formData) => {
    const doc = new jsPDF();

    // Title and general info
    doc.setFontSize(18);
    doc.text('Warranty Claim Proof', 20, 20);

    // Customer information
    doc.setFontSize(12);
    doc.text(`Full Name: ${formData.fullName}`, 20, 30);
    doc.text(`Address: ${formData.address}`, 20, 40);
    doc.text(`Phone Number: ${formData.phoneNumber}`, 20, 50);
    doc.text(`Email: ${formData.email}`, 20, 60);

    // Mattress details
    doc.text(`Brand & Model: ${formData.brandModel}`, 20, 70);
    doc.text(`Size: ${formData.size.join(', ')}`, 20, 80);
    doc.text(`Order Number: ${formData.orderNumber}`, 20, 90);
    doc.text(`Purchase Date: ${formData.purchaseDate}`, 20, 100);
    doc.text(`Proof of Purchase: ${formData.proofOfPurchase}`, 20, 110);

    // Warranty details
    doc.text(`Warranty Cert Number: ${formData.warrantyCertNumber}`, 20, 120);
    doc.text(`Warranty Start: ${formData.warrantyStart}`, 20, 130);
    doc.text(`Warranty End: ${formData.warrantyEnd}`, 20, 140);
    doc.text(`Warranty Type: ${formData.warrantyType}`, 20, 150);

    // Issue description
    doc.text(`Problem Type: ${formData.problemType}`, 20, 160);
    doc.text(`Issue Start Date: ${formData.issueStartDate}`, 20, 170);

    // Requested resolution
    doc.text(`Requested Resolution: ${formData.resolution}`, 20, 180);

    // Images to the PDF
    if (formData.images.length > 0) {
      doc.addPage();
      doc.setFontSize(14);
      doc.text('Uploaded Images:', 20, 20);

      let yOffset = 30;
      for (let i = 0; i < formData.images.length; i++) {
        const image = formData.images[i];
        const imgURL = URL.createObjectURL(image);

        const img = new Image();
        img.src = imgURL;
        await new Promise((resolve) => {
          img.onload = () => {
            const width = 100; 
            const height = (img.height * width) / img.width; 
            doc.addImage(img, 'JPEG', 20, yOffset, width, height);
            yOffset += height + 10; 
            resolve();
          };
        });
      }
    }

    // video details to the PDF
    if (formData.video) {
      doc.addPage();
      doc.setFontSize(14);
      doc.text('Uploaded Video:', 20, 20);
      doc.text(`Video File Name: ${formData.video.name}`, 20, 30);
      doc.text('Note: The video file is attached separately.', 20, 40);
    }

    // PDF file and trigger the download
    doc.save('Warranty_Claim_Proof.pdf');
  };

  const handleViewTerms = () => {
    navigate('/terms-and-conditions');
  };

  return (
    <>
      <Header />
      <div className="warranty-page">
        <Container maxWidth="md" className="warranty-container">
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
          >
            <Paper elevation={3} className="warranty-form-paper">
              <Typography variant="h4" gutterBottom className="warranty-title">
                Mattress Warranty Claim Form
              </Typography>
              
              <form onSubmit={handleSubmit} className="warranty-form">
                {/* Customer Information Section */}
                <div className="form-section">
                  <div className="form-section-title">Customer Information</div>
                  <Grid container spacing={2}>
                    {['fullName', 'address', 'phoneNumber', 'email'].map(field => (
                      <Grid item xs={12} sm={6} key={field} className="form-row">
                        <TextField label={field.replace(/([A-Z])/g, ' $1')} name={field} fullWidth value={formData[field]} onChange={handleChange} required />
                      </Grid>
                    ))}
                  </Grid>
                </div>

                <div className="section-divider" />

                {/* Mattress Details Section */}
                <div className="form-section">
                  <div className="form-section-title">Mattress Details</div>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Brand & Model Name" name="brandModel" fullWidth value={formData.brandModel} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography>Size:</Typography>
                      {['Twin', 'Full', 'Queen', 'King'].map(size => (
                        <FormControlLabel key={size} control={<Checkbox name={size} checked={formData.size.includes(size)} onChange={handleCheckboxChange} />} label={size} />
                      ))}
                    </Grid>
                    {['orderNumber', 'purchaseDate', 'proofOfPurchase'].map(field => (
                      <Grid item xs={12} sm={6} key={field}>
                        <TextField type={field.includes('Date') ? 'date' : 'text'} label={field.replace(/([A-Z])/g, ' $1')} name={field} fullWidth value={formData[field]} onChange={handleChange} required InputLabelProps={{ shrink: true }} />
                      </Grid>
                    ))}
                  </Grid>
                </div>

                <div className="section-divider" />

                {/* Warranty Details Section */}
                <div className="form-section">
                  <div className="form-section-title">Warranty Details</div>
                  <Grid container spacing={2}>
                    {['warrantyCertNumber', 'warrantyStart', 'warrantyEnd'].map(field => (
                      <Grid item xs={12} sm={6} key={field}>
                        <TextField
                          type={field.includes('Start') || field.includes('End') ? 'date' : 'text'}
                          label={field.replace(/([A-Z])/g, ' $1')}
                          name={field}
                          fullWidth
                          value={formData[field]}
                          onChange={handleChange}
                          required
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    ))}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        name="warrantyType"
                        fullWidth
                        value={formData.warrantyType}
                        onChange={handleChange}
                        required
                        SelectProps={{ native: true }}
                      >
                        <option value="">Select Warranty Type</option>
                        <option value="Manufacturer">Manufacturer</option>
                        <option value="Extended">Extended</option>
                        <option value="Other">Other</option>
                      </TextField>
                    </Grid>
                  </Grid>
                </div>

                <div className="section-divider" />

                {/* Issue Description Section */}
                <div className="form-section">
                  <div className="form-section-title">Issue Description</div>
                  <Grid container spacing={2}>
                    {['problemType', 'issueStartDate'].map(field => (
                      <Grid item xs={12} sm={6} key={field}>
                        <TextField type={field.includes('Date') ? 'date' : 'text'} label={field.replace(/([A-Z])/g, ' $1')} name={field} fullWidth value={formData[field]} onChange={handleChange} required InputLabelProps={{ shrink: true }} />
                      </Grid>
                    ))}
                  </Grid>
                </div>

                {/* File Upload Section */}
                <div className="form-section">
                  <div className="form-section-title">Supporting Documentation</div>
                  <Grid container spacing={2}>
                    <Grid item>
                      <Button variant="contained" component="label" style={{ backgroundColor: "black", color: "white" }}>
                        Upload Images
                        <input type="file" multiple accept="image/*" hidden onChange={handleImageUpload} />
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button variant="contained" component="label" style={{ backgroundColor: "black", color: "white" }}>
                        Upload Video
                        <input type="file" accept="video/*" hidden onChange={handleVideoUpload} />
                      </Button>
                    </Grid>
                  </Grid>
                  {/* Upload Limits Message */}
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    You can upload up to 3 images and 1 video as proof.
                  </Typography>
                </div>

                {/* Terms and Acknowledgment */}
                <div className="terms-section">
                  <Button
                    variant="outlined"
                    onClick={handleViewTerms}
                    fullWidth
                    className="terms-button"
                  >
                    View Terms and Conditions
                  </Button>
                </div>

                <div className="acknowledgment-section">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.acknowledgeTerms}
                        onChange={(e) => setFormData({ ...formData, acknowledgeTerms: e.target.checked })}
                        required
                      />
                    }
                    label="I acknowledge that my claim is subject to the manufacturer's warranty terms and conditions."
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.confirmAccuracy}
                        onChange={(e) => setFormData({ ...formData, confirmAccuracy: e.target.checked })}
                        required 
                      />
                    }
                    label="I confirm that the information provided is accurate and truthful."
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  className="submit-button"
                  disabled={!formData.acknowledgeTerms || !formData.confirmAccuracy}
                >
                  Submit Warranty Claim
                </Button>
              </form>
            </Paper>
          </motion.div>
          <ToastContainer position="top-right" autoClose={3000} />
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default WarrantyClaimForm;