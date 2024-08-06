import React, { useState, useCallback } from 'react';
import axios from 'axios';
import update from 'immutability-helper';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import '../movie/review.css';
//npm install react-dnd react-dnd-html5-backend 이미지 위치변경을위해 다운
const ItemType = 'IMAGE';

const ImageItem = ({ url, index, moveImage }) => {
    const ref = React.useRef(null);
    const [, drop] = useDrop({
        accept: ItemType,
        hover(item) {
            if (!ref.current) return;

            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) return;

            moveImage(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: ItemType,
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    return (
        <img
            ref={ref}
            src={url}
            alt={`upload-${index}`}
            style={{ opacity: isDragging ? 0.5 : 1 }}
            className="draggable-image"
        />
    );
};

export default function Review() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageURLs, setImageURLs] = useState([]);

    const handleImageUpload = async (e) => {
        const files = e.target.files;
        const urls = [];

        for (let i = 0; i < files.length; i++) {
            const formData = new FormData();
            formData.append('image', files[i]);
            formData.append('key', 'c2b9ff532c2df7d835429f733d195fba'); // 여기서 YOUR_IMGBB_API_KEY를 실제 API 키로 교체하세요

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
            // DB 저장 로직은 예시입니다. 실제로는 서버 API로 데이터를 전송해야 합니다.
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

    return (
        <div className="review-container">
            <h1>영화 리뷰 작성</h1>
            <form onSubmit={handleSubmit} className="review-form">
                <div className="form-group">
                    <label>제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>내용</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>이미지 업로드</label>
                    <input
                        type="file"
                        multiple
                        onChange={handleImageUpload}
                        className="form-control"
                    />
                </div>
                <button type="submit" className="submit-button">리뷰 저장</button>
            </form>
            <DndProvider backend={HTML5Backend}>
                <div className="image-preview">
                    {imageURLs.map((url, index) => (
                        <ImageItem key={index} index={index} url={url} moveImage={moveImage} />
                    ))}
                </div>
            </DndProvider>
        </div>
    );
}