import { useEffect, useRef, useState } from 'react';
import './signupModal.css';
import axios from 'axios';
import Error from '../../error_message/error';

export default function SignUpModal({ onClose }) {
    const [email, setEmail] = useState('');
    const [duplicate, setDuplicate] = useState(false);
    const [emailState, setEmailState] = useState(false);
    const [emailError, setEmailError] = useState('');

    // 인증 성공에 대한 상태
    const [certification, setCertification] = useState(false);
    // 인증 과정에 생긴 메세지 상태
    const [certificationMessage, setCertificationMessage] = useState('');
    // 인증 진행 상태
    const [certificationStatus, setCertificationStatus] = useState('');
    // 인증 코드
    const [certificationNumber, setCertificationNumber] = useState('');
    // 인증 코드 일치 여부
    const [certificationNumberState, setCertificationNumberState] = useState(false);

    const [password, setPassword] = useState('');
    const [pwdState, setPwdState] = useState(false);
    const [pwdError, setPwdError] = useState('');

    const [checkPassword, setCheckPassword] = useState('');
    const [checkPwdError ,setCheckPwdError ] = useState('');

    const [error, setError] = useState('');

    const [timer, setTimer] = useState(300);
    const [minutes, setMinutes] = useState(5);
    const [seconds, setSeconds] = useState(0);
    const timerRef = useRef(null);

    useEffect(() => {
        if (certificationStatus === 'sent') {
            startTimer();
        }
    }, [certificationStatus]);

    useEffect(() => {
        if (timer > 0) {
            setMinutes(Math.floor(timer / 60));
            setSeconds(timer % 60);
        } else {
            setEmailError("시간 초과");
            setCertificationMessage('');
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
    }, [timer]);

    const startTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        // 타이머 초기화
        setTimer(300); 
        timerRef.current = setInterval(() => {
            setTimer((prevTimer) => prevTimer - 1);
            // 1초마다 업데이트
        }, 1000); 
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');

        if (!emailState || !pwdState || !duplicate || !certification) {
            console.log(emailState)
            console.log(pwdState)
            console.log(duplicate)
            console.log(certification)
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
                setCertificationMessage('');
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
                if(value !== password){
                    setCheckPwdError("비빌번호와 비밀번호 확인이 다릅니다.")
                    setPwdState(false);
                }else{
                    setCheckPwdError("");
                    setPwdState(true);
                }
                break;
            case "setCertificationNumber":
                setCertificationNumber(value);
                break;
            default:
                break;
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
                setEmailState(true);
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

    // 이메일 인증 버튼 눌렀을 때 인증번호 메일로 보내기
    const certificationClickHandler = async (e) => {
        e.preventDefault();
        setCertificationMessage('');
        setCertificationNumber('');

        if (!duplicate || emailError) {
            setEmailError("이메일을 입력 후 진행해주세요.");
            return;
        }
        setCertificationMessage("인증 메일 보내는 중..");
        setCertificationNumberState(true);
        try {
            const res = await axios.post('/api/auth/verify-email', { userEmail:email }, {
                headers: {
                    'Content-Type': 'application/json',  
                },
                withCredentials: true,
            });

            if (res.status === 200) {
                setCertification(false);
                setCertificationMessage('전송 완료!');
                setTimer(300);
                startTimer();
                setEmailError('');
            }
        } catch (e) {
            setCertification(false);
            setEmailError('이메일 인증 중 오류가 발생했습니다.');
            setCertificationMessage('');
        }
    };

    // 이메일 인증번호 확인
    const verifyNumberHandler = async (e) => {
        e.preventDefault();
        
        try {
            const res = await axios.post('/api/auth/verify-number', { userEmail:email, certificationNumber }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (res.status === 200) {
                setCertification(true);
                setCertificationStatus('success');
                setCertificationNumberState(false);
                setEmailError('');
                // console.log("성공");
            }
        } catch (e) {
            setCertification(false);
            setCertificationNumberState(true);
            setEmailError('인증 코드가 잘못되었습니다.');
            setCertificationMessage('');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className='flex just-btw align-center'>
                    <h2>회원가입</h2>
                    <div className='close-btn pointer' onClick={onClose}>X</div>
                </div>
                
                <div className="input-group">
                    <form 
                        onSubmit={submitHandler}>
                            {/* 이메일 입력란 */}
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
                        {/* 이메일 인증 버튼 누르면 인증코드 적는 곳 등장 */}
                        {certificationNumberState && (
                            <div className="input-container flex gap-10">
                                <input
                                    type='text'
                                    name='setCertificationNumber'
                                    className='input'
                                    value={certificationNumber}
                                    id='setCertificationNumber'
                                    placeholder='인증번호'
                                    onChange={(e) => changeHandler(e.target.value, "setCertificationNumber")}
                                />
                                <button className='btn btn-width' onClick={(e) => verifyNumberHandler(e)}>인증 번호 확인</button>
                            </div>
                        )}
                        {certificationNumberState && (
                            <div className='flex just-btw aligin-center'>
                                <p style={{color:"blue"}}>
                                    {certificationMessage}
                                </p>
                                {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                            </div>
                        ) }
                        {/* 에러 메세지가 있으면 출력 */}
                        {emailError && <Error props={emailError}/>}
                        
                        {/* 비밀번호 입력란 */}
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

                        {pwdError && <Error props={pwdError}/>}  
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
                        {checkPwdError && <Error props={checkPwdError}/>}  
                        {error && <Error props={error}/>}  
                        <button className='btn width-100' type='submit'>회원가입</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
