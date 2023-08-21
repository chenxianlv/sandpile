package org.sand.model.dto.user;

import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class ListUsersDTO {

    @NotNull
    private String pattern;

}
