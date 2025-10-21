package com.example.word_master.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * 密码加密工具类（基于BCrypt）
 */
public class PasswordEncoderUtil {

    // 单例模式，避免重复创建编码器实例
    private static final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    /**
     * 加密密码
     * @param rawPassword 原始明文密码
     * @return 加密后的密码
     */
    public static String encode(String rawPassword) {
        return encoder.encode(rawPassword);
    }

    /**
     * 验证密码（明文与密文是否匹配）
     * @param rawPassword 原始明文密码
     * @param encodedPassword 加密后的密码（数据库中存储的）
     * @return 匹配返回true，否则false
     */
    public static boolean matches(String rawPassword, String encodedPassword) {
        return encoder.matches(rawPassword, encodedPassword);
    }
}