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
    let sessionUser = sessionStorage.getItem("loggedInUser");
    let inputContainer = document.getElementById("input-container");
    let inputField = document.getElementById("message-input");
    let sendButton = document.getElementById("send-button");
    let messageCountDisplay = document.getElementById("message-count");
    let loginContainer = document.getElementById("login-container");
    let chatContainer = document.getElementById("chat-container");
    let userStatus = document.getElementById("user-status");
    let logoutButton = document.getElementById("logout-button");

    if (!sessionUser) {
        inputContainer.style.display = "none";
        inputField.disabled = true;
        sendButton.disabled = true;
        messageCountDisplay.innerText = "未登录";
        userStatus.innerText = "";
        loginContainer.style.display = "block";
        chatContainer.style.display = "none";
        logoutButton.style.display = "none";
    } else {
        let userMessageCount = JSON.parse(sessionStorage.getItem("userMessageCount")) || {};
        let userLimit = users[sessionUser] ? users[sessionUser].messageLimit : 100;

        if (userMessageCount[sessionUser] >= userLimit) {
            inputField.disabled = true;
            sendButton.disabled = true;
            alert("您的消息额度已用完！");
        } else {
            inputField.disabled = false;
            sendButton.disabled = false;
        }
        loginContainer.style.display = "none";
        chatContainer.style.display = "block";
        inputContainer.style.display = "flex";
        logoutButton.style.display = "inline-block";
        userStatus.innerHTML = `已登录：${sessionUser} | 剩余消息：${userLimit - (userMessageCount[sessionUser] || 0)} / ${userLimit}`;
        logoutButton.style.display = "inline-block";
        updateMessageCountDisplay();
    }
}

// 显示剩余消息数（右上角）
function updateMessageCountDisplay() {
    let sessionUser = sessionStorage.getItem("loggedInUser");
    let messageCountDisplay = document.getElementById("message-count");
    if (!sessionUser || !messageCountDisplay) return;
    let userMessageCount = JSON.parse(sessionStorage.getItem("userMessageCount")) || {};
    let userLimit = users[sessionUser] ? users[sessionUser].messageLimit : 100;
    let remainingMessages = userLimit - (userMessageCount[sessionUser] || 0);
    messageCountDisplay.innerText = `剩余消息：${remainingMessages} / ${userLimit}`;
}

// 登录函数
function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (users[username] && users[username].password === password) {
        sessionStorage.setItem("loggedInUser", username);
        let userMessageCount = JSON.parse(sessionStorage.getItem("userMessageCount")) || {};
        if (!userMessageCount[username]) {
            userMessageCount[username] = 0;
        }
        sessionStorage.setItem("userMessageCount", JSON.stringify(userMessageCount));
        location.reload();
    } else {
        alert("用户名或密码错误！");
    }
}

// 发送消息
function sendMessage() {
    let sessionUser = sessionStorage.getItem("loggedInUser");
    if (!sessionUser) {
        alert("请先登录后再使用对话功能！");
        return;
    }
    let userMessageCount = JSON.parse(sessionStorage.getItem("userMessageCount")) || {};
    let userLimit = users[sessionUser] ? users[sessionUser].messageLimit : 100;
    if (!userMessageCount[sessionUser]) {
        userMessageCount[sessionUser] = 0;
    }
    if (userMessageCount[sessionUser] >= userLimit) {
        alert("您的消息额度已用完！");
        return;
    }
    userMessageCount[sessionUser]++;
    sessionStorage.setItem("userMessageCount", JSON.stringify(userMessageCount));
    updateMessageCountDisplay();
    document.getElementById("user-status").innerHTML = `已登录：${sessionUser} | 剩余消息：${userLimit - userMessageCount[sessionUser]} / ${userLimit}`;
}

// 退出登录
function logout() {
    sessionStorage.removeItem("loggedInUser");
    sessionStorage.removeItem("userMessageCount");
    location.reload();
}

// 监听回车事件，未登录时禁止发送消息
function handleKeyDown(event) {
    let sessionUser = sessionStorage.getItem("loggedInUser");
    if (!sessionUser) {
        alert("请先登录后再使用对话功能！");
        return;
    }
    if (event.key === "Enter") {
        sendMessage();
    }
}
