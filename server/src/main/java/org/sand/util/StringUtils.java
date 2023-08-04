package org.sand.util;

public class StringUtils {
    public static String[] splitFilePath(String filePath) {
        int index = filePath.lastIndexOf("/");
        if (index == -1) {
            return new String[]{"", filePath};
        }
        return new String[]{filePath.substring(0, index), filePath.substring(index + 1)};
    }
}
