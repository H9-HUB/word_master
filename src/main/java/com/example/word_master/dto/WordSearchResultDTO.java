package com.example.word_master.dto;

// 单词搜索结果数据对象
public class WordSearchResultDTO {
    private String word; // 单词本身
    private String phonetic; // 音标
    private String meaning; // 单词释义
    private String level; // 单词级别（level4/level6）
    private Integer id;

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getWord() { return word; }
    public void setWord(String word) { this.word = word; }
    public String getPhonetic() { return phonetic; }
    public void setPhonetic(String phonetic) { this.phonetic = phonetic; }
    public String getMeaning() { return meaning; }
    public void setMeaning(String meaning) { this.meaning = meaning; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
}