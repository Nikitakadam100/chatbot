"use strict";

// Chatbot is a class, and campusBuddy below is its object (instance).
class Chatbot {
  // Private fields provide encapsulation: outside code cannot directly change the
  // bot's response collection or chat history.
  #responses;
  #history;

  constructor() {
    this.#history = [];
    this.#responses = [
      {
        keywords: ["college", "campus", "about", "information"],
        answer: "Campus Buddy is a student-friendly guide to college essentials. For official details about your particular college, check its website or contact the administration office."
      },
      {
        keywords: ["admission", "admissions", "apply", "application", "eligibility"],
        answer: "Admissions usually involve checking eligibility, completing an application, and submitting the required documents. Requirements and dates differ by college, so please confirm the current process with your admissions office."
      },
      {
        keywords: ["fee", "fees", "tuition", "payment", "scholarship"],
        answer: "Tuition and other fees depend on your course and academic year. Ask the accounts office for the current fee structure, payment deadlines, and information about scholarships or installment options."
      },
      {
        keywords: ["subject", "subjects", "syllabus", "course", "courses", "curriculum"],
        answer: "Your subjects depend on your program and semester. Check your department's syllabus or student portal for the official course list. You can ask your faculty adviser if you need help planning electives."
      },
      {
        keywords: ["exam", "exams", "examination", "test", "result", "results"],
        answer: "For examination dates, hall tickets, rules, and results, check the examination cell's latest notices or student portal. Contact the exam office if you need clarification about your schedule."
      },
      {
        keywords: ["timetable", "schedule", "class", "classes", "lecture"],
        answer: "Class timetables can change by semester and section. Please check your department notice board or student portal for the latest schedule and room updates."
      },
      {
        keywords: ["assignment", "assignments", "homework", "project", "submission"],
        answer: "Your faculty member or course portal will have the assignment instructions and due date. If a submission is unclear, ask the relevant teacher before the deadline."
      },
      {
        keywords: ["attendance", "absent", "absence", "attend"],
        answer: "Attendance requirements and records are managed by your department. Check your student portal or ask your class adviser about your current attendance and any official leave process."
      },
      {
        keywords: ["teacher", "teachers", "faculty", "professor", "staff"],
        answer: "Your department can share the current faculty list, office hours, and contact details. Check the department website or notice board, and use official college channels to reach a teacher."
      },
      {
        keywords: ["contact", "phone", "email", "address", "location", "office"],
        answer: "For accurate contact details, visit your college's official website or contact its main office. I don't have a specific college's phone number or address configured in this demo."
      },
      {
        keywords: ["hello", "hi", "hey", "good morning", "good afternoon"],
        answer: "Hello! 👋 What would you like to know about college? You can ask about admissions, fees, subjects, timetable, exams, assignments, attendance, teachers, or contact information."
      },
      {
        keywords: ["thank", "thanks", "thankyou"],
        answer: "You're welcome! 😊 If you have another campus question, I'm happy to help."
      },
      {
        keywords: ["help", "what can you do", "topics"],
        answer: "I can answer common questions about college information, admissions, fees, subjects, timetables, examinations, assignments, attendance, teachers, and contact information. Try asking about one of those topics."
      }
    ];
  }

  // Methods expose controlled operations instead of exposing private state.
  generateResponse(message) {
    const normalizedMessage = message.toLowerCase().replace(/[^\w\s]/g, " ");
    const matchingResponse = this.#responses.find((item) =>
      item.keywords.some((keyword) => {
        const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return new RegExp(`\\b${escapedKeyword}\\b`, "i").test(normalizedMessage);
      })
    );

    const answer = matchingResponse
      ? matchingResponse.answer
      : "I'm not sure about that one yet. I can help with admissions, fees, subjects, timetable, examinations, assignments, attendance, teachers, and college contact information.";

    this.#history.push({ question: message, answer });
    return answer;
  }

  clearHistory() {
    this.#history = [];
  }

  get conversationCount() {
    return this.#history.length;
  }
}

// Object creation: this instance powers the chat interface.
const campusBuddy = new Chatbot();

const chatForm = document.querySelector("#chat-form");
const messageInput = document.querySelector("#message-input");
const messages = document.querySelector("#messages");
const clearButton = document.querySelector("#clear-chat");
const exportButton = document.querySelector("#export-chat");
const suggestionButtons = document.querySelectorAll(".suggestion-chip");
const historyStatus = document.querySelector("#history-status");
const messageCount = document.querySelector("#message-count");
const voiceButton = document.querySelector("#voice-input");
const chatDisclaimer = document.querySelector("#chat-disclaimer");
const qrElement = document.querySelector("#qrcode");
const qrStatus = document.querySelector("#qr-status");
const siteUrl = document.querySelector("#site-url");
const conversationStorageKey = "campusBuddyConversation";

function getTimeLabel() {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date());
}

function updateMessageCount() {
  const count = messages.querySelectorAll(".message-row[data-sender]").length;
  messageCount.textContent = `${count} ${count === 1 ? "message" : "messages"}`;
}

function saveConversation() {
  const conversation = Array.from(messages.querySelectorAll(".message-row[data-sender]"))
    .map((row) => ({
      sender: row.dataset.sender,
      text: row.querySelector(".message-bubble").textContent,
      time: row.querySelector(".message-time").dateTime
    }));

  try {
    window.localStorage.setItem(conversationStorageKey, JSON.stringify(conversation));
    historyStatus.innerHTML = '<span aria-hidden="true">◉</span> Saved on this device';
  } catch (error) {
    historyStatus.textContent = "Could not save chat in this browser";
    historyStatus.title = error instanceof Error ? error.message : "Browser storage is unavailable.";
  }
}

function addMessage(text, sender, timestamp = new Date().toISOString(), persist = true) {
  const row = document.createElement("div");
  row.className = `message-row ${sender === "user" ? "user-row" : "bot-row"}`;
  row.dataset.sender = sender;

  if (sender === "bot") {
    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = "✦";
    row.append(avatar);
  }

  const content = document.createElement("div");
  content.className = "message-content";
  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  bubble.textContent = text;
  if (sender === "bot") {
    const copyButton = document.createElement("button");
    copyButton.className = "copy-button";
    copyButton.type = "button";
    copyButton.textContent = "Copy";
    copyButton.setAttribute("aria-label", "Copy Campus Buddy's response");
    copyButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(text);
        copyButton.textContent = "Copied!";
        window.setTimeout(() => { copyButton.textContent = "Copy"; }, 1400);
      } catch {
        copyButton.textContent = "Copy unavailable";
        chatDisclaimer.textContent = "Clipboard access is unavailable in this browser. You can select and copy the response manually.";
      }
    });
    content.append(bubble, copyButton);
  } else {
    content.append(bubble);
  }
  const time = document.createElement("time");
  time.className = "message-time";
  const parsedTime = new Date(timestamp);
  time.dateTime = Number.isNaN(parsedTime.getTime()) ? new Date().toISOString() : parsedTime.toISOString();
  time.textContent = Number.isNaN(parsedTime.getTime())
    ? getTimeLabel()
    : new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(parsedTime);
  content.append(time);
  row.append(content);
  messages.append(row);
  messages.scrollTop = messages.scrollHeight;
  updateMessageCount();
  if (persist) saveConversation();
}

function showBotReply(question) {
  const typingRow = document.createElement("div");
  typingRow.className = "message-row bot-row";
  typingRow.setAttribute("aria-label", "Campus Buddy is typing");
  const avatar = document.createElement("div");
  avatar.className = "message-avatar";
  avatar.setAttribute("aria-hidden", "true");
  avatar.textContent = "✦";
  const bubble = document.createElement("div");
  bubble.className = "message-bubble typing-bubble";
  bubble.innerHTML = "<i></i><i></i><i></i>";
  typingRow.append(avatar, bubble);
  messages.append(typingRow);
  messages.scrollTop = messages.scrollHeight;

  window.setTimeout(() => {
    typingRow.remove();
    addMessage(campusBuddy.generateResponse(question), "bot");
  }, 450);
}

function sendMessage(text) {
  const question = text.trim();
  if (!question) return;
  addMessage(question, "user");
  showBotReply(question);
  messageInput.value = "";
  messageInput.focus();
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage(messageInput.value);
});

suggestionButtons.forEach((button) => {
  button.addEventListener("click", () => sendMessage(button.textContent.replace(/^[^\w]+/, "")));
});

clearButton.addEventListener("click", () => {
  messages.replaceChildren();
  campusBuddy.clearHistory();
  addMessage("Chat cleared! 👋 I'm ready for your next question. What would you like to know?", "bot");
  messageInput.focus();
});

exportButton.addEventListener("click", () => {
  const transcript = Array.from(messages.querySelectorAll(".message-row[data-sender]"))
    .map((row) => {
      const speaker = row.dataset.sender === "user" ? "You" : "Campus Buddy";
      const time = row.querySelector(".message-time").textContent;
      const text = row.querySelector(".message-bubble").textContent;
      return `[${time}] ${speaker}: ${text}`;
    })
    .join("\n\n");
  const file = new Blob([`Campus Buddy conversation\n\n${transcript}\n`], {
    type: "text/plain;charset=utf-8"
  });
  const downloadUrl = URL.createObjectURL(file);
  const downloadLink = document.createElement("a");
  downloadLink.href = downloadUrl;
  downloadLink.download = "campus-buddy-chat.txt";
  downloadLink.click();
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
});

function restoreConversation() {
  const welcomeMessage = messages.querySelector(".message-bubble")?.textContent
    || "Hi there! 👋 I’m Campus Buddy. Ask me about admissions, fees, subjects, timetable, exams, assignments, attendance, teachers, or contact info.";
  try {
    const storedConversation = window.localStorage.getItem(conversationStorageKey);
    if (!storedConversation) {
      messages.replaceChildren();
      addMessage(welcomeMessage, "bot", new Date().toISOString(), false);
      return;
    }

    const conversation = JSON.parse(storedConversation);
    if (!Array.isArray(conversation)) {
      throw new TypeError("Saved conversation data is not a list.");
    }

    messages.replaceChildren();
    conversation.slice(-100).forEach((item) => {
      if (
        item &&
        (item.sender === "user" || item.sender === "bot") &&
        typeof item.text === "string" &&
        item.text.length <= 2000 &&
        typeof item.time === "string"
      ) {
        addMessage(item.text, item.sender, item.time, false);
      }
    });

    if (!messages.querySelector(".message-row[data-sender]")) {
      addMessage("Hi there! 👋 I’m Campus Buddy. Ask me about admissions, fees, subjects, timetable, exams, assignments, attendance, teachers, or contact info.", "bot", new Date().toISOString(), false);
    }
    updateMessageCount();
  } catch (error) {
    historyStatus.textContent = "Saved chat could not be restored";
    historyStatus.title = error instanceof Error ? error.message : "Browser storage is unavailable.";
    if (!messages.querySelector(".message-row[data-sender]")) {
      messages.replaceChildren();
      addMessage(welcomeMessage, "bot", new Date().toISOString(), false);
    }
  }
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (typeof SpeechRecognition === "function") {
  const speechRecognition = new SpeechRecognition();
  speechRecognition.lang = document.documentElement.lang || "en-US";
  speechRecognition.interimResults = false;
  speechRecognition.maxAlternatives = 1;

  voiceButton.addEventListener("click", () => {
    if (voiceButton.classList.contains("listening")) {
      speechRecognition.stop();
    } else {
      chatDisclaimer.textContent = "Listening… speak your question, then review it before sending.";
      speechRecognition.start();
    }
  });

  speechRecognition.addEventListener("start", () => {
    voiceButton.classList.add("listening");
    voiceButton.setAttribute("aria-label", "Stop voice input");
    voiceButton.title = "Stop voice input";
  });
  speechRecognition.addEventListener("result", (event) => {
    messageInput.value = event.results[0][0].transcript;
    messageInput.focus();
    chatDisclaimer.textContent = "Voice captured. Review your question and press Send.";
  });
  speechRecognition.addEventListener("error", (event) => {
    chatDisclaimer.textContent = event.error === "not-allowed"
      ? "Microphone access was denied. Allow microphone access in your browser settings to use voice input."
      : `Voice input couldn't start (${event.error}). You can still type your question.`;
  });
  speechRecognition.addEventListener("end", () => {
    voiceButton.classList.remove("listening");
    voiceButton.setAttribute("aria-label", "Use voice input");
    voiceButton.title = "Use voice input";
  });
} else {
  voiceButton.disabled = true;
  voiceButton.title = "Voice input is not supported by this browser.";
  voiceButton.setAttribute("aria-label", "Voice input is not supported by this browser");
  chatDisclaimer.textContent = "Voice input is not available in this browser. You can still type your question.";
}

restoreConversation();

function generateWebsiteQrCode() {
  const destination = new URL(window.location.href);
  destination.hash = "";
  destination.search = "";
  siteUrl.textContent = destination.href;

  if (typeof window.QRCode !== "function") {
    qrElement.textContent = "QR library could not be loaded.";
    qrStatus.textContent = "Check your internet connection and reload to generate the QR code.";
    return;
  }

  new window.QRCode(qrElement, {
    text: destination.href,
    width: 140,
    height: 140,
    colorDark: "#17152a",
    colorLight: "#ffffff",
    correctLevel: window.QRCode.CorrectLevel.H
  });
}

generateWebsiteQrCode();
