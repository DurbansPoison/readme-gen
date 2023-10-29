import JSZip from 'jszip';
import html2pdf from 'html2pdf.js';

export async function generateFiles(formData) {
  const zip = new JSZip();
  const textFileContent = JSON.stringify(formData);

  zip.file('data.txt', textFileContent);

  const pdfContent = document.getElementById('pdfContent');
  const pdfOptions = {
    margin: 10,
    filename: 'data.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  };

  html2pdf().from(pdfContent).set(pdfOptions).outputPdf().then((pdfBlob) => {
    zip.file('data.pdf', pdfBlob, { binary: true });
    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, formData.projectTitle + '.zip');
    });
  });
}
