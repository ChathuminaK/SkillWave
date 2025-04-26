import React, { useState } from 'react';
import { uploadFile } from '../../services/api.service';

const FileUploadTest = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setResult(null);
    setError(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file first');
      return;
    }
    
    setUploading(true);
    setError(null);
    
    try {
      // Use direct fetch API as a fallback test
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('http://localhost:8080/api/media/upload-test', {
        method: 'POST',
        body: formData,
        // Try without credentials first
        // credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setResult(data);
      console.log('Upload successful using fetch API:', data);
    } catch (err) {
      console.error('Error in upload test:', err);
      setError(err.message || 'Failed to upload file');
      
      // Try alternative method if fetch fails
      try {
        console.log('Trying alternative upload method...');
        const result = await uploadFile(file);
        setResult(result);
        setError(null);
      } catch (altErr) {
        console.error('Alternative upload also failed:', altErr);
        setError((error) => `${error || ''}\nAlternative upload also failed: ${altErr.message}`);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>File Upload Test</h2>
      <form onSubmit={handleUpload}>
        <div className="mb-3">
          <label htmlFor="file" className="form-label">Select a file to upload</label>
          <input 
            type="file" 
            id="file" 
            className="form-control" 
            onChange={handleFileChange} 
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={!file || uploading}
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
      </form>
      
      {error && (
        <div className="alert alert-danger mt-3">
          {error}
        </div>
      )}
      
      {result && (
        <div className="mt-4">
          <h3>Upload Result:</h3>
          <pre className="bg-light p-3 rounded">
            {JSON.stringify(result, null, 2)}
          </pre>
          
          {result.url && (
            <div className="mt-3">
              <h4>Uploaded File:</h4>
              {result.url.endsWith('.jpg') || 
               result.url.endsWith('.jpeg') || 
               result.url.endsWith('.png') || 
               result.url.endsWith('.gif') ? (
                <img 
                  src={result.url} 
                  alt="Uploaded file" 
                  className="img-fluid mt-2" 
                  style={{ maxWidth: '300px' }} 
                />
              ) : (
                <a href={result.url} target="_blank" rel="noopener noreferrer" className="btn btn-info">
                  View File
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploadTest;