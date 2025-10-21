export async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        alert('请输入用户名和密码');
        return;
    }

    try {
        const checkRes = await fetch(`http://localhost:8080/api/user/check?username=${username}`);
        const checkData = await checkRes.json();

        if (!checkData.exists) {
            const registerRes = await fetch('http://localhost:8080/api/user/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const registerData = await registerRes.json();
            if (!registerData.success) {
                alert(`注册失败: ${registerData.msg}`);
                return;
            }
        }

        const loginRes = await fetch('http://localhost:8080/api/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const loginData = await loginRes.json();

        if (loginData.success) {
            // 存储包含用户ID的完整信息
            localStorage.setItem('currentUser', JSON.stringify({
                id: loginData.userId, // 新增：存储用户ID
                username: loginData.username
            }));
            window.location.href = 'main.html'; // 登录成功，跳转到主页
        } else {
            alert('密码错误');
        }
    } catch (error) {
        console.error('登录/注册请求错误:', error);
        alert('网络错误或服务器无响应，请检查控制台日志');
    }
}