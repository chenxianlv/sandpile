package org.sand.model.dto.user;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class ListUsersDTO {

    @NotBlank
    private String pattern;

}
