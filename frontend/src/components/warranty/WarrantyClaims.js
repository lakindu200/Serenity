import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
} from "@mui/material";
import { Delete, Visibility } from "@mui/icons-material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Correct import for jspdf-autotable

const WarrantyClaims = () => {
  const [claims, setClaims] = useState([]);
  const [filteredClaims, setFilteredClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all warranty claims
  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/warranty/admin/claims");
      setClaims(response.data);
      setFilteredClaims(response.data);
    } catch (error) {
      console.error("Error fetching claims:", error);
      toast.error("Error loading warranty claims");
    }
  };

  // Handle Delete Claim
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/warranty/admin/claims/${id}`);
      fetchClaims();
      toast.success("Claim deleted successfully");
    } catch (error) {
      console.error("Error deleting claim:", error);
      toast.error("Error deleting claim");
    }
  };

  // Handle Change Status
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:8000/api/warranty/update-status/${id}`, { status: newStatus });
      fetchClaims();
      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating claim status");
    }
  };

  // Handle View Claim Details
  const handleViewDetails = (claim) => {
    setSelectedClaim(claim);
    setOpenDialog(true);
  };

  // Close Dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle Search
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = claims.filter(
      (claim) =>
        claim.fullName.toLowerCase().includes(term) ||
        claim.email.toLowerCase().includes(term) ||
        claim.orderNumber.toLowerCase().includes(term)
    );
    setFilteredClaims(filtered);
  };

  // Generate PDF Report
  const generateReport = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Warranty Claims Report", 10, 10);

    // Add table headers
    const headers = [
      "Full Name",
      "Email",
      "Address",
      "Phone Number",
      "Brand/Model",
      "Order Number",
      "Status",
    ];

    // Map filtered claims to table data
    const data = filteredClaims.map((claim) => [
      claim.fullName,
      claim.email,
      claim.address,
      claim.phoneNumber,
      claim.brandModel,
      claim.orderNumber,
      claim.status,
    ]);

    // Add table using jspdf-autotable
    autoTable(doc, {
      head: [headers],
      body: data,
      startY: 20,
    });

    // Save the PDF
    doc.save("warranty_claims_report.pdf");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Warranty Claims</h1>

      {/* Search Bar and Generate Report Button */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          style={{ width: "300px" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={generateReport}
        >
          Generate Report
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Brand/Model</TableCell>
              <TableCell>Order Number</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClaims.map((claim) => (
              <TableRow key={claim._id}>
                <TableCell>{claim.fullName}</TableCell>
                <TableCell>{claim.email}</TableCell>
                <TableCell>{claim.address}</TableCell>
                <TableCell>{claim.phoneNumber}</TableCell>
                <TableCell>{claim.brandModel}</TableCell>
                <TableCell>{claim.orderNumber}</TableCell>
                <TableCell>
                  <Select
                    value={claim.status}
                    onChange={(e) =>
                      handleStatusChange(claim._id, e.target.value)
                    }
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="complete">Complete</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="info"
                    startIcon={<Visibility />}
                    onClick={() => handleViewDetails(claim)}
                    style={{ marginRight: "10px" }}
                  >
                    View
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => handleDelete(claim._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Viewing Claim Details */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Claim Details</DialogTitle>
        <DialogContent>
          {selectedClaim && (
            <div>
              <p><strong>Full Name:</strong> {selectedClaim.fullName}</p>
              <p><strong>Email:</strong> {selectedClaim.email}</p>
              <p><strong>Address:</strong> {selectedClaim.address}</p>
              <p><strong>Phone Number:</strong> {selectedClaim.phoneNumber}</p>
              <p><strong>Brand/Model:</strong> {selectedClaim.brandModel}</p>
              <p><strong>Size:</strong> {selectedClaim.size.join(", ")}</p>
              <p><strong>Order Number:</strong> {selectedClaim.orderNumber}</p>
              <p><strong>Purchase Date:</strong> {selectedClaim.purchaseDate}</p>
              <p><strong>Proof of Purchase:</strong> {selectedClaim.proofOfPurchase}</p>
              <p><strong>Warranty Certificate Number:</strong> {selectedClaim.warrantyCertNumber}</p>
              <p><strong>Warranty Start:</strong> {selectedClaim.warrantyStart}</p>
              <p><strong>Warranty End:</strong> {selectedClaim.warrantyEnd}</p>
              <p><strong>Warranty Type:</strong> {selectedClaim.warrantyType}</p>
              <p><strong>Problem Type:</strong> {selectedClaim.problemType}</p>
              <p><strong>Issue Start Date:</strong> {selectedClaim.issueStartDate}</p>
              <p><strong>Resolution:</strong> {selectedClaim.resolution}</p>
              <p><strong>Images:</strong></p>
              <div>
                {selectedClaim.images.map((image, index) => (
                  <img
                    key={index}
                    src={`http://localhost:5000/${image.replace(/\\/g, "/")}`} // Construct full image URL
                    alt="Proof"
                    style={{ width: "100px", height: "auto", margin: "5px" }}
                  />
                ))}
              </div>
              <p><strong>Video:</strong></p>
              {selectedClaim.video ? (
                <video
                  src={`http://localhost:5000/${selectedClaim.video.replace(/\\/g, "/")}`} // Construct full video URL
                  controls
                  style={{ maxWidth: "100%" }}
                />
              ) : (
                <p>No video uploaded</p>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default WarrantyClaims;