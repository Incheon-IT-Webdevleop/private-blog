import React, {useState} from "react";
import ReactQuill from "react-quill";
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import './css/diary.css'

import DateCalendar from './datePicker';
import QuillEditor from './QuillEditor';


function DiaryAdd(){
    // 테이블부분
    // 선택된 라디오 버튼의 값을 상태로 관리
    const [selectedValue,setSelectValue] =useState('');

    // 라디오 버튼의 값을 변경하는 핸들러
    const handleChange = (event) => {
        setSelectValue(event.target.value);
    }

    // 글 작성부분(react-quill 에디터 사용)
    const [value, setValue] = useState('');
    // 사용하고 싶은 옵션, 나열 되었으면 하는 순서대로 나열
    const toolbarOptions = [
        ["link", "image", "video"],
        [{ header: [1, 2, 3, false] }],
        ["bold"],
    ]; 

    // 옵션에 상응하는 포맷, 추가해주지 않으면 text editor에 적용된 스타일을 볼수 없음
    const formats = [
        "header",
        "font",
        "size",
        "bold",
        "link",
        "image",
        "video",
        "width",
    ];

    const modules = {
        toolbar: {
          container: toolbarOptions,
        },
    }; 
    
    
    // 버튼부분
    const navigate = useNavigate();

    const backClick = () => {
        navigate("/diary");
    };

    return(
        <>
            <table className="add_table">
                <tr>
                    <th>날짜</th>
                    <td><DateCalendar/></td>
                    <th>오늘의 기분</th>
                    <td>
                        {/* <input type="radio" name="today_mood" /> */}
                        {['https://cdn-icons-png.flaticon.com/128/983/983018.png','https://cdn-icons-png.flaticon.com/128/983/983031.png','https://cdn-icons-png.flaticon.com/128/982/982995.png','https://cdn-icons-png.flaticon.com/128/983/983005.png','https://cdn-icons-png.flaticon.com/128/983/983022.png'].map((option, index) => (
                            <>
                                <input
                                    className="mood_icon-div"
                                    type="radio"
                                    name="today_mood"
                                    id={`${index}`}
                                />
                                <label className="mood_icon-label" htmlFor={`${index}`}><img src={option}/></label>
                            </>
                        ))}
                    </td>
                </tr>
                <tr>
                    <th>제목</th>
                    <td><input type="text" className="add_textBox" /></td>
                </tr>
            </table>

            <QuillEditor/>
            <div className="btn_container">
                <button className="insert_btn">등록하기</button>
                <button onClick={backClick} className="back_btn">뒤로가기</button>
            </div>
        </>
    )
}

export default DiaryAdd;