package com.example.word_master.service.impl;

import com.example.word_master.entity.User;
import com.example.word_master.mapper.UserMapper;
import com.example.word_master.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    /**
     * 用户注册
     */
    @Override
    public boolean register(User user) {
        // 检查用户名是否已存在
        if (findByUsername(user.getUsername()) != null) {
            return false;
        }
        return userMapper.insert(user) > 0;
    }

    /**
     * 根据用户名查找用户
     */
    @Override
    public User findByUsername(String username) {
        return userMapper.selectByUsername(username);
    }

    /**
     * 更新最后登录时间
     */
    @Override
    public void updateLastLogin(String username) {
        userMapper.updateLastLogin(username);
    }

    /**
     * 检查用户名是否存在
     */
    @Override
    public boolean checkUsername(String username) {
        // 复用findByUsername方法，避免重复查询
        return findByUsername(username) != null;
    }

    public int updatePassword(Integer userId, String oldPassword, String newPassword) {
        // 该方法对应 XML 中的 update 语句，会同时检查用户ID和旧密码。
        int updatedRows = userMapper.updatePassword(userId, oldPassword, newPassword);
        if (updatedRows > 0) {
            return 1; // 成功更新
        }
        // 先检查用户ID是否存在
        User user = userMapper.selectById(userId);
        if (user == null) {
            return -1; // 用户不存在
        }
        // 如果用户存在，但更新行数为0，则说明是旧密码错误。
        if (!user.getPassword().equals(oldPassword)) {
            return 0; // 旧密码错误
        }
        return -2;
    }
    @Override
    public int updateUsername(Integer userId, String newUsername) {
        // 1. 检查用户是否存在
        User user = userMapper.selectById(userId);
        if (user == null) {
            return -1; // 用户不存在
        }

        // 2. 检查新用户名是否已被占用
        User existingUser = userMapper.selectByUsername(newUsername);
        if (existingUser != null && !existingUser.getId().equals(userId)) {
            return 0; // 用户名已被占用
        }

        // 3. 执行更新
        User userToUpdate = new User();
        userToUpdate.setId(userId);
        userToUpdate.setUsername(newUsername);

        int rows = userMapper.updateUsername(userToUpdate);

        return rows > 0 ? 1 : -2; // 1: 成功; -2: 更新失败
    }
}