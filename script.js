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
    let userStatus = document.getElementById("user-status");
    let logoutButton = document.getElementById("logout-button");
    let loginContainer = document.getElementById("login-container");
    let chatContainer = document.getElementById("chat-container");
    let inputContainer = document.getElementById("input-container");

    if (!sessionUser) {
        userStatus.innerHTML = "未登录";
        logoutButton.style.display = "none";
        loginContainer.style.display = "block";
        chatContainer.style.display = "none";
        inputContainer.style.display = "none";
    } else {
        let userMessageCount = JSON.parse(sessionStorage.getItem("userMessageCount")) || {};
        let userLimit = users[sessionUser] ? users[sessionUser].messageLimit : 100;
        userStatus.innerHTML = `已登录：${sessionUser} | 剩余消息：${userLimit - (userMessageCount[sessionUser] || 0)} / ${userLimit}`;
        logoutButton.style.display = "inline-block"; // **确保退出按钮正确显示**
        loginContainer.style.display = "none"; // **隐藏登录界面**
        chatContainer.style.display = "block"; // **显示聊天界面**
        inputContainer.style.display = "flex"; // **确保输入框可见**
        updateMessageCountDisplay();
    }
}


// 更新剩余消息数
function updateMessageCountDisplay() {
    let sessionUser = sessionStorage.getItem("loggedInUser");
    let messageCountDisplay = document.getElementById("message-count");
    if (!sessionUser || !messageCountDisplay) return;
    let userMessageCount = JSON.parse(sessionStorage.getItem("userMessageCount")) || {};
    let userLimit = users[sessionUser] ? users[sessionUser].messageLimit : 100;
    let remainingMessages = userLimit - (userMessageCount[sessionUser] || 0);
    messageCountDisplay.innerText = `剩余消息：${remainingMessages} / ${userLimit}`;
}

// 登录功能
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

// 退出登录功能
function logout() {
    sessionStorage.removeItem("loggedInUser");
    sessionStorage.removeItem("userMessageCount");
    location.reload();
}

// 发送消息功能
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
