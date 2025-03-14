document.addEventListener("DOMContentLoaded", function () {
    checkLoginStatus();
    updateMessageCountDisplay();
});

// 预设的用户名和密码（只能使用你提供的）
const users = {
    "user1": { password: "password1", messageLimit: 100 },
    "user2": { password: "password2", messageLimit: 200 },
    "user3": { password: "password3", messageLimit: 150 },
    "user4": { password: "password4", messageLimit: 300 }
};

// 检查用户是否已登录
function checkLoginStatus() {
    let loggedInUser = localStorage.getItem("loggedInUser");
    let inputField = document.getElementById("message-input");
    let sendButton = document.getElementById("send-button");

    if (!loggedInUser) {
        inputField.disabled = true;
        sendButton.disabled = true;
    } else {
        let userMessageCount = JSON.parse(localStorage.getItem("userMessageCount")) || {};
        let userLimit = users[loggedInUser] ? users[loggedInUser].messageLimit : 100; // 默认 100 条

        if (userMessageCount[loggedInUser] >= userLimit) {
            inputField.disabled = true;
            sendButton.disabled = true;
            alert("您的消息额度已用完！");
        } else {
            inputField.disabled = false;
            sendButton.disabled = false;
        }
        updateMessageCountDisplay();
    }
}

// 显示剩余消息数
function updateMessageCountDisplay() {
    let loggedInUser = localStorage.getItem("loggedInUser");
    let messageCountDisplay = document.getElementById("message-count");

    if (!loggedInUser || !messageCountDisplay) return;

    let userMessageCount = JSON.parse(localStorage.getItem("userMessageCount")) || {};
    let userLimit = users[loggedInUser] ? users[loggedInUser].messageLimit : 100;
    let remainingMessages = userLimit - (userMessageCount[loggedInUser] || 0);

    messageCountDisplay.innerText = `剩余消息：${remainingMessages} / ${userLimit}`;
}

// 登录函数
function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (users[username] && users[username].password === password) {
        localStorage.setItem("loggedInUser", username);
        let userMessageCount = JSON.parse(localStorage.getItem("userMessageCount")) || {};

        if (!userMessageCount[username]) {
            userMessageCount[username] = 0;
        }

        localStorage.setItem("userMessageCount", JSON.stringify(userMessageCount));
        location.reload(); // 刷新页面，使登录生效
    } else {
        alert("用户名或密码错误！");
    }
}

// 发送消息
function sendMessage() {
    let loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
        alert("请先登录后再使用对话功能！");
        return;
    }

    let userMessageCount = JSON.parse(localStorage.getItem("userMessageCount")) || {};
    let userLimit = users[loggedInUser] ? users[loggedInUser].messageLimit : 100; // 默认 100 条

    if (!userMessageCount[loggedInUser]) {
        userMessageCount[loggedInUser] = 0;
    }

    if (userMessageCount[loggedInUser] >= userLimit) {
        alert("您的消息额度已用完！");
        return;
    }

    userMessageCount[loggedInUser]++;
    localStorage.setItem("userMessageCount", JSON.stringify(userMessageCount));
    updateMessageCountDisplay();
    
    // 这里可以调用你的聊天 API 进行发送消息的逻辑
}

// 退出登录
function logout() {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userMessageCount");
    location.reload(); // 刷新页面，回到未登录状态
}

// 监听回车事件，未登录时禁止发送消息
function handleKeyDown(event) {
    let loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
        alert("请先登录后再使用对话功能！");
        return;
    }

    if (event.key === "Enter") {
        sendMessage();
    }
}
