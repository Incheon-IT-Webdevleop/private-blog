import React, { useState, useRef, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './css/diary.css'
import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION,
});

const s3 = new AWS.S3();

const QuillEditor = () => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [content, setContent] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const quillRef = useRef(null);

  const handleGenreChange = (genre) => {
    setSelectedGenres(prevGenres => 
      prevGenres.includes(genre)
        ? prevGenres.filter(g => g !== genre)
        : [...prevGenres, genre]
    );
  };

  const uploadImage = async (file) => {
    const params = {
      Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
      Key: `movie-posters/${Date.now()}_${file.name}`,
      Body: file,
      ACL: 'public-read',
    };

    try {
      const data = await s3.upload(params).promise();
      return data.Location;
    } catch (error) {
      console.error('S3 업로드 에러:', error);
      return null;
    }
  };

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection(true);

      const url = await uploadImage(file);
      if (url) {
        quill.insertEmbed(range.index, 'image', url);
        setUploadedImages(prev => [...prev, url]);
      }
    };
  }, []);

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    },
  };

  return (
    <div>
      <ReactQuill
        style={{ height: "650px"}}
        ref={quillRef}
        value={content}
        onChange={setContent}
        modules={modules}
        placeholder="내용을 입력하세요..."
      />
    </div>
  );
};

export default QuillEditor;
