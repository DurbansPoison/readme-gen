import React, { useState } from 'react';
import Form from './components/Form';
import SubmitButton from './components/SubmitButton';

function App() {
  const [formData, setFormData] = useState({
    projectTitle: '',
    developer: '',
    // Add other form fields here
  });

  return (
    <div>
      <Form title="Project Title" placeholder="Enter Project Title" setValue={(value) => setFormData({ ...formData, projectTitle: value })} />
      <Form title="Developer" placeholder="Enter Developer" setValue={(value) => setFormData({ ...formData, developer: value })} />
      {/* Add other forms here */}
      <SubmitButton formData={formData} />
    </div>
  );
}

export default App;
