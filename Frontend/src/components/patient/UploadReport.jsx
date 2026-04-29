import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Button from '../shared/Button';
import Layout from '../shared/Layout';

const UploadReport = () => {
  const [files, setFiles] = useState([]);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const { uploadMedicalReports, isLoading } = useApp();

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!files.length) {
      return;
    }

    try {
      setError('');
      const response = await uploadMedicalReports(files);
      setNotice(response.message);
      setFiles([]);
    } catch (uploadError) {
      setError(uploadError.message);
    }
  };

  return (
    <Layout>
      <div className="form-container">
        <h2>Upload Diagnosis Report</h2>
        {notice && <div className="alert alert-success">{notice}</div>}
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleUpload}>
          <div className="file-upload">
            <label>Doctor&apos;s Report</label>
            <input type="file" accept=".pdf,.jpg,.png" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} />
            {files.length > 0 && <span className="file-name">{files.map((file) => file.name).join(', ')}</span>}
          </div>
          <Button type="submit" disabled={!files.length || isLoading}>{isLoading ? 'Uploading...' : 'Upload'}</Button>
        </form>
      </div>
    </Layout>
  );
};

export default UploadReport;
