import React from 'react';
import { Typography, Container } from '@mui/material';
import { motion } from 'framer-motion';

// Animation variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

function TermsAndConditions() {
  return (
    <Container>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Typography variant="h4" gutterBottom>
            Terms and Conditions
          </Typography>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Typography variant="body1" paragraph>
            Welcome to the Warranty Claim System. By accessing or using our system, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
          </Typography>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Typography variant="h6" gutterBottom>
            1. Eligibility
          </Typography>
          <Typography variant="body1" paragraph>
            To use the Warranty Claim System, you must be at least 18 years old and have a valid warranty for the product you are claiming. You must provide accurate and complete information during the claim process.
          </Typography>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Typography variant="h6" gutterBottom>
            2. Claim Process
          </Typography>
          <Typography variant="body1" paragraph>
            You are required to submit all necessary documentation, including proof of purchase, warranty details, and a description of the issue. Incomplete or inaccurate claims may be rejected.
          </Typography>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Typography variant="h6" gutterBottom>
            3. Limitations
          </Typography>
          <Typography variant="body1" paragraph>
            The warranty does not cover damages caused by misuse, accidents, or unauthorized repairs. Claims for such damages will not be accepted.
          </Typography>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Typography variant="h6" gutterBottom>
            4. Resolution
          </Typography>
          <Typography variant="body1" paragraph>
            We will review your claim and provide a resolution within 30 business days. Approved claims may result in repair, replacement, or refund, depending on the terms of your warranty.
          </Typography>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Typography variant="h6" gutterBottom>
            5. Privacy
          </Typography>
          <Typography variant="body1" paragraph>
            Your personal information will be used solely for processing your warranty claim. We will not share your data with third parties without your consent, except as required by law.
          </Typography>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Typography variant="h6" gutterBottom>
            6. Changes to Terms
          </Typography>
          <Typography variant="body1" paragraph>
            We reserve the right to modify these terms and conditions at any time. Continued use of the system after changes constitutes your acceptance of the new terms.
          </Typography>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Typography variant="h6" gutterBottom>
            7. Contact Us
          </Typography>
          <Typography variant="body1" paragraph>
            If you have any questions about these terms, please contact us at support@warrantyclaims.com.
          </Typography>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Typography variant="body1" paragraph>
            By using the Warranty Claim System, you acknowledge that you have read, understood, and agree to these terms and conditions.
          </Typography>
        </motion.div>
      </motion.div>
    </Container>
  );
}

export default TermsAndConditions;