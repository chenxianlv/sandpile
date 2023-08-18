package org.sand.model.vo.user;

import lombok.Data;

@Data
public class UserLoginVO {

    private Long id;

    private String userName;

    private String token;

    private Long[] authList;

}
