import React, {useState} from "react";
import ReactQuill from "react-quill";
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import './css/diary.css'

function DiaryAdd(){
    const navigate = useNavigate();

    const onClick = () => {
        navigate("/diary");
    };

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
      
    
    return(
        <>
            <table className="add_table">
                <tr>
                    <th>날짜</th>
                    <td><input type="text" className="add_textBox"/></td>
                    <th>오늘의 기분</th>
                    <td>
                        <input type="radio" />
                        <input type="radio" />
                        <input type="radio" />
                        <input type="radio" />
                        <input type="radio" />
                        <input type="radio" />
                    </td>
                </tr>
                <tr>
                    <th>제목</th>
                    <td><input type="text" className="add_textBox" /></td>
                </tr>
            </table>

            <ReactQuill
                style={{ height: "650px"}}
                value={value || ""} 
                onChange={setValue}
                theme="snow" 
                modules={modules}
                formats={formats}
            />
            <div className="btn_container">
                <button className="insert_btn">등록하기</button>
                <button onClick={onClick} className="back_btn">뒤로가기</button>
            </div>
        </>
    )
}

export default DiaryAdd;