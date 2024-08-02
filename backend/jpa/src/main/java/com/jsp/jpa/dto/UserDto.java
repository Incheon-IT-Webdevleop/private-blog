package com.jsp.jpa.dto;

import com.jsp.jpa.common.Role;
import lombok.Data;

@Data
public class UserDto {
    private int idx;
    private String id;
    private Role role;

    public UserDto(int idx, Role role, String id) {
        this.idx = idx;
        this.role = role;
        this.id = id;
    }

    // getters and setters
}