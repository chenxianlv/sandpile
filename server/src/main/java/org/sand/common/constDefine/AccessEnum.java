package org.sand.common.constDefine;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum AccessEnum {
    LIST_USER_SUMMARIES(10001L),
    EDIT_OWNED_PROJECT(20001L),
    EDIT_ALL_PROJECT(20002L),
    READ_OWNED_PROJECT(20003L),
    READ_ALL_PROJECT(20004L),
    ADD_PROJECT(20005L),
    LIST_PROJECTS(20006L);

    private final Long id;
}
