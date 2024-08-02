import { useState } from "react";
import axios from 'axios';
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { initializeUser, setUser } from "../../store/authSlice";

export default  function Login(){

    // 입력값들을 저장하기 위해 useState사용
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    // 서버나 유효성검사 결과 문제가 있을 때 에러문을 넣어주기 위한 값
    const [error, setError] = useState("");
    // 리덕스 상태관리를 위해 store에 정의한 슬라이스 함수들을 가져온다
    const dispatch = useDispatch();
      // 리엑트 라우터를 쓸 때 페이지 주소를 찾아주고 보내주는 역할
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
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
          navigate('/api/mypage/info');
        } catch (e) {
          // 실패 시 처리 로직
          setError('Login failed. Please check your credentials.');
          console.error('Login error:', e);
        }
      }

    return(
        <div>
            <form onSubmit={submitHandler}>
                <input 
                    type="text"
                    name="id"
                    placeholder="아이디"
                    value={id}
                    // 지금 이놈의 value를 보내라
                    onChange={(e)=>setId(e.target.value)} />
                <input 
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />
                <button type="submit">로그인</button>
            </form>
            {/* 에러가 났다면 에러를 보여줘라 */}
            {error && <p style={{color:"red"}}>{error}</p>}
        </div>
    )
}