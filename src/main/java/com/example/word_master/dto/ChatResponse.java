package com.example.word_master.dto;
// 聊天响应数据对象
public class ChatResponse {
    private String reply;// AI 返回的回复消息

    public ChatResponse() {
    }

    public ChatResponse(String reply) {
        this.reply = reply;
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }
}