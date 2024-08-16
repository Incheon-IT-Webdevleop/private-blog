import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import './css/diary.css';
import Modal from './diaryModal';
import { useSelector } from 'react-redux';
import axios from '../../api/axiosConfig';

function Diary() {
  const [value, setValue] = useState(new Date()); // 초기값은 현재 날짜
  const token = useSelector((state) => state.auth.token);
  const user = useSelector(state => state.auth.user);
  const [diary_date, setDiary_date] = useState();
  const [diary_emoji, setDiary_emoji] = useState();
  const [diary_title, setDiary_title] = useState();
  const [diary_content, setDiary_content] = useState();

  const navigate = useNavigate();
  
  const user_idx = user.idx;

  useEffect(()=>{
    getUser();
  },[token]);
     

// 유저 정보 찾기
const getUser = async (token) => {
  if(token === null){
    return;
  }
  try{
    const response = await axios.get('/api/auth/diary', user_idx, {
      headers: {
        // 토큰은 기본적으로 헤더에 Authorization이라는 이름으로
        // 토큰앞에 `Bearer `을 붙혀서 보내줘야한다
        'Authorization': `Bearer ${token}`
      },
      withCredentials: true
    });
    if (response.status === 200){
      const user = response.data;
      return user;
    }
  }catch(error){
    return null;
  }
}

console.log(token);

  const onChange =(date) =>{
    setValue(date);
    // handeSelect(date);
    
  }
  const onClcik = () => {
    navigate("/diaryadd");
  };

  // 일기 작성 날짜 리스트
  const dayList = [
    '2024-08-05',
    '2024-08-07'
  ];

  // 각 날짜 타일에 컨텐츠 추가
  const addContent = ({ date }) => {
    // 해당 날짜(하루)에 추가할 컨텐츠의 배열
    const contents = [];

    // date(각 날짜)가  리스트의 날짜와 일치하면 해당 컨텐츠(이모티콘) 추가
    if (dayList.find((day) => day === moment(date).format('YYYY-MM-DD'))) {
      contents.push(
        <>
          <img className="diaryImg" src="https://cdn-icons-png.flaticon.com/128/983/983048.png"></img>
        </>
      );
    }
    return <div>{contents}</div>; // 각 날짜마다 해당 요소가 들어감
  };
  
  return (
    <div className='container'>
      
      <button onClick={onClcik} className="add_btn">일정추가</button>
      <div className='test2'>
        <Calendar 
          onChange={onChange} // 선택에 따라 value 변경하는 함수(setValue의 역할)
          value={value} // 선택한 날짜 Date 형태
          next2Label={null} // 년 단위 이동 버튼
          prev2Label={null} // 년 단위 이동 버튼
          tileContent={addContent} // 날짜 칸에 보여지는 컨텐츠
          showNeighboringMonth={false} // 앞뒤 달의 이어지는 날짜 보여주기 여부
          formatDay={(locale, date) => moment(date).format("D")} // '일'자 생략
        />
        <div className='test'>
            {/* {moment(value).format("YYYY년 MM월 DD일")}  */}
            <Modal date={value}/>
        </div>
      </div>

    </div>
  );
}

export default Diary;
