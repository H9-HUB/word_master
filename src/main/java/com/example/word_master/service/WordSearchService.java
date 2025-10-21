package com.example.word_master.service;

import com.example.word_master.dto.WordSearchResultDTO;
import java.util.List;

// 单词搜索服务接口
public interface WordSearchService {

    // 根据关键词搜索单词，返回结果列表 DTO
    List<WordSearchResultDTO> search(String keyword);
}