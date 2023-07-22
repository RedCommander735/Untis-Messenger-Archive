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
        // fetch data
        const data = yield fetch('/static/data_with_files_v2.json')
            .then(response => response.json());
        main(chats, data, messages);
    });
}
function main(chats, data, messages) {
    Object.keys(data).forEach(chat => {
        const chatContainer = document.createElement('div');
        const chatName = document.createTextNode(chat);
        chatContainer.classList.add('chat_container');
        chatContainer.appendChild(chatName);
        chatContainer.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            const name = event.target.innerHTML;
            loadChat(name, data, messages);
        });
        chats.appendChild(chatContainer);
    });
}
function loadChat(chat, data, messages) {
    const parser = new DOMParser();
    console.log(chat);
    const currentChat = data[chat];
    let currentDate = currentChat[0]['date'];
    messages.appendChild(createDateHeader(currentDate));
    currentChat.forEach(message => {
        const div = document.createElement('div');
        let messageText = document.createElement('p');
        const date = message['date'];
        messageText.appendChild(document.createTextNode(`${message['time']} - ${message['author']}: `));
        const has_attachment = message['has_attachment'];
        if (date != currentDate) {
            messages.appendChild(createDateHeader(date));
        }
        if (has_attachment) {
            const storage_path = message['storage_path'];
            const temp = storage_path.split('\\');
            const fileName = document.createTextNode(temp[temp.length - 1]);
            const messageLink = document.createElement('a');
            messageLink.setAttribute('href', storage_path);
            messageLink.appendChild(fileName);
            messageLink.classList.add('file');
            messageText.appendChild(messageLink);
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
    });
    const scrollHeight = messages.scrollHeight;
    messages.scrollTo(0, scrollHeight);
}
function createDateHeader(date) {
    const dateHeader = document.createElement('div');
    const dateText = document.createTextNode(date);
    dateHeader.classList.add('date');
    dateHeader.appendChild(dateText);
    return dateHeader;
}
function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
document.addEventListener('DOMContentLoaded', init);
