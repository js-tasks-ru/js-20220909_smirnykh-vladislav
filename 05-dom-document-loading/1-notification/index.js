export default class NotificationMessage {
    static isActivNotification;

    constructor(msg, {
        duration = 3000,
        type = 'success',
    } = {}) {
        this.msg = msg;
        this.durationSeconds = (duration / 1000) + 's';
        this.duration = duration;
        this.type = type;
        this.render();
    }

    get template () {
        return `<div class="notification ${this.type}" style="--value:${this.durationSeconds}">
                    <div class="timer"></div>
                        <div class="inner-wrapper">
                            <div class="notification-header">success</div>
                            <div class="notification-body">
                                ${this.msg}
                            </div>
                        </div>
                    </div>
                </div>`;
    }

    render() {
        const element = document.createElement('div');
        element.innerHTML = this.template;
        this.element = element.firstElementChild;
    }

    remove(){
        if (this.element) {
            this.element.remove();
          }
    }

    destroy(){
        this.remove();
        this.element = null;
        NotificationMessage.isActivNotification = null;
    }

    show (body = document.body) {
        if (NotificationMessage.isActivNotification) {
            NotificationMessage.isActivNotification.remove();
        }
        body.append(this.element)

        this.timeoutID = setTimeout(() => {
            this.remove();
          }, this.duration);

        NotificationMessage.isActivNotification = this;
    }
}
