function LoadingView() {
  this._viewElement = htmlToElement(loadingTemplate);
}

LoadingView.prototype = {
  getViewElement() {
    return this._viewElement;
  },
};
