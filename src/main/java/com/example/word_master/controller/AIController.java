package com.example.word_master.controller;

import com.example.word_master.dto.ChatRequest;
import com.example.word_master.dto.ChatResponse;
import com.example.word_master.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:63342")
public class AIController {
    private final AIService aiService;

    @Autowired
    public AIController(AIService aiService) {
        this.aiService = aiService;
    }
    //调用AI接口
    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> handleChat(@RequestBody ChatRequest chatRequest) {
        if (chatRequest.getMessage() == null || chatRequest.getMessage().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new ChatResponse("消息不能为空"));
        }
        String aiReply = aiService.getChatCompletion(chatRequest.getMessage());
        return ResponseEntity.ok(new ChatResponse(aiReply));
    }
}