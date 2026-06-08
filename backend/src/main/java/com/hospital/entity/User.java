package com.hospital.entity;

import com.hospital.entity.enums.Role;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Set;

@Data
@EqualsAndHashCode(callSuper = true)
public class User extends BaseEntity {
    private String username;
    private String password;
    private String name;
    private String phone;
    private String email;
    private String idCard;
    private Set<Role> roles;
    private boolean enabled = true;
}
