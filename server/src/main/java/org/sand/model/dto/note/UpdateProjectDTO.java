package org.sand.model.dto.note;

import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class UpdateProjectDTO {

    @NotNull
    private Long id;

    private String projectName;

    private Integer openness;

    private Long[] owners;

    private Long[] readers;

}
