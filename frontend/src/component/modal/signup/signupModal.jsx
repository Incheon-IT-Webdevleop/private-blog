import { useState } from 'react';
import './signupModal.css';
import axios from 'axios';

export default function SignUpModal({ onClose }) {
    const [email, setEmail] = useState('');
    const [duplicate, setDuplicate] = useState(false);
    const [emailState, setEmailState] = useState(false);
    const [emailError, setEmailError] = useState('');

    const [password, setPassword] = useState('');
    const [pwdState, setPwdState] = useState(false);
    const [pwdError, setPwdError] = useState('');

    const [checkPassword, setCheckPassword] = useState('');
    const [checkPwdError ,setCheckPwdError ] = useState('');

    const [error, setError] = useState('');

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');

        if (!emailState || !pwdState || !duplicate) {
            setError('모든 필드를 올바르게 입력해주세요.');
            return;
        }

        try {
            const res = await axios.post('/api/auth/signup', { email, password }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            onClose();
        } catch (e) {
            setError('Signup failed. Please try again.');
            console.error('Signup error:', e);
        }
    };

    const changeHandler = (value, type) => {
        switch (type) {
            case "email":
                setEmail(value);
                if (!validateEmail(value)) {
                    setEmailError("유효하지 않은 이메일 주소입니다.");
                    setEmailState(false);
                }else {
                    setEmailError('');
                }
                break;
            case "password":
                setPassword(value);
                if(!validatePassword(value)){
                    setPwdError("비밀번호는 영어 + 숫자 8~20자리 입니다.");
                    setPwdState(false);
                }else {
                    setPwdError('');
                }
                break;
            case "checkPassword":
                setCheckPassword(value);
                if(!validatePassword(value)){
                    setCheckPwdError("비빌번호와 비밀번호 확인이 다릅니다.")
                    setPwdState(false);
                }else{
                    setCheckPwdError("");
                    setPwdState(true);
                }
                break;
            default:
                break;
        }
    };
    // 이메일 인증
    const certificationClickHandler = (e) => {
        e.preventDefault();
        if(!duplicate){
            return;
        }
        
    };
    // 이메일 유효성 검사
    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    };

    // 비밀번호 유효성 검사
    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
        return regex.test(password);
    };

    const checkEmailDuplicate = async (email) => {
        

        // console.log("시작")
        try {
            const res = await axios.post('/api/auth/check-email', { email }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            console.log(res);
            if (res.status === 200) {
                setEmailError("");
                setDuplicate(true);
            }
        } catch (e) {
            if (e.response && e.response.status === 409) {
                setEmailError(e.response.data);
            } else {
                setEmailError('이메일 중복 검사에 실패했습니다.');
            }
            setDuplicate(false);
            setEmailState(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className='flex just-btw align-center'>
                    <h2>회원가입</h2>
                    <div className='close-btn' onClick={onClose}></div>
                </div>
                
                <div className="input-group">
                    <form 
                        onSubmit={submitHandler}>
                        <div className="input-container flex gap-10">
                            <input
                                type='email'
                                name='email'
                                className='input'
                                value={email}
                                id='email'
                                onChange={(e) => changeHandler(e.target.value, "email")}
                                onBlur={() => {
                                    if (validateEmail(email)) {
                                        checkEmailDuplicate(email);
                                    }
                                }}
                            />
                            <label className={`label ${email ? 'shrink' : ''}`} htmlFor="email">이메일</label>
                            <button className='btn btn-width' onClick={(e) => certificationClickHandler(e)}>이메일 인증</button>
                        </div>
                        {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
                        
                        <div className="input-container">
                            <input
                                type='password'
                                name='password'
                                className='input'
                                value={password}
                                id='password'
                                onChange={(e) => changeHandler(e.target.value, "password")}
                            />
                            <label className={`label ${password ? 'shrink' : ''}`} htmlFor="password">비밀번호</label>
                        </div>
                        {pwdError && <p style={{ color: 'red' }}>{pwdError}</p>}  
                        <div className="input-container">
                            <input
                                type='password'
                                name='checkPassword'
                                className='input'
                                value={checkPassword}
                                id='checkPassword'
                                onChange={(e) => changeHandler(e.target.value, "checkPassword")}
                            />
                            <label className={`label ${checkPassword ? 'shrink' : ''}`} htmlFor="checkPassword">비밀번호 확인</label>
                        </div> 
                        {checkPwdError && <p style={{ color: 'red' }}>{checkPwdError}</p>}  
                        {error && <p style={{ color: 'red' }}>{error}</p>}  
                        <button className='btn width-100' type='submit'>회원가입</button>
                    </form>
                </div>
                {/* 추가적인 회원가입 기능 구현 */}
            </div>
        </div>
    );
}
