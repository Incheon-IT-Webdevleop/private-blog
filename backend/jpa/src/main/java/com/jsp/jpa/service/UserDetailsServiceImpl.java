package com.jsp.jpa.service;

import com.jsp.jpa.model.User;
import com.jsp.jpa.repository.UserRepository;
import com.jsp.jpa.vo.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;


    @Override
    public UserDetailsImpl loadUserByUsername(String id) throws UsernameNotFoundException {
        log.info("아이디 : " + id);
        User findUser = userRepository.findByUserID(id)
                .orElseThrow(() -> new UsernameNotFoundException("Can't find user with this email. -> " + id));

        if(findUser != null){
            UserDetailsImpl userDetails = new UserDetailsImpl(findUser);
            return  userDetails;
        }

        return null;
    }
}
