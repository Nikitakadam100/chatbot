# Smart Student Chatbot with QR Code

**Campus Buddy** is a responsive, front-end college information chatbot created as a second-year B.Tech Artificial Intelligence and Data Science OOP activity. It uses predefined JavaScript responses; it is **not an AI-powered chatbot** and does not connect to an AI service.

## Features

- Responsive landing page and chat interface for mobile, tablet, and desktop.
- Predefined answers about college information, admissions, fees, subjects, timetables, examinations, assignments, attendance, teachers, and contact information.
- Message bubbles, Enter-to-send, clickable suggested prompts, typing indicator, timestamps, and clear-chat control.
- Conversation history saved locally in the current browser, with message count and a downloadable plain-text transcript.
- One-tap prompts for all supported topics, copy-response buttons, and optional speech-to-text where the browser supports it.
- QR code generated with QRCode.js using the website's current URL. On a Netlify deployment, this is the deployed website address.
- Accessible labels, keyboard-friendly controls, and a reduced-motion preference.

## Project files

| File | Purpose |
| --- | --- |
| `index.html` | Page content, chat layout, and external QRCode.js library |
| `styles.css` | Responsive visual design, gradients, animations, and chat styling |
| `script.js` | `Chatbot` class, predefined responses, chat interactions, and QR generation |

## Run in VS Code

1. Open this project folder in Visual Studio Code.
2. Open `index.html` in a browser. For the best local development experience, install the **Live Server** extension, right-click `index.html`, and choose **Open with Live Server**.
3. Keep an internet connection available so the QRCode.js library and web fonts can load.
4. Ask a question in the chat or use a suggested prompt. Press **Enter** or select **Send** to submit it. Select **New chat** to clear the conversation, or **Save chat** to download a text transcript.
5. Conversation history is stored only in this browser using local storage. Select **New chat** to clear the saved conversation too. Use the microphone button for speech-to-text if the browser supports it and microphone permission is granted; otherwise, continue typing.

The site is static and needs no build step or package installation. The chatbot's college details are general guidance: confirm official policies, dates, fees, and contact details with the relevant college.

## Publish with Netlify

### Netlify Drop

1. Make sure `index.html`, `styles.css`, and `script.js` are in the same project folder.
2. Sign in to [Netlify](https://www.netlify.com/) and open **Add new site** → **Deploy manually** (or the Netlify Drop page).
3. Drag the project folder, or a ZIP containing those three files, into the deploy area.
4. Open the published `https://...netlify.app` site and verify the chatbot and QR code.

### Git-based deployment

1. Push the project files to a Git provider repository.
2. In Netlify, choose **Add new site** → **Import an existing project** and connect the repository.
3. Leave the build command empty and set the publish directory to the project root (or `.` if Netlify requests a value).
4. Deploy, then use the resulting Netlify URL to test the live site.

## QR code: generate and test

The page reads `window.location.href` at runtime, removes any query string or page fragment, and passes the resulting URL to QRCode.js. No deployment address is hard-coded:

- With Live Server, the QR opens the local development address and is generally usable only on that computer.
- After deployment, open the public Netlify URL. Its QR code will then encode that live URL.
- Scan the displayed code with a phone camera. Confirm the preview URL matches the deployed website, open it, and send a test question.
- QRCode.js is loaded from a CDN, so the browser needs internet access. If the library cannot load, the QR area displays an explanatory error instead of silently appearing to work.

## JavaScript OOP concepts

The comments in `script.js` identify the concepts in the implementation:

- **Class:** `Chatbot` defines the chatbot's state and behavior.
- **Object:** `campusBuddy` is an instance created from `Chatbot`.
- **Encapsulation:** `#responses` and `#history` are private fields and cannot be accessed directly outside the class.
- **Methods:** `generateResponse()` chooses a predefined answer and `clearHistory()` resets stored conversation history. The `conversationCount` getter exposes a read-only count.

## Extra chat controls

- **Save chat:** downloads the visible conversation as `campus-buddy-chat.txt`.
- **Copy:** copies an individual Campus Buddy reply when clipboard access is available.
- **Voice input:** uses browser speech recognition when supported. Some browsers require HTTPS (or localhost) and microphone permission.
- **Saved history:** keeps the most recent messages on the same browser and device; it is not uploaded to a server. Clearing the conversation removes the saved history.

## Viva questions and short answers

1. **What is a class?** A class is a blueprint that defines the data and behavior its objects can have.
2. **What is an object?** An object is an instance created from a class. `campusBuddy` is an object of `Chatbot`.
3. **What is encapsulation?** Encapsulation keeps an object's internal state together with its behavior and controls access to that state. JavaScript private fields (`#responses`, `#history`) demonstrate it here.
4. **What is a method?** A method is a function defined on a class that describes an operation an object can perform, such as `generateResponse()`.
5. **How does the chatbot create responses?** It normalizes the question, checks for topic keywords, and returns a matching predefined answer or a fallback response.
6. **Is this chatbot powered by AI?** No. It is a rule-based demo that matches keywords against predefined answers; it does not use a model or AI API.
7. **How does the QR code work?** QRCode.js encodes the current page URL. On the deployed website, scanning it opens that public site.
8. **Why should official college information be verified?** Policies, contacts, schedules, and fees can vary or change, while this demo's responses are generic.
9. **How does the chat support Enter?** The input is inside a form, and its submit event handles both the Send button and Enter key.
10. **What is responsive design?** It adapts the layout to different screen sizes using flexible grids and CSS media queries.
