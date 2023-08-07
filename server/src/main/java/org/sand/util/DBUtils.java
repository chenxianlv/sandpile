package org.sand.util;

import lombok.AllArgsConstructor;
import org.sand.model.po.common.BasicTablePO;
import org.sand.model.po.user.UserPO;
import org.sand.service.user.UserService;
import org.springframework.stereotype.Component;

import java.security.Principal;
import java.sql.Timestamp;
import java.util.Calendar;
import java.util.TimeZone;

@Component
@AllArgsConstructor
public class DBUtils {

    private final UserService userService;

    public void updateCreateInfo(BasicTablePO po, Principal principal) {
        if (principal != null) {
            UserPO userPO = userService.getByUserAccount(principal.getName());
            po.setCreateUserId(userPO.getId());
        } else {
            po.setCreateUserId(0L);
        }

        po.setCreateTime(new Timestamp(getCurrentUTCTime()));

    }

    public void updateUpdateInfo(BasicTablePO po, Principal principal) {
        if (principal != null) {
            UserPO userPO = userService.getByUserAccount(principal.getName());
            po.setUpdateUserId(userPO.getId());
        } else {
            po.setCreateUserId(0L);
        }

        po.setUpdateTime(new Timestamp(new java.util.Date().getTime()));

    }

    private Long getCurrentUTCTime() {
        System.out.println(Calendar.getInstance(TimeZone.getTimeZone("UTC")).getTimeInMillis());

        return Calendar.getInstance(TimeZone.getTimeZone("UTC")).getTimeInMillis();
    }

}
