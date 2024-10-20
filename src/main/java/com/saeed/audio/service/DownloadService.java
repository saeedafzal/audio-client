package com.saeed.audio.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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

    public boolean downloadAudio(String out, String url) {
        if (out == null) {
            out = System.getProperty("user.home") + File.separator + "Music";
        }
        log.info("Downloading to: {}", out);

        try {
            ProcessBuilder builder = new ProcessBuilder("yt-dlp", "-o", out + "/%(title)s.%(ext)s", "-x", "--audio-format", "mp3", url);
            Process process = builder.start();

            InputStream inputStream = process.getInputStream();
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream));

            Thread downloadThread = Thread.ofVirtual().unstarted(() -> {
                String line;

                try {
                    while ((line = bufferedReader.readLine()) != null) {
                        log.debug(line);

                        // TODO: Send download progress to client
                        if (line.contains("[download]")) {
                            Pattern pattern = Pattern.compile("\\[download]\\s+(\\d+\\.\\d+)%");
                            Matcher matcher = pattern.matcher(line);
                            if (matcher.find()) {
                                String percentageStr = matcher.group(1);
                                double percentage = Double.parseDouble(percentageStr);
                                log.info("{}%", percentage);
                                // log.debug("{}%", percentage);
                            }
                        }
                    }
                } catch (IOException e) {
                    log.error("Error reading error stream: {}", e.getMessage(), e);
                }
            });

            downloadThread.start();
            int exitCode = process.waitFor();

            bufferedReader.close();
            inputStream.close();

            return exitCode == 0;
        } catch (IOException | InterruptedException e) {
            log.info("Error download url from yt-dlp: url={} msg={}", url, e.getMessage());
            return false;
        }
    }
}
