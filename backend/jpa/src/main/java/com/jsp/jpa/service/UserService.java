package com.jsp.jpa.service;

import com.jsp.jpa.dto.AuthDto;
import com.jsp.jpa.dto.UserDto;
import org.springframework.stereotype.Service;

@Service
public interface UserService {
    // 회원가입
    public void registerUser(AuthDto.SignupDto signupDto);

    /**
     * 토큰으로 유저정보 가져오기
     * @param email
     * 토큰에 이메일값을 넣기 때문에
     */
    UserDto getUserInfo(String email);
}
