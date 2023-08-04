package org.sand.service.note.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.apache.commons.net.ftp.FTPClient;
import org.sand.mapper.note.NoteMapper;
import org.sand.model.po.note.NotePO;
import org.sand.service.note.NoteService;
import org.sand.util.FTPUtils;
import org.sand.util.StringUtils;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Objects;
import java.util.UUID;

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

    @Override
    public void setNoteText(Long id, String text) throws IOException {
        NotePO notePO = this.getById(id);
        FTPClient ftpClient = ftpUtils.connectFtp();
        String filePath = notePO.getFilePath();
        String[] splitPath = StringUtils.splitFilePath(filePath);

        ftpUtils.updateFileText(ftpClient, splitPath[0], splitPath[1], text);
    }

    @Override
    public NotePO create() throws IOException {
        FTPClient ftpClient = ftpUtils.connectFtp();
        String folderPath = "/"; // 暂时只创建在根目录
        String fileName = UUID.randomUUID() + ".md"; // 暂时只创建md文件

        ftpUtils.createFile(ftpClient, folderPath, fileName);
        ftpUtils.closeFtpClient(ftpClient);

        String filePath = (Objects.equals(folderPath, "/") ? "" : folderPath) + "/" + fileName;

        NotePO notePO = new NotePO();
        notePO.setFilePath(filePath);
        return notePO;
    }

}
