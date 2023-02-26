import org.apache.commons.net.ftp.FTPClient;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.sand.Application;
import org.sand.utils.FTPUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.IOException;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = Application.class)
public class FTPTest {

    @Autowired
    private FTPUtils ftpUtils;

    @Test
    public void main() throws IOException {
        FTPClient ftpClient = ftpUtils.connectFtp();
        String text = ftpUtils.readFile(ftpClient, "./Sandpile/SSM框架.md");
        ftpUtils.closeFtpClient(ftpClient);
        System.out.println(text);
//        FTPClient ftpClient = ftpUtils.connectFtp();
//        System.out.println(ftpClient.makeDirectory("/test"));
//        System.out.println(ftpClient.getDataConnectionMode());
//        System.out.println(ftpClient.listFiles().length);
//        System.out.println(ftpClient.listFiles("/Sandpile")[0].getName());

//        final List<String> zip = ftpUtils.getFileNameList(ftpClient, "/Sandpile");
//        System.out.println(zip);

//        ftpUtils.closeFtpClient(ftpClient);

     /*   FTPClient ftpClient = ftpUtils.loginFTP();
        final boolean zip = ftpUtils.changeWorkingDirectory(ftpClient,"zip");
        System.out.println(zip);
        //ftpClient.enterRemotePassiveMode();
        ftpClient.enterLocalActiveMode();
        final FTPFile[] ftpFiles = ftpClient.listFiles();
        Arrays.stream(ftpFiles).forEach(System.out::println);

        */

        // final List<String> strings = ftpUtils.showPatternFiles("zip", "a", "txt");
        // System.out.println(strings);
    }
}
