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

  const generateAdditionalFields = () => {
    const additionalFields = [];

    for (let i = 1; i <= 9; i++) {
      additionalFields.push(
        <div key={i}>
          <TextField
            name={`WithTheHelpOf_${i}`}
            label={`WithTheHelpOf #${i}`}
            value={formData[`WithTheHelpOf_${i}`]}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            name={`PrintSettings_${i}`}
            label={`PrintSettings #${i}`}
            value={formData[`PrintSettings_${i}`]}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            name={`BOM_${i}`}
            label={`BOM #${i}`}
            value={formData[`BOM_${i}`]}
            onChange={handleInputChange}
            fullWidth
          />
        </div>
      );
    }

    return additionalFields;
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

          {showAdditionalFields && generateAdditionalFields()}
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
