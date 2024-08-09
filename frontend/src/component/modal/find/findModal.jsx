import React, { useState } from 'react';
import './findModal.css';
import EmailInput from '../../emailInput/emailInput';

export default function FindModal({ onClose }) {
    const [email, setEmail] = useState('');
    const [duplicate, setDuplicate] = useState(false);
    const [emailState, setEmailState] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [certification, setCertification] = useState(false);
    return (
        <div className="modal-overlay">
            <div className="modal-content">
            <div className='flex just-btw align-center'>
                    <h2>비밀번호 찾기</h2>
                    <div className='close-btn pointer' onClick={onClose}>X</div>
                </div>
                {/* 추가적인 비밀번호 찾기 기능 구현 */}
                {/* 이메일을 넣어서 이메일 인증을 진행하고, 성공 시 비밀번호 변경으로 간다
                    그럼 이메일 인증을 컴포넌트화 해야한다 */}
                    <EmailInput
                        email={email}
                        setEmail={setEmail}
                        setEmailState={setEmailState}
                        emailError={emailError}
                        setEmailError={setEmailError}
                        duplicate={duplicate}
                        setDuplicate={setDuplicate}
                        certification={certification}
                        setCertification={setCertification}
                    />
            </div>
        </div>
    );
}