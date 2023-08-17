package org.sand.model.dto.note;

import lombok.Data;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Data
public class AddProjectDTO {

    @NotEmpty
    private String projectName;

    @NotNull
    private Integer openness;

    @NotNull
    private Long[] owners;

    private Long[] readers;

}
