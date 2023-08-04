package org.sand.model.dto.note;

import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class GetNoteTextDTO {

    @NotNull
    private Long id;

}
