package com.saeed.audio.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import static java.util.Collections.emptyList;

@Controller
public class WebController {

    @GetMapping
    public String index(Model model) {
        model.addAttribute("playlists", emptyList());
        model.addAttribute("files", emptyList());
        return "dashboard";
    }
}
