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
    AdditionalThanks: '',
  });
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [bomFields, setBomFields] = useState(['']);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleBomInputChange = (index, value) => {
    const updatedBomFields = [...bomFields];
    updatedBomFields[index] = value;
    setBomFields(updatedBomFields);

    if (value && index === bomFields.length - 1) {
      // If the current field is filled out and is the last one, add a new one
      setBomFields([...updatedBomFields, '']);
    }
  };

  const handleSubmit = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);

    const content = Object.keys(formData)
      .map((key) => `${key}: ${formData[key]}`)
      .concat(bomFields.map((value, index) => `BOM #${index + 1}: ${value}`))
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
      .concat(bomFields.map((value, index) => `BOM #${index + 1}: ${value}`))
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
          )};
        </Grid>
        <Grid item xs={12}>
          {/* Checkbox to show additional fields */}
          <div>
            <label>
              <Checkbox
                checked={showAdditionalFields}
                onChange={(e) => setShowAdditionalFields(e.target.checked)}
              />
              Show Additional Fields
            </label>
          </div>
        </Grid>
        {showAdditionalFields && (
          <Grid item xs={12} sm={6}>
            {bomFields.map((value, index) => (
              <TextField
                key={index}
                label={`BOM #${index + 1}`}
                value={value}
                onChange={(e) => handleBomInputChange(index, e.target.value)}
                fullWidth
              />
            )}
          )}
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
