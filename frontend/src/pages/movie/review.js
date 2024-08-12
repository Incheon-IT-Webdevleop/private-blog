import React, { useState, useRef, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './review.css'; 
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


export default function Review() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageURLs, setImageURLs] = useState([]);
    const fileInputRef = useRef(null);

    const handleImageUpload = async (e) => {
        const files = e.target.files;
        const urls = [];

        for (let i = 0; i < files.length; i++) {
            const formData = new FormData();
            formData.append('image', files[i]);
            formData.append('key', 'c2b9ff532c2df7d835429f733d195fba');

            try {
                const response = await axios.post('https://api.imgbb.com/1/upload', formData);
                urls.push(response.data.data.url);
            } catch (error) {
                console.error('Image upload failed', error);
            }
        }

        setImageURLs((prevURLs) => [...prevURLs, ...urls]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const reviewData = {
            title,
            content,
            images: imageURLs.join(','),
        };

        try {
            await axios.post('/api/reviews', reviewData);
            alert('리뷰가 성공적으로 저장되었습니다.');
        } catch (error) {
            console.error('Review save failed', error);
        }
    };

    const moveImage = useCallback((dragIndex, hoverIndex) => {
        const draggedImage = imageURLs[dragIndex];
        setImageURLs((prevURLs) =>
            update(prevURLs, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, draggedImage],
                ],
            })
        );
    }, [imageURLs]);

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="review-container">
            <h1>영화 리뷰 작성</h1>
            <div className="review-layout">
                <div className="editor-section">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="title-input"
                        placeholder="제목을 입력하세요"
                    />
                    <ReactQuill
                        value={content}
                        onChange={setContent}
                        className="content-editor"
                    />
                    <div className="image-upload">
                        <input
                            type="file"
                            multiple
                            onChange={handleImageUpload}
                            className="file-input"
                            ref={fileInputRef}
                        />
                        <button onClick={triggerFileInput} className="upload-button">이미지 업로드</button>
                    </div>
                    <button onClick={handleSubmit} className="submit-button">리뷰 저장</button>
                </div>
               
            </div>
        </div>
    );
}

export default MovieReviewEditor;

