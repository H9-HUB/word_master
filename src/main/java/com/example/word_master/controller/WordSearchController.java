package com.example.word_master.controller;
import com.example.word_master.dto.WordSearchResultDTO;
import com.example.word_master.service.WordSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "http://localhost:63342")
public class WordSearchController {

    @Autowired
    private WordSearchService wordSearchService; // 注入单词搜索服务

    // 搜索单词接口
    @GetMapping("/words")
    public ResponseEntity<List<WordSearchResultDTO>> searchWords(@RequestParam String keyword) {
        // 检查关键词是否为空
        if (keyword == null || keyword.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        // 调用服务进行搜索
        List<WordSearchResultDTO> results = wordSearchService.search(keyword);
        // 返回搜索结果
        return ResponseEntity.ok(results);
    }
}