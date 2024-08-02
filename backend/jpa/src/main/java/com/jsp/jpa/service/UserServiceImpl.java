package com.jsp.jpa.service;

import com.jsp.jpa.dto.AuthDto;
import com.jsp.jpa.dto.UserDto;
import com.jsp.jpa.model.User;
import com.jsp.jpa.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
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
    public UserDto getUserInfo(String id) {
        User user = userRepository.findByUserID(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + id));

        return new UserDto(user.getUserIDX(), user.getRole(), user.getUserID());
    }


}
