// 1. Create a new React app using Create React App.
// 2. Replace the default contents of src/App.js with the following code.

import React, { useState } from 'react';
import JSZip from 'jszip';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

function App() {
  const [formData, setFormData] = useState({
    projectTitle: '',
    developer: '',
    projectDescription: '',
    bom: Array(10).fill(''),
    printSettings: '',
    betaTesters: '',
    contactMe: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a text file with the form data
    const textContent = `
      Project Title: ${formData.projectTitle}
      Developer: ${formData.developer}
      Project Description: ${formData.projectDescription}
      BOM: ${formData.bom.join(', ')}
      Print Settings: ${formData.printSettings}
      Beta Testers: ${formData.betaTesters}
      Contact Me: ${formData.contactMe}
    `;

    const blob = new Blob([textContent], { type: 'text/plain' });
    saveAs(blob, `${formData.projectTitle}.txt`);

    // Create a PDF from the form data
    const capture = document.getElementById('pdf-container');
    const canvas = await html2canvas(capture);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'JPEG', 0, 0);
    pdf.save(`${formData.projectTitle}.pdf`);

    // Create a ZIP file with both the text and PDF files
    const zip = new JSZip();
    zip.file(`${formData.projectTitle}.txt`, textContent);
    zip.file(`${formData.projectTitle}.pdf`, pdf.output('blob'));

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, `${formData.projectTitle}.zip`);
    });
  };

  return (
    <div>
      <h1>README Generator</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Project Title:</label>
          <input
            type="text"
            name="projectTitle"
            value={formData.projectTitle}
            onChange={handleChange}
            required
          />
        </div>
        {/* Similar form elements for other fields */}
        <div>
          <button type="submit">Generate README</button>
        </div>
      </form>
      <div id="pdf-container">
        <h2>{formData.projectTitle}</h2>
        <p>Developer: {formData.developer}</p>
        <p>Project Description: {formData.projectDescription}</p>
        <p>BOM: {formData.bom.join(', ')}</p>
        <p>Print Settings: {formData.printSettings}</p>
        <p>Beta Testers: {formData.betaTesters}</p>
        <p>Contact Me: {formData.contactMe}</p>
      </div>
    </div>
  );
}

export default App;

// 3. Run the app by running 'npm start' in your project's directory.
