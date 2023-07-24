interface Chats {
    [key: string]: Message[] | null;
  }

interface Message {
    unix_time: number;
    date: string;
    time: string;
    author: string;
    message: string;
    attached_file: string;
    storage_path: string;
    has_attachment: boolean;
}
  
async function init() {
    const app = document.getElementById('app')!
    const chats = document.getElementById('chats')!
    const messages = document.getElementById('messages')!
    const chat_title = document.getElementById('chat_title')!

    // fetch data
    const data = await fetch('/static/data_with_files_v2.json')
        .then(response => response.json())


    main(chats, data, messages, chat_title)
}

function main(chats: HTMLElement, data: Chats, messages: HTMLElement, chat_title: HTMLElement) {

    Object.keys(data).forEach(chat => {
        const chatContainer = document.createElement('div')
        const chatName = document.createTextNode(chat)

        chatContainer.classList.add('chat_container')
        chatContainer.appendChild(chatName)

        chatContainer.addEventListener('click', (event) => {
            event.preventDefault()
            event.stopPropagation()

            const target = (event.target as HTMLElement)

            indicator(chats, target)

            const name = (event.target as HTMLElement).innerHTML

            loadChat(name, data, messages, chat_title)
        })

        chats.appendChild(chatContainer)
    });
    (chats.querySelector(':first-child') as HTMLElement)!.click()
}

function indicator(chats: HTMLElement, target: HTMLElement) {
    const children = chats.children

    for (let i = 0; i < children.length; i++) {
        const chat = children.item(i)! as HTMLElement
        chat.classList.remove('indicator')
    }

    target.classList.add('indicator')
}

async function loadChat(chat: string, data: Chats, messages_container: HTMLElement, chat_title: HTMLElement) {
    const acceptable_images = ['image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp']

    try {
        document.querySelector('#msg')!.remove()
    } catch {}
    

    const messages = document.createElement('div')
    messages.id = 'msg' 
    const parser = new DOMParser()
    
    chat_title.innerHTML = chat
    console.log(chat)
    const currentChat = data[chat]!

    let currentDate = currentChat[0]['date']
    messages.appendChild(createDateHeader(currentDate))

    currentChat.forEach(async message => {
        const div = document.createElement('div')
        let messageText = document.createElement('p')

        const date = message['date']
        const headerSpan = document.createElement('span')
        const time = document.createElement('span')
        const author = document.createElement('span')

        time.classList.add('message_time')
        author.classList.add('message_author')
        headerSpan.classList.add('message_header')

        time.appendChild(document.createTextNode(message['time']))
        author.appendChild(document.createTextNode(message['author']))

        headerSpan.appendChild(author)
        headerSpan.appendChild(time)
        messageText.appendChild(headerSpan)

        const has_attachment = message['has_attachment']

        if (date != currentDate) {
            messages.appendChild(createDateHeader(date))
        }

        if (has_attachment) {
            const storage_path = message['storage_path']
            const temp = storage_path.split('\\')
            const body = document.createElement('body')
            const fileName = document.createTextNode(temp[temp.length - 1])
            const messageLink = document.createElement('a')

            messageLink.setAttribute('href', storage_path)
            messageLink.appendChild(fileName)
            messageLink.classList.add('file')

            // const file = await fetch(storage_path.replace('\\', '/'))
            // const mime = file.headers.get('content-type') != null ? file.headers.get('content-type')! : 'no-content-type'

            // if (acceptable_images.includes(mime)) {
            //     const image = document.createElement('img')
            //     image.src = storage_path
            //     image.
            // }

            body.appendChild(messageLink)
            messageText.appendChild(body)
        } else {
            const html = parser.parseFromString(message['message'], 'text/html')
            // console.log(html.body)
            messageText.appendChild(html.body);
        }
        div.appendChild(messageText);
        div.classList.add('message')

        messages.appendChild(div)
        
        currentDate = date
    });
    messages_container.appendChild(messages)

    const scrollHeight = messages.scrollHeight
    messages.scrollTo(0, scrollHeight)
}

function createDateHeader(date: string) {
    const dateHeader = document.createElement('div')
    const dateContainer = document.createElement('div')
    const dateText = document.createTextNode(date)
    dateContainer.classList.add('date_container')
    dateContainer.appendChild(dateText)
    dateHeader.classList.add('date')
    dateHeader.appendChild(dateContainer)

    return dateHeader
}

function sleep(milliseconds: number) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
   }

document.addEventListener('DOMContentLoaded', init)