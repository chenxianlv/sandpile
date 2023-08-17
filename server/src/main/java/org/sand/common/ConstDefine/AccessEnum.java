package org.sand.common.ConstDefine;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum AccessEnum {
    EDIT_OWNED_PROJECT(1L),
    EDIT_ALL_PROJECT(2L),
    READ_OWNED_PROJECT(3L),
    READ_ALL_PROJECT(4L),
    ADD_PROJECT(5L),
    LIST_PROJECT(6L);

    private final Long id;
}
