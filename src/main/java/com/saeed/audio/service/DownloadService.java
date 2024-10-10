package com.saeed.audio.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@Slf4j
public class DownloadService {

    public boolean hasYtDlp() {
        try {
            ProcessBuilder builder = new ProcessBuilder("yt-dlp", "--version");
            Process process = builder.start();
            return 0 == process.waitFor();
        } catch (IOException | InterruptedException e) {
            log.info("Error checking yt-dlp version: {}", e.getMessage());
            return false;
        }
    }
}
