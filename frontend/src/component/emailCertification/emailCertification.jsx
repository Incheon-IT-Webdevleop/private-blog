import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import Error from '../error_message/error';

export default function EmailCertification({
    email, setEmail, setDuplicate, setEmailState, emailError, setEmailError,
    certification, setCertification
}) {
    const [certificationMessage, setCertificationMessage] = useState('');
    const [certificationStatus, setCertificationStatus] = useState('');
    const [certificationNumber, setCertificationNumber] = useState('');
    const [certificationNumberState, setCertificationNumberState] = useState(false);

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
        setTimer(300); 
        timerRef.current = setInterval(() => {
            setTimer((prevTimer) => prevTimer - 1);
        }, 1000); 
    };

    const changeHandler = (value) => {
        setEmail(value);
        setCertificationMessage('');
        if (!validateEmail(value)) {
            setEmailError("유효하지 않은 이메일 주소입니다.");
            setEmailState(false);
        } else {
            setEmailError('');
            setEmailState(true);
        }
    }

    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    };

    const checkEmailDuplicate = async (email) => {
        try {
            const res = await axios.post('/api/auth/check-email', { email }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
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
        }
    };

    const certificationClickHandler = async (e) => {
        e.preventDefault();
        setCertificationMessage('');
        setCertificationNumber('');

        if (!emailState || emailError) {
            setEmailError("이메일을 입력 후 진행해주세요.");
            return;
        }
        setCertificationMessage("인증 메일 보내는 중..");
        setCertificationNumberState(true);
        try {
            const res = await axios.post('/api/auth/verify-email', { userEmail: email }, {
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

    const verifyNumberHandler = async (e) => {
        e.preventDefault();
        
        try {
            const res = await axios.post('/api/auth/verify-number', { userEmail: email, certificationNumber }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (res.status === 200) {
                setCertification(true);
                setCertificationStatus('success');
                setCertificationNumberState(false);
                setEmailError('');
            }
        } catch (e) {
            setCertification(false);
            setCertificationNumberState(true);
            setEmailError('인증 코드가 잘못되었습니다.');
            setCertificationMessage('');
        }
    };
    
    return(
        <div>
            <div className="input-group">
                <div className="input-container flex gap-10">
                    <input
                        type='email'
                        name='email'
                        className='input'
                        value={email}
                        id='email'
                        onChange={(e) => changeHandler(e.target.value)}
                        onBlur={() => {
                            if (validateEmail(email)) {
                                checkEmailDuplicate(email);
                            }
                        }}
                    />
                    <label className={`label ${email ? 'shrink' : ''}`} htmlFor="email">이메일</label>
                    <button className='btn btn-width' onClick={certificationClickHandler}>이메일 인증</button>
                </div>
                
                {certificationNumberState && (
                    <div className="input-container flex gap-10">
                        <input
                            type='text'
                            name='setCertificationNumber'
                            className='input'
                            value={certificationNumber}
                            id='setCertificationNumber'
                            placeholder='인증번호'
                            onChange={(e) => setCertificationNumber(e.target.value)}
                        />
                        <button className='btn btn-width' onClick={verifyNumberHandler}>인증 번호 확인</button>
                    </div>
                )}
                
                {certificationNumberState && (
                    <div className='flex just-btw align-center'>
                        <p style={{color:"blue"}}>
                            {certificationMessage}
                        </p>
                        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                    </div>
                )}
                
                {emailError && <Error props={emailError} />}
            </div>
        </div>
    );
}
