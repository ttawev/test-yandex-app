import React, { useCallback, useState } from 'react';
import axios from 'axios';
import Dropzone from 'react-dropzone';

const MAX_FILES_COUNT = 100;
const YANDEX_DISK_UPLOAD_URL = 'https://cloud-api.yandex.net/v1/disk/resources/upload';

const YandexDiskUploader = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length > MAX_FILES_COUNT) {
      alert(`Please select up to ${MAX_FILES_COUNT} files at a time.`);
      return;
    }

    try {
      for (const file of acceptedFiles) {
        
        const response = await axios.get(YANDEX_DISK_UPLOAD_URL, {
          headers: {
            Authorization:  '0c4181a7c2cf4521964a72ff57a34a07', 
          },
          params: {
            path: `/${file.name}`, 
            overwrite: true, 
          },
        });

       
        const uploadLink = response.data.href;
        await axios.put(uploadLink, file);

        
        setUploadedFiles((prevFiles) => [...prevFiles, file]);
      }

      alert('Files uploaded successfully!');
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('An error occurred while uploading the files.');
    }
  }, []);

  return (
    <div>
      <Dropzone onDrop={handleDrop} accept="image/*" multiple>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} style={{ border: '2px dashed black', padding: '20px', cursor: 'pointer' }}>
            <input {...getInputProps()} />
            <p>Выбрать файлы</p>
          </div>
        )}
      </Dropzone>
      <div>
        <h3>Загруженные файлы:</h3>
        <ul>
          {uploadedFiles.map((file) => (
            <li key={file.name}>{file.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default YandexDiskUploader;
