package com.jsp.jpa.service;

import com.jsp.jpa.dto.AuthDto;
import com.jsp.jpa.dto.UserDto;
import com.jsp.jpa.model.User;
import com.jsp.jpa.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;

    @Transactional
    @Override
    /**
     * 회원가입
     */
    public void registerUser(AuthDto.SignupDto signupDto) {
        User user = User.registerUser(signupDto);
        userRepository.save(user);
    }

    @Override
    public UserDto getUserInfo(String email) {
        User user = userRepository.findByUserEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return new UserDto(user.getUserIDX(), user.getRole(), user.getUserEmail());
    }

    /**
     * 이메일 중복 검사
     *
     * @param email
     * @return
     */
    @Override
    public boolean checkEmailDuplication(String email) {
        Optional<User> user = userRepository.findByUserEmail(email);
        log.info("user : " + user);
        return user.isPresent();
    }


}
