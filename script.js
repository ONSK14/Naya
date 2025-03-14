// 预设用户名和密码（不能注册）
const users = {
    "xiaohei": { password: "xiaohei", remainingMessages: 10000 },
    "sun": { password: "sun", remainingMessages: 10000 }
    "userzG1aAq": { password: "jLvt@lPNUI", remainingMessages: 200 }
    "userJqdbpS": { password: "mJ#ElE2laN", remainingMessages: 200 }
    "userCpjjMq": { password: "gh!Sp!2Tk&", remainingMessages: 200 }
    "uservUAVlT": { password: "	Lq!9juJDr9", remainingMessages: 200 }
    "userwfGPTm": { password: "fh&e7!&eIa", remainingMessages: 200 }
    "userZAvPB5": { password: "	c8UE%2G!0A", remainingMessages: 200 }
    "userZ1mRz1": { password: "	IaGOh5@Zil", remainingMessages: 200 }
    "userR2Q7HP": { password: "	$MbqnmGIBe", remainingMessages: 200 }
    "userLFRmtP": { password: "	ETBkzkdjY2", remainingMessages: 200 }
};

// 检查用户是否已登录
function checkLogin() {
    let loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser && users[loggedInUser]) {
        showChatInterface(loggedInUser);
    }
}

// 登录功能
function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (users[username] && users[username].password === password) {
        localStorage.setItem("loggedInUser", username);
        localStorage.setItem("remainingMessages", users[username].remainingMessages);
        showChatInterface(username);
    } else {
        document.getElementById("login-error").style.display = "block";
    }
}

// 显示聊天界面并解锁输入框
function showChatInterface(username) {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("chat-container").style.display = "block";
    updateMessageQuota();
}

// 发送消息
function sendMessage() {
    let remainingMessages = localStorage.getItem("remainingMessages");

    if (remainingMessages > 0) {
        let input = document.getElementById("message-input");
        let message = input.value.trim();
        if (message !== "") {
            appendMessage("user-message", message);
            localStorage.setItem("remainingMessages", remainingMessages - 1);
            updateMessageQuota();
        }
        input.value = "";
    }
}

// 更新对话额度显示 & 禁用输入框
function updateMessageQuota() {
    let remainingMessages = localStorage.getItem("remainingMessages");
    if (remainingMessages <= 0) {
        document.getElementById("message-input").disabled = true;
        document.getElementById("send-button").disabled = true;
        alert("您的对话额度已用完。");
    } else {
        document.getElementById("message-input").disabled = false;
        document.getElementById("send-button").disabled = false;
    }
}

// 退出登录（清除本地存储）
function logout() {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("remainingMessages");
    location.reload();
}

// 页面加载时检查是否已登录
checkLogin();
