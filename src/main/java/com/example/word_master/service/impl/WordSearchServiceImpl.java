package com.example.word_master.service.impl;

import com.example.word_master.dto.WordSearchResultDTO;
import com.example.word_master.entity.WordVocabulary;
import com.example.word_master.mapper.WordVocabularyMapper;
import com.example.word_master.service.WordSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WordSearchServiceImpl implements WordSearchService {

    @Autowired
    private WordVocabularyMapper wordVocabularyMapper; // 注入统一的Mapper

    @Override
    public List<WordSearchResultDTO> search(String keyword) {
        String searchKeyword = "%" + keyword + "%";

        // 直接调用统一Mapper的搜索方法，一次查询所有等级的单词
        List<WordVocabulary> results = wordVocabularyMapper.searchWords(searchKeyword);

        // 转换为DTO并返回，level字段直接从表中获取
        return results.stream().map(word -> {
            WordSearchResultDTO dto = new WordSearchResultDTO();
            dto.setWord(word.getWord());
            dto.setPhonetic(word.getPhonetic());
            dto.setMeaning(word.getMeaning());
            dto.setLevel(word.getLevel().toUpperCase());
            return dto;
        }).collect(Collectors.toList());
    }
}