import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector(state => state.auth.user)
  
  useEffect(() => {

    fetchUserInfo();
    console.log(user)
  }, [token]);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('/api/mypage/info', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log("토큰으로 받아온 데이터 : " + response.data);
      setUserInfo(response.data);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  };

  return (
    <div>
      <h1>마이페이지</h1>
      {/* <p>이메일: {userInfo.idx}</p> */}
      {/* 기타 사용자 정보 표시 */}
    </div>
  );
};

export default MyPage;
