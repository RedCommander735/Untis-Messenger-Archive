"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = document.getElementById('app');
        const chats = document.getElementById('chats');
        const messages = document.getElementById('messages');
        const chat_title = document.getElementById('chat_title');
        const fullscreen = document.getElementById('fullscreen');
        fullscreen.addEventListener('click', () => {
            fullscreen.classList.add('invisible');
        });
        // fetch data
        const data = yield fetch('/static/data_with_files_v2.json')
            .then(response => response.json());
        main(chats, data, messages, chat_title, fullscreen);
    });
}
function main(chats, data, messages, chat_title, fullscreen) {
    Object.keys(data).forEach(chat => {
        const chatContainer = document.createElement('div');
        const chatName = document.createTextNode(chat);
        chatContainer.classList.add('chat_container');
        chatContainer.appendChild(chatName);
        chatContainer.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            const target = event.target;
            indicator(chats, target);
            const name = event.target.innerHTML;
            loadChat(name, data, messages, chat_title, fullscreen);
        });
        chats.appendChild(chatContainer);
    });
    chats.querySelector(':first-child').click();
}
function indicator(chats, target) {
    const children = chats.children;
    for (let i = 0; i < children.length; i++) {
        const chat = children.item(i);
        chat.classList.remove('indicator');
    }
    target.classList.add('indicator');
}
function loadChat(chat, data, messages_container, chat_title, fullscreen) {
    return __awaiter(this, void 0, void 0, function* () {
        const acceptable_images = ['image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
        try {
            document.querySelector('#msg').remove();
        }
        catch (_a) { }
        const messages = document.createElement('div');
        messages.id = 'msg';
        const parser = new DOMParser();
        chat_title.innerHTML = chat;
        console.log(chat);
        const currentChat = data[chat];
        let currentDate = currentChat[0]['date'];
        messages.appendChild(createDateHeader(currentDate));
        let p = new Promise((resolve, reject) => {
            currentChat.forEach((message) => __awaiter(this, void 0, void 0, function* () {
                const div = document.createElement('div');
                let messageText = document.createElement('p');
                const date = message['date'];
                const headerSpan = document.createElement('span');
                const time = document.createElement('span');
                const author = document.createElement('span');
                time.classList.add('message_time');
                author.classList.add('message_author');
                headerSpan.classList.add('message_header');
                time.appendChild(document.createTextNode(message['time']));
                author.appendChild(document.createTextNode(message['author']));
                headerSpan.appendChild(author);
                headerSpan.appendChild(time);
                messageText.appendChild(headerSpan);
                const has_attachment = message['has_attachment'];
                if (date != currentDate) {
                    messages.appendChild(createDateHeader(date));
                }
                if (has_attachment) {
                    const storage_path = message['storage_path'];
                    const temp = storage_path.split('\\');
                    const body = document.createElement('body');
                    const fileName = document.createTextNode(temp[temp.length - 1]);
                    const messageLink = document.createElement('a');
                    messageLink.target = '_blank';
                    messageLink.setAttribute('href', storage_path);
                    messageLink.appendChild(fileName);
                    messageLink.classList.add('file');
                    body.appendChild(messageLink);
                    body.classList.add('file_container');
                    const mime = message['mime_type'];
                    if (acceptable_images.includes(mime)) {
                        const image = document.createElement('img');
                        image.classList.add('embedd');
                        image.onload = () => {
                            const scrollHeight = messages.scrollHeight;
                            messages.scrollTo(0, scrollHeight);
                            image.onload = null;
                        };
                        image.src = storage_path;
                        image.addEventListener('click', function () {
                            fullscreen.style.backgroundImage = 'url(' + image.src + ')';
                            fullscreen.classList.remove('invisible');
                        });
                        body.classList.add('image_file_container');
                        body.appendChild(image);
                    }
                    if (message['message'] != '') {
                        const html = parser.parseFromString(message['message'], 'text/html');
                        // console.log(html.body)
                        messageText.appendChild(html.body);
                    }
                    messageText.appendChild(body);
                }
                else {
                    const html = parser.parseFromString(message['message'], 'text/html');
                    // console.log(html.body)
                    messageText.appendChild(html.body);
                }
                div.appendChild(messageText);
                div.classList.add('message');
                messages.appendChild(div);
                currentDate = date;
            }));
            messages_container.appendChild(messages);
            let bottom = document.createElement("div");
            bottom.id = "bottom";
            messages_container.appendChild(bottom);
            resolve();
        }).then(() => {
            const scrollHeight = messages.scrollHeight;
            messages.scrollTo(0, scrollHeight);
        });
    });
}
function createDateHeader(date) {
    const dateHeader = document.createElement('div');
    const dateContainer = document.createElement('div');
    const dateText = document.createTextNode(date);
    dateContainer.classList.add('date_container');
    dateContainer.appendChild(dateText);
    dateHeader.classList.add('date');
    dateHeader.appendChild(dateContainer);
    return dateHeader;
}
document.addEventListener('DOMContentLoaded', init);
