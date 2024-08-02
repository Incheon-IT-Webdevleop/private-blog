package com.jsp.jpa.model;

import com.jsp.jpa.common.Role;
import com.jsp.jpa.dto.AuthDto;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity(name = "user")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UserIDX")
    private int userIDX;

    @Column(name = "userID")
    private String userID;

    @Column(name = "UserName")
    private String userName;

    @Column(name = "UserTel")
    private int userTel;

    @Column(name = "userLevel")
    private String userLevel;

    @Column(name = "UserEmail")
    private String userEmail; // Principal

    @Column(name = "userPW")
    private String userPW; // Credential

    @Enumerated(EnumType.STRING)
    @Column(name = "UserRole")
    private Role role; // 사용자 권한

    // == 생성 메서드 == //
    public static User registerUser(AuthDto.SignupDto signupDto) {
        User user = new User();

        user.userID = signupDto.getId();
        user.userEmail = signupDto.getEmail();
        user.userPW = signupDto.getPassword();
        user.role = Role.USER;
        user.userName = signupDto.getName();
        user.userTel = signupDto.getTel();
        return user;
    }
}