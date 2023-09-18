package org.sand.model.dto.user;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class SignupDTO {

    @NotBlank
    private String username;

    @NotBlank
    private String nickname;

    @NotBlank
    private String password;

}
