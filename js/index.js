import '../scss/main.scss';
import '../img/camera.png';
import '../img/close.png';
import '../img/favicon.png';
import '../img/menu.png';
import '../img/logo.png';
import User from './store';
import handlers from './handlers';
import render from './render';

const root = document.getElementById('root');
const user = new User();

const router = {
    welcome: page => {
        const signIn = page.querySelector('#signIn');
        const inputs = page.querySelectorAll('input');

        signIn.addEventListener('click', e => {
            e.preventDefault();
            if (validate(inputs)) {
                const name = page.querySelector('#name').value;
                const nickName = page.querySelector('#nickName').value;

                user.setName(name);
                user.setNickName(nickName);
                root.innerHTML = render('chat', {
                    name: name,
                    nickName: nickName
                });
            }
        });
    },
    chat: page => {
        const sendBtn = page.querySelector('#sendMsg');
        const msgInput = document.getElementById('message');
        const ws = initSockets(page);

        sendBtn.addEventListener('click', e => {
            e.preventDefault();
            const msg = msgInput.value;
            if (!msg == '') {
                ws.send(JSON.stringify({ payload: 'newMsg', data: msg }));
                msgInput.value = '';
            }
        });
    }
};

const config = {
    childList: true,
    subtree: true
};

const observer = new MutationObserver(observerCallback);

observer.observe(root, config);

window.addEventListener('DOMContentLoaded', () => {
    root.innerHTML = render('authorization');
});

function observerCallback(mutationList, observer) {
    const page = mutationList[0].addedNodes[0];
    if (page) {
        const pageId = page.id;

        if (router[pageId]) {
            router[pageId](page);
        }
    }
}

function initSockets(page) {
    const ws = new WebSocket('ws://localhost:3000');

    ws.onopen = () => {
        ws.send(JSON.stringify({ payload: 'newUser', data: user }));
        const status = document.querySelector('.status__text')
        status.textContent = 'ONLINE'
        status.style.color = '#27ae60'
    };

    ws.onmessage = e => {
        const dataParse = JSON.parse(e.data);
        handlers[dataParse.payload](
            dataParse.data,
            page,
            dataParse.qty,
            dataParse.isAuthor,
            dataParse.author,
            ws
        );
    };

    const logOut = page.querySelector('#logOut');
    logOut.addEventListener('click', e => {
        ws.close();
        root.innerHTML = render('authorization');
        const status = document.querySelector('.status__text')
        status.textContent = 'OFFLINE'
        status.style.color = '#d35400'
    });

    return ws;
}

function validate(inputs) {
    for (let input of inputs) {
        if (input.value === '') {
            input.nextElementSibling.classList.remove('display-none');
            return false;
        } else {
            input.nextElementSibling.classList.add('display-none');
        }
    }
    return true;
}
