import { ajax } from 'rxjs/ajax';
import { interval, take, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import moment from 'moment';

// const url = 'http://localhost:7070/messages/unread';
const url = 'https://polling-backend-server.onrender.com/messages/unread';
const messagesList = document.querySelector('.messages-list');

const cutString = (str) => (str.length > 15 ? `${str.slice(0, 15)}...` : str);

function postMessages(messages) {
  messages.forEach((message) => {
    const { from: email } = message;
    const subject = cutString(message.subject);
    const timestamp = new Date(message.received);
    const datetime = moment(timestamp).format('hh:mm DD.MM.YYYY');

    const messageHTML = `
      <li class="message">
        <p class="message-email">${email}</p>
        <p class="message-subject">${subject}</p>
        <p class="message-datetime">${datetime}</p>
      </li>`;

    messagesList.insertAdjacentHTML('afterbegin', messageHTML);
  });
}

const messagesStream$ = interval(3000)
  .pipe(
    take(10),
    switchMap(() => ajax.getJSON(url)
      .pipe(
        catchError(() => of({ messages: [] })),
      )),
    map((messages) => messages.messages),
  );

messagesStream$.subscribe((messages) => {
  postMessages(messages);
});
