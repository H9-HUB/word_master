package com.example.word_master.common;
// 用于规范后端接口的返回格式：包含状态码(code)、消息(msg)和数据(data)。
public class Result<T> {
    private int code; // 状态码，200 表示成功等
    private String msg; // 响应消息或错误信息
    private T data; // 响应的具体数据载体

    // Getter和Setter
    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    // 成功响应
    public static <T> Result<T> success(String msg) {
        Result<T> result = new Result<>();
        result.setCode(200);
        result.setMsg(msg);
        return result;
    }

    // 成功响应（有数据，默认消息）
    public static <T> Result<T> success(T data) {
        Result<T> result = new Result<>();
        result.setCode(200);
        result.setMsg("操作成功");
        result.setData(data);
        return result;
    }

    // 成功响应（有数据，自定义消息）
    public static <T> Result<T> success(T data, String msg) {
        Result<T> result = new Result<>();
        result.setCode(200);
        result.setMsg(msg);
        result.setData(data);
        return result;
    }

    // 错误响应（自定义状态码和消息）
    public static <T> Result<T> error(int code, String msg) {
        Result<T> result = new Result<>();
        result.setCode(code);
        result.setMsg(msg);
        return result;
    }

    // 失败响应
    public static <T> Result<T> fail(String msg) {
        return error(500, msg);
    }
}