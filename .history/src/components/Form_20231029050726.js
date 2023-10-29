import React from 'react';
import { useState } from 'react';

function Form({ title, placeholder, setValue }) {
  const [value, setValue] = useState('');

  const handleChange = (e) => {
	// eslint-disable-next-line no-undef
    setValue(e.target.value);
  };

  return (
    <div>
      <label>{title}</label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
		// eslint-disable-next-line no-undef
        onChange={handleChange}
      />
    </div>
  );
}

export default Form;
