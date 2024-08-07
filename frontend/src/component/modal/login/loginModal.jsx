import { useState } from 'react';
import './loginModal.css';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { initializeUser, setUser } from '../../../store/authSlice';

export default function LoginModal(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();

    const SubmitHandler = async (e) =>{
        e.preventDefault();
        setError("");

        try {
            // 아이디 비밀번호로 로그인 시도
            const res = await axios.post('/api/auth/login', {email, password}, {
                headers: {
                'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            // 로그인에 성공하면 헤더로 토큰이 넘어온다.
            const accessToken = res.headers['authorization'].split(' ')[1];
            localStorage.setItem('accessToken', accessToken);
            const user = res.data.user;
            // 전역 상태에도 user정보와 토큰을 저장한다
            dispatch(setUser({ user, token: accessToken }));
            dispatch(initializeUser({ user, token: accessToken }));
            
            //console.log("Dispatched setUser action"); // 디버깅용
            // 성공하면 이동해라

        } catch (e) {
        // 실패 시 처리 로직
        setError('아이디나 비밀번호를 확인해주세요.');
        console.error('Login error:', e);
        }
    }

    const findClickHandler = () => (
        <div>

        </div>
    )

    const signUpClickHandler = () => (
        <div>
            <signUpClickHandler />
        </div>
    )
        
    return (
        <div className="modal-overlay">
            {/* 로그인 영역(로그인 버튼까지) */}
            <div className="modal-content">
                <div className='title'>
                    <h2>로그인</h2>
                </div>
                <div className="input-group">
                    <form onSubmit={SubmitHandler}>
                        <div className="input-container">
                            <input type='email' name='email' className='input' value={email} id='email'
                                onChange={(e) => setEmail(e.target.value)} />
                            <label className={`label ${email ? 'shrink' : ''}`} htmlFor="email">이메일</label>
                        </div>
                        <div className="input-container">
                            <input type='password' name='password' className='input' value={password} id='password'
                                onChange={(e) => setPassword(e.target.value)} />
                            <label className={`label ${password ? 'shrink' : ''}`} htmlFor="password">비밀번호</label>
                        </div>
                        <div className='p-container'>
                            <div className='remember-container'>
                                <input type='checkbox' className='remember-me' id='rememberMe'></input>
                                <label htmlFor='rememberMe'>내 정보 저장</label>
                            </div>
                            <div className='p-contents'>
                                <p className='find' onClick={findClickHandler}>아이디 / 비밀번호 찾기</p>
                                <p onClick={signUpClickHandler}>회원가입</p>
                            </div>
                            
                        </div>
                        <button className='btn' type='submit'>로그인</button>
                    </form>
                    {error && (<div className='error'>{error}</div>)}
                </div>

            </div>
        </div>
    );
}
