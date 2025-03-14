document.addEventListener("DOMContentLoaded", function () {
    let loggedInUser = localStorage.getItem("loggedInUser");
    let inputField = document.getElementById("message-input");
    let sendButton = document.getElementById("send-button");
    let userMessageCount = JSON.parse(localStorage.getItem("userMessageCount")) || {};

    // 预设用户的最大消息额度
    const userMessageLimits = {
        "user1": 100,
        "user2": 200,
        "user3": 150,
        "user4": 300
    };

    // 检查用户是否已登录
    function checkLoginStatus() {
        if (!loggedInUser) {
            // 未登录时禁用输入框和发送按钮
            inputField.disabled = true;
            sendButton.disabled = true;

            // 禁止回车键发送消息
            inputField.addEventListener("keypress", function (event) {
                event.preventDefault();
            });

            // 禁止点击发送按钮
            sendButton.addEventListener("click", function (event) {
                event.preventDefault();
                alert("请先登录后再使用对话功能！");
            });
        } else {
            // 登录成功，检查消息配额
            let userLimit = userMessageLimits[loggedInUser] || 100; // 默认 100 条
            if (userMessageCount[loggedInUser] >= userLimit) {
                inputField.disabled = true;
                sendButton.disabled = true;
                alert("您的消息额度已用完！");
            } else {
                inputField.disabled = false;
                sendButton.disabled = false;
            }
        }
    }

    // 执行检查
    checkLoginStatus();
});

// 登录函数
function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    // 预设的用户名和密码（只能使用你提供的）
    const users = {
        "user1": "password1",
        "user2": "password2",
        "user3": "password3",
        "user4": "password4"
    };

    if (users[username] && users[username] === password) {
        localStorage.setItem("loggedInUser", username);
        location.reload(); // 刷新页面，使登录生效
    } else {
        alert("用户名或密码错误！");
    }
}

// 发送消息并记录消息数
function sendMessage() {
    let loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
        alert("请先登录后再使用对话功能！");
        return;
    }

    let userMessageCount = JSON.parse(localStorage.getItem("userMessageCount")) || {};
    let userMessageLimits = {
        "user1": 100,
        "user2": 200,
        "user3": 150,
        "user4": 300
    };

    let userLimit = userMessageLimits[loggedInUser] || 100; // 默认 100 条

    if (!userMessageCount[loggedInUser]) {
        userMessageCount[loggedInUser] = 0;
    }

    if (userMessageCount[loggedInUser] >= userLimit) {
        alert("您的消息额度已用完！");
        return;
    }

    userMessageCount[loggedInUser]++;
    localStorage.setItem("userMessageCount", JSON.stringify(userMessageCount));
    
    // 这里可以调用你的聊天 API 进行发送消息的逻辑
}

// 退出登录
function logout() {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userMessageCount");
    location.reload(); // 刷新页面，回到未登录状态
}
