// src/components/Form.js
import React, { useState } from "react";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import { PDFDownloadLink, PDFViewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { Formik, Form, Field } from "formik";

function FormComponent() {
  const [formData, setFormData] = useState({});
  const [pdfFile, setPdfFile] = useState(null);

  const handleSubmit = (values) => {
    setFormData(values);

    const doc = new jsPDF();
    doc.text("Project Title: " + values.projectTitle, 10, 10);
    // Add more fields to the PDF document

    // Save PDF file
    const pdfBlob = doc.output("blob");
    setPdfFile(pdfBlob);
  };

  const downloadZip = () => {
    // Create a zip file
    const zip = new JSZip();
    const textContent = JSON.stringify(formData, null, 2);

    // Add text file
    zip.file("README.txt", textContent);

    // Add PDF file
    zip.file("README.pdf", pdfFile);

    // Generate a zip file
    zip.generateAsync({ type: "blob" }).then(function (content) {
      // Save and download the zip file
      saveAs(content, formData.projectTitle + ".zip");
    });
  };

  return (
    <div>
      <Formik initialValues={{}} onSubmit={handleSubmit}>
        <Form>
          <div>
            <label htmlFor="projectTitle">Project Title:</label>
            <Field type="text" name="projectTitle" />
          </div>
          {/* Add more fields here for developer, project description, etc. */}
          <div>
            <button type="submit">Generate README</button>
          </div>
        </Form>
      </Formik>

      {formData.projectTitle && (
        <div>
          <PDFViewer width={600} height={800}>
            <PDFDownloadLink document={formData} fileName="README.pdf">
              {({ blob, url, loading, error }) =>
                loading ? "Loading document..." : "Download PDF"
              }
            </PDFDownloadLink>
          </PDFViewer>

          <button onClick={downloadZip}>Download Zip</button>
        </div>
      )}
    </div>
  );
}

export default FormComponent;
