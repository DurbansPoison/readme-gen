// PDFGenerator.js
import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';

const PDFGenerator = () => {
  const [formData, setFormData] = useState({
    ProjectTitle: '',
    Developer: '',
    WithTheHelpOf: '',
    Description: '',
    PrintSettings: '',
    BOM: '',
    BuildGuide: '',
    AdditionalThanks: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    // Generate PDF and text files using pdf-lib and html2canvas
    // Compress and create a downloadable file
  };

  return (
    <div>
      <TextField
        name="ProjectTitle"
        label="Project Title"
        value={formData.ProjectTitle}
        onChange={handleInputChange}
        fullWidth
      />
      {/* Repeat this TextField for other subjects */}
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
};

export default PDFGenerator;
