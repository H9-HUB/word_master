CREATE DATABASE word_master;
USE word_master;
--建立用户表
CREATE TABLE user (
                      `id` int NOT NULL AUTO_INCREMENT COMMENT '用户ID',
                      `username` varchar(50) NOT NULL COMMENT '用户名',
                      `password` varchar(100) NOT NULL COMMENT '加密后的密码',
                      `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                      `last_login` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '最后登录时间',
                      PRIMARY KEY (`id`),
                      UNIQUE KEY `uk_username` (`username`) -- 确保用户名唯一
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 建立四级表
CREATE TABLE word_cet4 (
                           id BIGINT AUTO_INCREMENT,
                           word VARCHAR(50),
                           phonetic VARCHAR(100),
                           meaning VARCHAR(200),
                           example VARCHAR(300),
                           level VARCHAR(20) DEFAULT 'level4',
                           PRIMARY KEY (id),
                           INDEX idx_word (word)
);
--建立六级表
CREATE TABLE word_cet6 (
                           id BIGINT AUTO_INCREMENT,
                           word VARCHAR(50),
                           phonetic VARCHAR(100),
                           meaning VARCHAR(200),
                           example VARCHAR(300),
                           level VARCHAR(20) DEFAULT 'level4',
                           PRIMARY KEY (id),
                           INDEX idx_word (word)
);

--建立用户学习记录表
CREATE TABLE user_learning_record (
                            id INT AUTO_INCREMENT,
                            user_id INT,
                            word_id INT,
                            status VARCHAR(20) DEFAULT 'learning',
                            learn_date DATE,
                            proficiency DECIMAL(5,2) DEFAULT 0.00,
                            correct_count INT DEFAULT 0,
                            incorrect_count INT DEFAULT 0,
                            last_review_date DATETIME,
                            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                            level VARCHAR(10),
                            PRIMARY KEY (id),
                            UNIQUE KEY uk_user_cet4 (user_id, word_id)
);
--建立
CREATE TABLE word_vocabulary (
                                 id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
                                 word VARCHAR(50) NOT NULL COMMENT '单词',
                                 phonetic VARCHAR(100) DEFAULT '' COMMENT '音标',
                                 meaning TEXT NOT NULL COMMENT '释义',
                                 example TEXT COMMENT '例句', -- 移除TEXT字段的默认值
                                 level VARCHAR(10) NOT NULL COMMENT '单词等级（cet4/cet6）',
                                 create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                 update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                                 UNIQUE KEY uk_word_level (word, level) COMMENT '避免同一单词在同一等级重复'
) COMMENT '单词统一表';

--把四六级的表合并
INSERT INTO word_vocabulary (word, phonetic, meaning, example, level)
SELECT
    word,               -- 原四级表的单词
    phonetic,           -- 原四级表的音标
    meaning,            -- 原四级表的释义
    IFNULL(example, ''),-- 处理NULL值（转为空字符串）
    'level4'              -- 标记为四级
FROM word_cet4
-- 若存在重复的“单词+等级”，则更新其他字段
    ON DUPLICATE KEY UPDATE
                         phonetic = VALUES(phonetic),
                         meaning = VALUES(meaning),
                         example = VALUES(example);

INSERT INTO word_vocabulary (word, phonetic, meaning, example, level)
SELECT
    word,               -- 原六级表的单词
    phonetic,           -- 原六级表的音标
    meaning,            -- 原六级表的释义
    IFNULL(example, ''),-- 处理NULL值（转为空字符串）
    'level6'              -- 标记为四级
FROM word_cet6
-- 若存在重复的“单词+等级”，则更新其他字段
    ON DUPLICATE KEY UPDATE
                         phonetic = VALUES(phonetic),
                         meaning = VALUES(meaning),
                         example = VALUES(example);

