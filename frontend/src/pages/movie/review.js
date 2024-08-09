import React, { useState, useCallback, useRef } from 'react';
import axios from 'axios';
import update from 'immutability-helper';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../movie/review.css';

const ItemType = 'IMAGE';

const ImageItem = ({ url, index, moveImage }) => {
    const ref = useRef(null);
    const [size, setSize] = useState({ width: 200, height: 200 });

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

    const handleResize = (e) => {
        e.preventDefault();
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = size.width;
        const startHeight = size.height;

        const doDrag = (dragEvent) => {
            setSize({
                width: startWidth + dragEvent.clientX - startX,
                height: startHeight + dragEvent.clientY - startY,
            });
        };

        const stopDrag = () => {
            document.documentElement.removeEventListener('mousemove', doDrag, false);
            document.documentElement.removeEventListener('mouseup', stopDrag, false);
        };

        document.documentElement.addEventListener('mousemove', doDrag, false);
        document.documentElement.addEventListener('mouseup', stopDrag, false);
    };

    return (
        <div ref={ref} style={{ width: size.width, height: size.height, opacity: isDragging ? 0.5 : 1, position: 'relative' }}>
            <img
                src={url}
                alt={`upload-${index}`}
                style={{ width: '100%', height: '100%' }}
                className="draggable-image"
            />
            <div className="resize-handle" onMouseDown={handleResize}></div>
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
                <div className="preview-section">
                    <h2>{title}</h2>
                    <DndProvider backend={HTML5Backend}>
                        <div className="image-preview">
                            {imageURLs.map((url, index) => (
                                <ImageItem key={index} index={index} url={url} moveImage={moveImage} />
                            ))}
                        </div>
                    </DndProvider>
                    <div className="content-preview" dangerouslySetInnerHTML={{ __html: content }} />
                </div>
            </div>
        </div>
    );
}
