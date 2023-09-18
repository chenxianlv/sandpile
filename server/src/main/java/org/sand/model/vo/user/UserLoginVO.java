package org.sand.model.vo.user;

import lombok.Data;

@Data
public class UserLoginVO {

    private Long id;

    private String nickname;

    private String token;

    private Long[] authList;

}
