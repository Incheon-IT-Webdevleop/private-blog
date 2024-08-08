import React from 'react';
import './findModal.css';

export default function FindModal({ onClose }) {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>비밀번호 찾기</h2>
                <button onClick={onClose}>닫기</button>
                {/* 추가적인 아이디/비밀번호 찾기 기능 구현 */}
            </div>
        </div>
    );
}