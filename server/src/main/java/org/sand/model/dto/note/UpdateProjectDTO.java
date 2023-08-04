package org.sand.model.dto.note;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class UpdateProjectDTO {

    @NotNull
    private Long id;

    @NotBlank
    private String projectName;

}
