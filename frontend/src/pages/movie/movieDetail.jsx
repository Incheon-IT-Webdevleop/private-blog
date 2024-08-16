import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import parse from 'html-react-parser';  // html-react-parser 임포트
import '../movie/movieDetail.css';

export default function MovieDetail() {
    const { id } = useParams();  // URL에서 id 추출
    const [review, setReview] = useState(null);  // 리뷰 데이터를 저장할 상태
    const token = useSelector((state) => state.auth.token);  // Redux에서 토큰 가져오기

    useEffect(() => {
        if (token) {  // 토큰이 있는 경우에만 요청을 보냄
            axios.get(`/api/auth/reviews/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`  // 요청 헤더에 토큰 포함
                }
            })
            .then(response => {
                setReview(response.data);
            })
            .catch(error => {
                console.error("리뷰를 불러오는 중 오류가 발생했습니다!", error);
            });
        } else {
            console.error("토큰이 존재하지 않습니다.");  // 토큰이 없는 경우 오류 로그
        }
    }, [id, token]);

    if (!review) {
        return <p>리뷰를 불러오는 중입니다...</p>;  // 리뷰 데이터가 없을 때 로딩 메시지
    }

    return (
        <div className="review-detail-container">
            <h1>{review.reviewTitle}</h1>
            <p>{new Date(review.reviewDate).toLocaleDateString()}</p>
            <div className="review-content">
                {parse(review.reviewContent)} 
            </div>
        </div>
    );
}
