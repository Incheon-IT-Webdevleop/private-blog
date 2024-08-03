import React from 'react';
import { NavLink } from 'react-router-dom';
import '../sidebar/sidebar.css'; // CSS 파일을 추가합니다.

export default function SideBar() {
    return (
        <div className="container">
            <div className="sidebar">
                <p>Private Blog</p>
                <nav>
                    <NavLink to="/movie" activeClassName="active-link">영화</NavLink>
                </nav>
            </div>
        
        </div>
    );
}
