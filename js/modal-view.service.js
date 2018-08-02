function ModalView() {
  this._viewElement = htmlToElement(modalBoxTemplate);
  this.modalViewContent = null;
  this.onclickEvent = new Event(this);
  this.onDismissEvent = new Event(this);
  const self = this;
  this._viewElement.onclick = (event) => {
    self.onclickEvent.notify(event);
  };
}

ModalView.prototype = {
  setContent(modalContent) {
    const content = this._viewElement.querySelector('.modal-content');
    content.innerHTML = '';
    content.appendChild(modalContent);
    this.modalViewContent = modalContent;
    const self = this;
    const dismissButtons = this._viewElement.querySelectorAll('[tc-data-dismiss]');
    for (let i = 0; i < dismissButtons.length; i++) {
      const dismissButton = dismissButtons[i];
      dismissButton.onclick = () => {
        self.onDismissEvent.notify();
        self.dismiss();
      };
    }
  },

  getViewElement() {
    return this._viewElement;
  },

  dismiss() {
    this.onDismissEvent.notify();
    document.body.removeChild(this.getViewElement());
  },
};

function ModalService() {
  this._modalView = new ModalView();
}

ModalService.prototype = {
  open(content) {
    const modal = this._modalView.getViewElement();
    modal.style.display = 'block';
    content.modalView = this._modalView;
    this._modalView.setContent(content.getViewElement());
    document.body.appendChild(modal);
  },
  onDismiss(callback) {
    this._modalView.onDismissEvent.attach(callback);
  },

  getModalView() {
    return this._modalView;
  },
};
