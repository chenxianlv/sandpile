package org.sand.mapper.note;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.sand.model.po.note.NotePO;

@Mapper
public interface NoteMapper extends BaseMapper<NotePO> {
}
