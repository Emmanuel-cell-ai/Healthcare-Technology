import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../shared/Layout';
import Button from '../shared/Button';

const LicenseUpload = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleUpload = (e) => {
    e.preventDefault();
    if (file) alert(`License "${file.name}" uploaded successfully`);
    navigate('/doctor/dashboard');
  };

  return (
    <Layout>
      <div className="form-container">
        <h2>Upload Medical License</h2>
        <form onSubmit={handleUpload}>
          <div className="file-upload">
            <label>Medical License Document</label>
            <input type="file" accept=".pdf,.jpg,.png" onChange={e => setFile(e.target.files[0])} />
            {file && <span className="file-name">📄 {file.name}</span>}
          </div>
          <Button type="submit" disabled={!file}>Upload & Continue</Button>
        </form>
      </div>
    </Layout>
  );
};

export default LicenseUpload;