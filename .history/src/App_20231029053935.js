import React, { useState } from 'react';
import {
  Button,
  TextField,
  Container,
  Grid,
  Typography,
  Checkbox,
} from '@mui/material';
import { saveAs } from 'file-saver';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import JSZip from 'jszip';

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
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    setShowAdditionalFields(e.target.checked);
  };

  const handleSubmit = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);

    const content = Object.keys(formData)
      .map((key) => `${key}: ${formData[key]}`)
      .join('\n');

    page.drawText(content, {
      x: 50,
      y: 250,
      size: 14,
      font: await pdfDoc.embedFont(StandardFonts.Helvetica),
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();

    const text = Object.keys(formData)
      .map((key) => `${key}: ${formData[key]}`)
      .join('\n');

    const textBlob = new Blob([text], { type: 'text/plain' });

    const zip = new JSZip();
    zip.file('project_data.pdf', pdfBytes);
    zip.file('project_data.txt', textBlob);

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
          {Object.keys(formData).map((key) => (
            <TextField
              key={key}
              name={key}
              label={key}
              value={formData[key]}
              onChange={handleInputChange}
              fullWidth
            />
          )}

          {/* Checkbox to show additional fields */}
          <div>
            <label>
              <Checkbox
                checked={showAdditionalFields}
                onChange={handleCheckboxChange}
              />
              Show Additional Fields
            </label>
          </div>

          {/* Additional fields for WithTheHelpOf, PrintSettings, and BOM */}
          {showAdditionalFields && [1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
            <div key={index}>
              <TextField
                name={`WithTheHelpOf_${index}`}
                label={`WithTheHelpOf #${index}`}
                value={formData[`WithTheHelpOf_${index}`]}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                name={`PrintSettings_${index}`}
                label={`PrintSettings #${index}`}
                value={formData[`PrintSettings_${index}`]}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                name={`BOM_${index}`}
                label={`BOM #${index}`}
                value={formData[`BOM_${index}`]}
                onChange={handleInputChange}
                fullWidth
              />
            </div>
          ))}
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

