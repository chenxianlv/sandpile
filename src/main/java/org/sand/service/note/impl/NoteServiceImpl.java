package org.sand.service.note.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.apache.commons.net.ftp.FTPClient;
import org.sand.mapper.note.NoteMapper;
import org.sand.model.po.note.NotePO;
import org.sand.service.note.NoteService;
import org.sand.util.FTPUtils;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class NoteServiceImpl extends ServiceImpl<NoteMapper, NotePO> implements NoteService {

    private final FTPUtils ftpUtils;

    public NoteServiceImpl(FTPUtils ftpUtils) {
        this.ftpUtils = ftpUtils;
    }

    @Override
    public String getNoteText(Long id) throws IOException {
        NotePO notePO = this.getById(id);
        FTPClient ftpClient = ftpUtils.connectFtp();
        String text = ftpUtils.readFile(ftpClient, notePO.getFilePath());
        ftpUtils.closeFtpClient(ftpClient);
        return text;

    }

}
