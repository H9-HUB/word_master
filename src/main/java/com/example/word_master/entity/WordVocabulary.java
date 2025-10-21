package com.example.word_master.entity;

//单词词汇实体类
public class WordVocabulary {
    private Long id;
    private String word;
    private String phonetic;
    private String meaning;
    private String example;
    private String level;

    public WordVocabulary() {}

    public WordVocabulary(String word, String phonetic, String meaning, String example, String level) {
        this.word = word;
        this.phonetic = phonetic;
        this.meaning = meaning;
        this.example = example;
        this.level = level;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getWord() {
        return word;
    }

    public void setWord(String word) {
        this.word = word;
    }

    public String getPhonetic() {
        return phonetic;
    }

    public void setPhonetic(String phonetic) {
        this.phonetic = phonetic;
    }

    public String getMeaning() {
        return meaning;
    }

    public void setMeaning(String meaning) {
        this.meaning = meaning;
    }

    public String getExample() {
        return example;
    }

    public void setExample(String example) {
        this.example = example;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }
}
