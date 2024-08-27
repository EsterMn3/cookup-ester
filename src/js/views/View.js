import icons from 'url:../../img/icons.svg';

//we will use this class as a parent class of other views
export default class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Ester Minja
   * @todo Finish implementation
   */
  render(data, render = true) {
    //checking if data exists
    //if is not data, or that data is an array but with length 0
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    //putting the html on the page
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    //on the parent eleemnt
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup(); //geneate new markup, compare to the current html
    //change text and attributes that have changed to the new version

    //converting markup string  to a dom element
    const newDOM = document.createRange().createContextualFragment(newMarkup); //newdom is going to be an object(virtual dom)
    const newElements = Array.from(newDOM.querySelectorAll('*')); //converting a nodelist to a new array=arrayfrom
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    //looping over two arrays at the same time
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      //Updates changed TEXT(nodevalue)
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      //Updates changed Atributte
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }
  _clear() {
    //emptying the container
    this._parentElement.innerHTML = '';
  }

  //rendering a spinner
  renderSpinner() {
    const markup = `<div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
