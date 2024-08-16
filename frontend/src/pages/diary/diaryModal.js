import React from 'react';
import './css/modal.css';

function Modal(props){
    const dateFormat = props.date.toLocaleString("ko-KR");
    return(
        <div className="box">
            {dateFormat}
        </div>
    )
}

export default Modal;