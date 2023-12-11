const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatBox = document.querySelector(".chatbox");
const chatbotToggle = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".chatbot .close-btn");
const inputInitHeight = chatInput.scrollHeight;

let userMessage;
const API_KEY = "your API key"
const MODEL = "gpt-3.5-turbo"

const historyMessages = [];

const appendHistoryMessages = (role, content) => {
    historyMessages.push({
        role: role,
        content: content
    });
}

const resetHistoryMessages = () => {
    historyMessages = [];
}

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);

    let chatContent = 
        className === "outgoing" ? 
        `<p></p>` : 
        `<span class="material-symbols-outlined">smart_toy</span><p></p>`;

    chatLi.innerHTML = chatContent;

    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const generateResponse = (li, content) => {
    const message = [{
        role: "user",
        content: content
    }];
    const messages = [...historyMessages, ...message];

    const API_URI = "https://api.openai.com/v1/chat/completions";
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: MODEL,
            messages: messages,
        })
    }

    fetch(API_URI, requestOptions)
        .then(res => res.json())
        .then(data => {
            const response = data.choices[0].message.content;
            const el = li.querySelector("p");
            el.textContent = response;

            appendHistoryMessages("user", content);
            appendHistoryMessages("assistant", response);
        })
        .catch(error => {
            const el = li.querySelector("p");
            el.classList.add("error");
            el.textContent = error.message;
        })
        .finally(() => {
            chatBox.scrollTop = chatBox.scrollHeight;
        });
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    console.log(userMessage);

    if (!userMessage) {
        return;
    }

    li = createChatLi(userMessage, "outgoing");
    chatBox.appendChild(li);
    chatInput.value = "";
    chatInput.style.height = inputInitHeight + "px";
    chatBox.scrollTop = chatBox.scrollHeight;

    setTimeout(() => {
        li = createChatLi("Thingking...", "incoming");
        chatBox.appendChild(li);
        chatBox.scrollTop = chatBox.scrollHeight;

        generateResponse(li, userMessage);
    }, 0);
}

sendChatBtn.addEventListener("click", handleChat);
chatbotToggle.addEventListener("click", () => {
    document.body.classList.toggle("show-chatbot");
});
chatbotCloseBtn.addEventListener("click", () => {
    console.log("close");
    document.body.classList.remove("show-chatbot");
});

chatInput.addEventListener("input", () => {
    chatInput.style.height = inputInitHeight + "px";
    chatInput.style.height = chatInput.scrollHeight + "px";
});

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey /*&& window.innerWidth > 768*/) {
        e.preventDefault();
    }
});

chatInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter" && !e.shiftKey /*&& window.innerWidth > 768*/) {
        e.preventDefault();
        handleChat();
    }
});
