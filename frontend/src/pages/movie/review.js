import React, { useState, useRef, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './review.css'; // CSS 파일을 불러옵니다.
import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION,
});

const s3 = new AWS.S3();

const genres = [
  '액션', '코미디', '드라마', '공포', 'SF', '로맨스', '스릴러', '애니메이션'
];

const MovieReviewEditor = () => {
  const [title, setTitle] = useState('');
  const [rating, setRating] = useState('');
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

  const handleSubmit = async () => {
    const reviewData = {
      title,
      rating,
      genres: selectedGenres,
      content,
      images: uploadedImages
    };

    console.log('리뷰 데이터:', reviewData);
    // 여기에 서버로 데이터를 보내는 로직을 추가하세요
  };

  return (
    <div className="editor-container">
      <input 
        type="text" 
        className="input"
        placeholder="리뷰 제목" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)}
      />
      <select 
        className="select"
        value={rating} 
        onChange={(e) => setRating(e.target.value)}
      >
        <option value="">평점 선택</option>
        {[1, 2, 3, 4, 5].map(score => (
          <option key={score} value={score}>{score}점</option>
        ))}
      </select>
      <div className="genre-container">
        {genres.map(genre => (
          <div className="genre-checkbox" key={genre}>
            <input 
              type="checkbox" 
              id={genre} 
              checked={selectedGenres.includes(genre)}
              onChange={() => handleGenreChange(genre)}
            />
            <label htmlFor={genre}>{genre}</label>
          </div>
        ))}
      </div>
      <ReactQuill
        ref={quillRef}
        value={content}
        onChange={setContent}
        modules={modules}
        placeholder="리뷰 내용을 입력하세요..."
      />
      <button className="save-button" onClick={handleSubmit}>리뷰 저장</button>
    </div>
  );
};

export default MovieReviewEditor;
