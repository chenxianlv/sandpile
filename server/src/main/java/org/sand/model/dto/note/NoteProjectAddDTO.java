package org.sand.model.dto.note;

import lombok.Data;

import javax.validation.constraints.NotEmpty;

@Data
public class NoteProjectAddDTO {

    @NotEmpty
    private String projectName;

}
