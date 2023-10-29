import React from 'react';
import { generateFiles } from '../utils/generateFiles';

function SubmitButton({ formData }) {
  const handleSubmit = () => {
    generateFiles(formData);
  };

  return <button onClick={handleSubmit}>Generate README</button>;
}

export default SubmitButton;

