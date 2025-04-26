import React, { useState } from "react";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Container,
  Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { jsPDF } from 'jspdf';
import "jspdf-autotable";
import { useNavigate } from 'react-router-dom';

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
    
    // Append all text fields
    Object.keys(formData).forEach(key => {
      if (key === 'size') {
        formDataToSend.append('size', JSON.stringify(formData.size));
      } else if (key !== 'images' && key !== 'video') {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Append images
    formData.images.forEach(image => {
      formDataToSend.append('images', image);
    });

    // Append video if exists
    if (formData.video) {
      formDataToSend.append('video', formData.video);
    }

    try {
      const response = await axios.post('http://localhost:8000/api/warranty/submit-claim', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success("Warranty claim submitted successfully!");
        generatePDF(formData);
        
        // Reset form after 3 seconds
        setTimeout(() => {
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
        }, 3000);
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.response?.data?.message || "Error submitting warranty claim.");
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
    <Container maxWidth="md">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h4" gutterBottom>
          <b>Mattress Warranty Claim Form</b>
        </Typography>
        <br />
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Customer Information */}
            <Grid item xs={12}><Typography variant="h6">Customer Information</Typography></Grid>
            {['fullName', 'address', 'phoneNumber', 'email'].map(field => (
              <Grid item xs={12} sm={6} key={field}>
                <TextField label={field.replace(/([A-Z])/g, ' $1')} name={field} fullWidth value={formData[field]} onChange={handleChange} required />
              </Grid>
            ))}

            {/* Mattress Details */}
            <Grid item xs={12}><Typography variant="h6">Mattress Details</Typography></Grid>
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

            {/* Warranty Details */}
            <Grid item xs={12}><Typography variant="h6">Warranty Details</Typography></Grid>
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

            {/* Issue Description */}
            <Grid item xs={12}><Typography variant="h6">Issue Description</Typography></Grid>
            {['problemType', 'issueStartDate'].map(field => (
              <Grid item xs={12} sm={6} key={field}>
                <TextField type={field.includes('Date') ? 'date' : 'text'} label={field.replace(/([A-Z])/g, ' $1')} name={field} fullWidth value={formData[field]} onChange={handleChange} required InputLabelProps={{ shrink: true }} />
              </Grid>
            ))}

            {/* Image and Video Upload Buttons */}
            <Grid item xs={12}>
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
            </Grid>

            {/* Requested Resolution */}
            <Grid item xs={12}><Typography variant="h6">Requested Resolution</Typography></Grid>
            {['Repair', 'Replacement', 'Refund'].map(res => (
              <Grid item key={res}>
                <FormControlLabel control={<Checkbox name="resolution" checked={formData.resolution === res} onChange={() => setFormData({ ...formData, resolution: res })} />} label={res} />
              </Grid>
            ))}

            {/* Acknowledgment Checkboxes */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.acknowledgeTerms}
                  onChange={(e) => setFormData({ ...formData, acknowledgeTerms: e.target.checked })}
                  required
                />
              }
              label="I acknowledge that my claim is subject to the manufacturer’s warranty terms and conditions."
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
          </Grid>

          <Grid item xs={12} sx={{ mt: 2, mb: 2 }}>
            <Button
              variant="outlined"
              onClick={handleViewTerms}
              fullWidth
              style={{ 
                borderColor: "#2D168C",
                color: "#2D168C",
                marginBottom: "20px"
              }}
            >
              View Terms and Conditions
            </Button>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              style={{ backgroundColor: "black", color: "white" }}
              disabled={!formData.acknowledgeTerms || !formData.confirmAccuracy}
            >
              Submit
            </Button>
          </Grid>
          </Grid>
        </form>
      </motion.div>
      <ToastContainer position="top-right" autoClose={3000} />
    </Container>
  );
};

export default WarrantyClaimForm;