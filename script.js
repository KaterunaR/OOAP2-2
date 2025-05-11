// Написати програму з використанням шаблону Flyweight, а саме
// телефонну мережу загального користування. Такі ресурси як генератори
// тональних сигналів (Зайнято і т.д.), приймачі цифр номера абонента, що
// набирається в тоновом наборі, є загальними для всіх абонентів.
// Коли абонент піднімає трубку, щоб подзвонити, йому надається доступ
// до всіх потрібних ресурсів, що розділяються.



// Flyweight Тональний сигнал
class ToneSignal {
    constructor(type) {
      this.type = type;
      console.log(`Створено новий ToneSignal: "${type}"`);
    }

    play() {
      return `Сигнал: ${this.type}`;
    }
}


// Flyweight приймач цифр номера
class DigitReceiver {
    constructor() {
        console.log('Створено один DigitReceiver');
    }

    receive(number) {
      return `Набрано номер: ${number}`;
    }
}


// фабрика керує спільними об’єктами
class TelecomResourceFactory {
    constructor() {
      this.signals = {};
      this.digitReceiver = new DigitReceiver();
    }
    getSignal(type) {
      if (!this.signals[type]) {
        this.signals[type] = new ToneSignal(type);
      }
      return this.signals[type];
    }
    getDigitReceiver() {
      return this.digitReceiver;
    }
}



class Subscriber {
    constructor(name, resourceFactory) {
      this.name = name;
      this.resources = resourceFactory;
    }

    call(receiverName) {
      const log = [];
      const receiverStatus = Math.random() < 0.5 ? 'вільний' : 'зайнятий';
      const number = Math.floor(Math.random() * 9000000 + 1000000);
      log.push(`Абонент ${this.name} дзвонить до ${receiverName}...`);
      log.push(this.resources.getSignal('виклик').play());
      log.push(this.resources.getDigitReceiver().receive(number));
      if (receiverStatus === 'зайнятий') {
        log.push(this.resources.getSignal('зайнято').play());
        log.push(`${receiverName} зайнятий`);
      } else {
        log.push(this.resources.getSignal('гудок').play());
        log.push(`${receiverName} відповідає`);
      }
      return log.join('\n');
    }
}



const factory = new TelecomResourceFactory();
const logArea = document.getElementById('log');

document.getElementById('callBtn').addEventListener('click', () => {
  const caller = document.getElementById('callerName').value.trim() || 'Анонім';
  const receiver = document.getElementById('receiverName').value.trim() || 'Невідомий';

  const subscriber = new Subscriber(caller, factory);
  const result = subscriber.call(receiver);

  logArea.innerText += result + '\n\n';
});