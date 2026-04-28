import React, { useState } from 'react';
import Layout from '../shared/Layout';
import Button from '../shared/Button';

const UploadReport = () => {
  const [file, setFile] = useState(null);

  const handleUpload = (e) => {
    e.preventDefault();
    if (file) alert(`Report "${file.name}" uploaded successfully`);
  };

  return (
    <Layout>
      <div className="form-container">
        <h2>Upload Diagnosis Report</h2>
        <form onSubmit={handleUpload}>
          <div className="file-upload">
            <label>Doctor's Report</label>
            <input type="file" accept=".pdf,.jpg,.png" onChange={e => setFile(e.target.files[0])} />
            {file && <span className="file-name">📄 {file.name}</span>}
          </div>
          <Button type="submit" disabled={!file}>Upload</Button>
        </form>
      </div>
    </Layout>
  );
};

export default UploadReport;