package com.jsp.jpa.model;

import com.jsp.jpa.common.Role;
import com.jsp.jpa.dto.AuthDto;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

@Entity(name = "member")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_idx")
    private int userIDX;

    @Column(name = "member_email", unique = true, nullable = false)
    private String userEmail; // Principal

    @Column(name = "member_pwd", nullable = false)
    private String userPW; // Credential

    @Column(name = "member_provider")
    @ColumnDefault("일반")
    private String provider;

    @Enumerated(EnumType.STRING)
    @Column(name = "member_role")
    private Role role; // 사용자 권한

    // == 생성 메서드 == //
    public static User registerUser(AuthDto.SignupDto signupDto) {
        User user = new User();

        user.userEmail = signupDto.getEmail();
        user.userPW = signupDto.getPassword();
        user.role = Role.USER;

        return user;
    }
}