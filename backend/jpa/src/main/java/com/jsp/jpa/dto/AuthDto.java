package com.jsp.jpa.dto;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 인증과정에서 필요한 DTO
 */
public class AuthDto {

    @Getter
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    public static class LoginDto {
        private String id;
        private String password;

        @Builder
        /**
         * 로그인할 때 필요하다
         */
        public LoginDto(String id, String password) {
            this.id = id;
            this.password = password;
        }
    }

    @Getter
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    /**
     * 회원가입할 때 필요하다
     */
    public static class SignupDto {
        private String id;
        private String name;
        private int tel;
        private String email;
        private String password;
        @Builder
        public SignupDto(String id, String name, String email, String password, int tel) {
            this.id = id;
            this.name = name;
            this.tel = tel;
            this.email = email;
            this.password = password;
        }

        public static SignupDto encodePassword(SignupDto signupDto, String encodedPassword) {
            SignupDto newSignupDto = new SignupDto();
            newSignupDto.email = signupDto.getEmail();
            newSignupDto.password = encodedPassword;
            return newSignupDto;
        }
    }

    @Getter
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    public static class TokenDto {
        private String accessToken;
        private String refreshToken;

        public TokenDto(String accessToken, String refreshToken) {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
        }
    }
}