package com.example.word_master.dto;
import lombok.Data;
// 用户学习统计摘要数据对象
@Data
public class UserStatsSummary {
    private Integer totalLearned; // 总学习过的唯一单词数
    private Integer todayLearnedWords; // 今日学习的新单词/复习单词数
    private Integer streakDays; // 连续学习天数
    private Integer level4Count; // 四级词汇学习总数
    private Integer level6Count; // 六级词汇学习总数
    private Integer learningCount; // 正在学习中的单词数（熟练度未满）
    private Integer reviewCount; // 复习模式下的正确次数统计
    private Integer spellingCount; // 拼写模式下的错误次数统计

    // 添加 getter 和 setter (如果使用了 @Data，可以省略手动添加)
    public Integer getTotalLearned() {
        return totalLearned;
    }

    public void setTotalLearned(Integer totalLearned) {
        this.totalLearned = totalLearned;
    }

    public Integer getTodayLearnedWords() {
        return todayLearnedWords;
    }

    public void setTodayLearnedWords(Integer todayLearnedWords) {
        this.todayLearnedWords = todayLearnedWords;
    }

    public Integer getStreakDays() {
        return streakDays;
    }

    public void setStreakDays(Integer streakDays) {
        this.streakDays = streakDays;
    }

    public Integer getLevel4Count() {
        return level4Count;
    }

    public void setLevel4Count(Integer level4Count) {
        this.level4Count = level4Count;
    }

    public Integer getLevel6Count() {
        return level6Count;
    }

    public void setLevel6Count(Integer level6Count) {
        this.level6Count = level6Count;
    }

    public Integer getLearningCount() {
        return learningCount;
    }

    public void setLearningCount(Integer learningCount) {
        this.learningCount = learningCount;
    }

    public Integer getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
    }

    public Integer getSpellingCount() {
        return spellingCount;
    }

    public void setSpellingCount(Integer spellingCount) {
        this.spellingCount = spellingCount;
    }
}