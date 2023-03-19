package org.sand.model.dto.note;

import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class NoteProjectDeleteDTO {

    @NotNull
    private Long id;

}
