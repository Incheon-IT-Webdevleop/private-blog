import { useState } from 'react';
import './loginModal.css';
import { useDispatch } from 'react-redux';
import axios from 'axios';

export default function LoginModal(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();

    const SubmitHandler = async (e) =>{
        e.preventEvent();
        setError("");

        try {
            // 아이디 비밀번호로 로그인 시도
            const res = await axios.post('/api/auth/login', {id, password}, {
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
        
    return(
        <div className='container overlay'>
        {/* 로그인 폼같은 input ui */}
            <div className="input-gropu">
                <form onSubmit={SubmitHandler}>
                    <input type='email' name='text' className='input' value={email} id='email'
                        onChange={(e) => setEmail(e.target.value)}/>
                    <label className={`label ${email ? 'shrink' : ''}`}>이메일</label>
                    <input type='password' name='text' className='input' value={password} id='password'
                        onChange={(e) => setPassword(e.target.value)}/>
                    <label className={`label ${password ? 'shrink' : ''}`}>비밀번호</label>
                    <button type='submit'>로그인</button>
                </form>
                {error && (<div className='error'>{error}</div>)}
            </div>
        </div>
    )
}