package org.sand.utils;

import org.springframework.beans.BeanUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Supplier;

public class BeanCopyUtils extends BeanUtils {
    /**
     * 集合数据的拷贝
     * @param sources: 数据源类
     * @param target: 目标类::new 
     * eg: BeanCopyUtil.copyListProperties(selectList,UserInfo::new);
     * @return
     */
    public static <S, T> List<T> copyListProperties(List<S> sources, Supplier<T> target, String... ignoreProperties) {
        List<T> list = new ArrayList<>();
        sources.forEach(v->{
            T t = target.get();
            copyProperties(v, t, ignoreProperties);
            list.add(t);
        });
        return list;
    }
}
