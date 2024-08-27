import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded';
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super(); //since its a child class
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }
  _addHandlerShowWindow() {
    //this keyword here points to the btnopen, so we have to create another function tooglewindow
    //and give it the this that we want
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this)); //now this points to the current object
    console.log(this);
  }
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  //getting the data from the user and uploading it
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      //getting the elements from the inputs
      //in the formdata we pass the form(this that rn is the parentelement) That gives an object so we spread it to an array
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr); //converting the array to an object
      handler(data);
    });
  }

  //every view needs a generateMarkup function
  _generateMarkup() {}
}

export default new AddRecipeView();
