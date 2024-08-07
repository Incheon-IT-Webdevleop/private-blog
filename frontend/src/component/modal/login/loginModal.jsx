import { useState } from 'react';
import './loginModal.css';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { initializeUser, setUser } from '../../../store/authSlice';
import FindModal from '../find/findModal';
import SignUpModal from '../signup/signupModal';

export default function LoginModal() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [modalType, setModalType] = useState(null); // 모달 타입 상태 추가
    const dispatch = useDispatch();

    const submitHandler = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axios.post('/api/auth/login', { email, password }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            const accessToken = res.headers['authorization'].split(' ')[1];
            localStorage.setItem('accessToken', accessToken);
            const user = res.data.user;
            dispatch(setUser({ user, token: accessToken }));
            dispatch(initializeUser({ user, token: accessToken }));
            console.log("로그인성공")
        } catch (e) {
            setError('아이디나 비밀번호를 확인해주세요.');
            console.error('Login error:', e);
        }
    }

    const findClickHandler = () => setModalType('find');
    const signUpClickHandler = () => setModalType('signup');
    const closeModal = () => setModalType(null);

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className='title'>
                    <h2>로그인</h2>
                </div>
                <div className="input-group">
                    <form onSubmit={submitHandler}>
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
                                <p className='find' onClick={findClickHandler}>비밀번호 찾기</p>
                                <p onClick={signUpClickHandler}>회원가입</p>
                            </div>
                        </div>
                        <button className='btn width-100' type='submit'>로그인</button>
                    </form>
                    {error && (<div className='error'>{error}</div>)}
                </div>
            </div>
            {modalType === 'find' && <FindModal onClose={closeModal} />}
            {modalType === 'signup' && <SignUpModal onClose={closeModal} />}
        </div>
    );
}
