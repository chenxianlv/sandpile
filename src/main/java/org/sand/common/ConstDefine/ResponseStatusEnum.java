package org.sand.common.ConstDefine;

import lombok.Getter;

@Getter
public enum ResponseStatusEnum {

    SUCCESS(1), ERROR(0);

    private final Integer value;

    ResponseStatusEnum(Integer value){
        this.value = value;
    }

}
