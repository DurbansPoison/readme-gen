// import React, { useState } from 'react';
// import { Button, TextField, Container, Grid, Typography } from '@mui/material';
// import html2canvas from 'html2canvas';
// import { saveAs } from 'file-saver';
// import { PDFDocument, rgb } from 'pdf-lib';
// import JSZip from 'jszip';

// function App() {
//   const [formData, setFormData] = useState({
//     ProjectTitle: '',
//     Developer: '',
//     WithTheHelpOf: '',
//     Description: '',
//     PrintSettings: '',
//     BOM: '',
//     BuildGuide: '',
//     AdditionalThanks: '',
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async () => {
//     const pdfDoc = await PDFDocument.create();
//     const page = pdfDoc.addPage([600, 400]);
//     page.drawText(`Project Title: ${formData.ProjectTitle}`, {
//       x: 50,
//       y: 350,
//       size: 16,
//       color: rgb(0, 0, 0),
//     });
//     page.drawText(`Developer: ${formData.Developer}`, {
//       x: 50,
//       y: 320,
//       size: 16,
//       color: rgb(0, 0, 0),
//     });
//     page.drawText(`With The Help Of: ${formData.WithTheHelpOf}`, {
//       x: 50,
//       y: 290,
//       size: 16,
//       color: rgb(0, 0, 0),
//     });
//     page.drawText(`Description: ${formData.Description}`, {
//       x: 50,
//       y: 260,
//       size: 16,
//       color: rgb(0, 0, 0),
//     });
//     page.drawText(`Print Settings: ${formData.PrintSettings}`, {
//       x: 50,
//       y: 230,
//       size: 16,
//       color: rgb(0, 0, 0),
//     });
//     page.drawText(`BOM: ${formData.BOM}`, {
//       x: 50,
//       y: 200,
//       size: 16,
//       color: rgb(0, 0, 0),
//     });
//     page.drawText(`Build Guide: ${formData.BuildGuide}`, {
//       x: 50,
//       y: 170,
//       size: 16,
//       color: rgb(0, 0, 0),
//     });
//     page.drawText(`Additional Thanks: ${formData.AdditionalThanks}`, {
//       x: 50,
//       y: 140,
//       size: 16,
//       color: rgb(0, 0, 0),
//     });

//     const canvas = await html2canvas(document.body);
//     const image = canvas.toDataURL('image/png');
//     const pngImage = await pdfDoc.embedPng(image);
//     page.drawImage(pngImage, {
//       x: 50,
//       y: 20,
//       width: 500,
//     });

//     const pdfBytes = await pdfDoc.save();

//     const text = `
//       Project Title: ${formData.ProjectTitle}
//       Developer: ${formData.Developer}
//       With The Help Of: ${formData.WithTheHelpOf}
//       Description: ${formData.Description}
//       Print Settings: ${formData.PrintSettings}
//       BOM: ${formData.BOM}
//       Build Guide: ${formData.BuildGuide}
//       Additional Thanks: ${formData.AdditionalThanks}
//     `;

//     const textBlob = new Blob([text], { type: 'text/plain' });

//     const zip = new JSZip();
//     zip.file('project_data.pdf', pdfBytes);
//     zip.file('project_data.txt', textBlob);

//     zip.generateAsync({ type: 'blob' }).then((content) => {
//       saveAs(content, 'project_data.zip');
//     });
//   };

//   return (
//     <Container>
//       <Grid container spacing={2}>
//         <Grid item xs={12}>
//           <Typography variant="h4">Project Data</Typography>
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             name="ProjectTitle"
//             label="Project Title"
//             value={formData.ProjectTitle}
//             onChange={handleInputChange}
//             fullWidth
//           />
//           <TextField
//             name="Developer"
//             label="Developer"
//             value={formData.Developer}
//             onChange={handleInputChange}
//             fullWidth
//           />
//           <TextField
//             name="WithTheHelpOf"
//             label="With The Help Of"
//             value={formData.WithTheHelpOf}
//             onChange={handleInputChange}
//             fullWidth
//           />
//           <TextField
//             name="Description"
//             label="Description"
//             value={formData.Description}
//             onChange={handleInputChange}
//             fullWidth
//           />
//           <TextField
//             name="PrintSettings"
//             label="Print Settings"
//             value={formData.PrintSettings}
//             onChange={handleInputChange}
//             fullWidth
//           />
//           <TextField
//             name="BOM"
//             label="BOM"
//             value={formData.BOM}
//             onChange={handleInputChange}
//             fullWidth
//           />
//           <TextField
//             name="BuildGuide"
//             label="Build Guide"
//             value={formData.BuildGuide}
//             onChange={handleInputChange}
//             fullWidth
//           />
//           <TextField
//             name="AdditionalThanks"
//             label="Additional Thanks"
//             value={formData.AdditionalThanks}
//             onChange={handleInputChange}
//             fullWidth
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <Button variant="contained" color="primary" onClick={handleSubmit}>
//             Generate PDF and Text
//           </Button>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// }

// export default App;
import React, { useState } from 'react';
import { Button, TextField, Container, Grid, Typography } from '@mui/material';
import { saveAs } from 'file-saver';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import JSZip from 'jszip';

function App() {
  const [formData, setFormData] = useState({
    ProjectTitle: '',
    Developer: '',
    WithTheHelpOf: Array(10).fill(''),  // Create an array of 10 empty strings
    Description: '',
    PrintSettings: Array(10).fill(''), // Create an array of 10 empty strings
    BOM: Array(10).fill(''),           // Create an array of 10 empty strings
    BuildGuide: '',
    AdditionalThanks: '',
  });

  const handleInputChange = (e, field, index) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [field]: prevData[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleSubmit = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);

    const content = Object.keys(formData)
      .map((key) => {
        if (Array.isArray(formData[key])) {
          return `${key}:\n${formData[key].join('\n')}`;
        }
        return `${key}: ${formData[key]}`;
      })
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
      .map((key) => {
        if (Array.isArray(formData[key])) {
          return `${key}:\n${formData[key].join('\n')}`;
        }
        return `${key}: ${formData[key]}`;
      })
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
            <div key={key}>
              {Array.isArray(formData[key]) ? (
                formData[key].map((value, index) => (
                  <TextField
                    key={index}
                    name={key}
                    label={`${key} #${index + 1}`}
                    value={value}
                    onChange={(e) => handleInputChange(e, key, index)}
                    fullWidth
                  />
                ))
              ) : (
                <TextField
                  name={key}
                  label={key}
                  value={formData[key]}
                  onChange={handleInputChange}
                  fullWidth
                />
              )}
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

export default App;import React, { useState } from 'react';
import { Button, TextField, Container, Grid, Typography } from '@mui/material';
import { saveAs } from 'file-saver';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import JSZip from 'jszip';

function App() {
  const [formData, setFormData] = useState({
    ProjectTitle: '',
    Developer: '',
    WithTheHelpOf: Array(10).fill(''),  // Create an array of 10 empty strings
    Description: '',
    PrintSettings: Array(10).fill(''), // Create an array of 10 empty strings
    BOM: Array(10).fill(''),           // Create an array of 10 empty strings
    BuildGuide: '',
    AdditionalThanks: '',
  });

  const handleInputChange = (e, field, index) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [field]: prevData[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleSubmit = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);

    const content = Object.keys(formData)
      .map((key) => {
        if (Array.isArray(formData[key])) {
          return `${key}:\n${formData[key].join('\n')}`;
        }
        return `${key}: ${formData[key]}`;
      })
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
      .map((key) => {
        if (Array.isArray(formData[key])) {
          return `${key}:\n${formData[key].join('\n')}`;
        }
        return `${key}: ${formData[key]}`;
      })
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
            <div key={key}>
              {Array.isArray(formData[key]) ? (
                formData[key].map((value, index) => (
                  <TextField
                    key={index}
                    name={key}
                    label={`${key} #${index + 1}`}
                    value={value}
                    onChange={(e) => handleInputChange(e, key, index)}
                    fullWidth
                  />
                ))
              ) : (
                <TextField
                  name={key}
                  label={key}
                  value={formData[key]}
                  onChange={handleInputChange}
                  fullWidth
                />
              )}
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
