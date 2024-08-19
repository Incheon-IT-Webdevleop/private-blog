import React from 'react';

export default function SocialLoginButton({ provider, imgSrc, onClick }) {
    return (
        <button className="social-btn" onClick={onClick}>
            <img src={imgSrc} alt={`${provider} Login`} className="social-icon" />
        </button>
    );
}
