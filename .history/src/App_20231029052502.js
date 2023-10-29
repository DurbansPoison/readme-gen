import React, { useState } from 'react';
import { Button, TextField, Container, Grid, Typography } from '@mui/material';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { PDFDocument, rgb } from 'pdf-lib';
import JSZip from 'jszip'; // Add this line

function App() {
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

  const handleSubmit = async () => {
    // Create a PDF document using pdf-lib
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    page.drawText(formData.ProjectTitle, {
      x: 50,
      y: 350,
      size: 18,
      color: rgb(0, 0, 0),
    });

    // Create a PNG image from the HTML content using html2canvas
    const canvas = await html2canvas(document.body);
    const image = canvas.toDataURL('image/png');

    // Embed the image in the PDF
    const pngImage = await pdfDoc.embedPng(image);
    page.drawImage(pngImage, {
      x: 50,
      y: 150,
      width: 500,
    });

    // Save the PDF to a Blob
    const pdfBytes = await pdfDoc.save();

    // Create a text file
    const text =
      `Project Title: ${formData.ProjectTitle}\n` +
      `Developer: ${formData.Developer}\n` +
      `With The Help Of: ${formData.WithTheHelpOf}\n` +
      `Description: ${formData.Description}\n` +
      `Print Settings: ${formData.PrintSettings}\n` +
      `BOM: ${formData.BOM}\n` +
      `Build Guide: ${formData.BuildGuide}\n` +
      `Additional Thanks: ${formData.AdditionalThanks}\n`;

    const textBlob = new Blob([text], { type: 'text/plain' });

    // Create a compressed file
    const zip = new JSZip();
    zip.file('project_data.pdf', pdfBytes);
    zip.file('project_data.txt', textBlob);

    // Generate a downloadable link
    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'project_data.zip');
    });
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">Project Data</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="ProjectTitle"
            label="Project Title"
            value={formData.ProjectTitle}
            onChange={handleInputChange}
            fullWidth
          />
					
          {/* Repeat this TextField for other subjects */}
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Generate PDF and Text
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
