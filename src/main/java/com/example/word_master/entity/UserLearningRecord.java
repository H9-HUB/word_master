package com.example.word_master.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

//用户学习记录实体类
public class UserLearningRecord {
    private Integer id;
    private Integer userId;
    private Integer wordId;
    private String level;
    private String status;
    private LocalDate learnDate;
    private BigDecimal proficiency;
    private Integer correctCount;
    private Integer incorrectCount;
    private LocalDateTime lastReviewDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getWordId() {
        return wordId;
    }

    public void setWordId(Integer wordId) {
        this.wordId = wordId;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getLearnDate() {
        return learnDate;
    }

    public void setLearnDate(LocalDate learnDate) {
        this.learnDate = learnDate;
    }

    public BigDecimal getProficiency() {
        return proficiency;
    }

    public void setProficiency(BigDecimal proficiency) {
        this.proficiency = proficiency;
    }

    public Integer getCorrectCount() {
        return correctCount;
    }

    public void setCorrectCount(Integer correctCount) {
        this.correctCount = correctCount;
    }

    public Integer getIncorrectCount() {
        return incorrectCount;
    }

    public void setIncorrectCount(Integer incorrectCount) {
        this.incorrectCount = incorrectCount;
    }

    public LocalDateTime getLastReviewDate() {
        return lastReviewDate;
    }

    public void setLastReviewDate(LocalDateTime lastReviewDate) {
        this.lastReviewDate = lastReviewDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}