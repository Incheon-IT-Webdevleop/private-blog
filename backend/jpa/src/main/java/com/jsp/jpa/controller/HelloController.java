package com.jsp.jpa.controller;

import com.jsp.jpa.common.JwtTokenProvider;
import com.jsp.jpa.dto.UserDto;
import com.jsp.jpa.model.User;
import com.jsp.jpa.repository.UserRepository;
import com.jsp.jpa.service.UserService;
import com.jsp.jpa.service.UserServiceImpl;
import com.jsp.jpa.vo.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mypage")
@RequiredArgsConstructor
@Slf4j
public class HelloController {

    private final UserServiceImpl userService;

    @GetMapping("/info")
    public ResponseEntity<UserDto> getUserInfo(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        log.info("Received request for user info. User: {}", userDetails.getUsername());
        UserDto userInfo = userService.getUserInfo(userDetails.getUsername());
        return ResponseEntity.ok(userInfo);
    }
}