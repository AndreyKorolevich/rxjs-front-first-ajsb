import { ajax } from 'rxjs/ajax';
import { map, catchError } from 'rxjs/operators';
import { of, interval } from 'rxjs';

export default class Widget {
  constructor(container) {
    this.container = container;
  }

  start() {
    this.showWidget();
    const observable = interval(5000);
    observable.subscribe(() => {
      this.api().subscribe((value) => this.addMessage(value));
      setTimeout(() => observable.unsubscribe(), 1000);
    });
  }

  showWidget() {
    const widget = document.createElement('div');
    widget.classList.add('widget');
    widget.innerHTML = `
      <p class="name">Incomming</p>
      <div class="list"></div>
    `;

    this.container.appendChild(widget);
  }

  addMessage(elem) {
    const message = document.createElement('div');
    message.classList.add('message');
    let text = elem.message;
    if (elem.message.length > 15) {
      text = `${elem.message.slice(0, 13)}...`;
    }
    message.innerHTML = `
      <div class="email">${elem.email}</div>
      <div class="text">${text}</div>
      <div class="date">${elem.date}</div>
    `;
    this.container.querySelector('.list').appendChild(message);
  }
  /* eslint-disable */
  api() {
    return ajax.getJSON('https://rxjs-homework-backend.herokuapp.com/messages/unread').pipe(
      map((response) => response),
      catchError((error) => {
        console.log('error: ', error);
        return of(error);
      }),
    );
  }
}
