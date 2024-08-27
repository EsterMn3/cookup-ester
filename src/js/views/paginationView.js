import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      //figuring out which button is getting clicked based on the event,event deligation
      const btn = e.target.closest('.btn--inline'); //this looks up in the tree for parent.(because the user can click on span,svg or use)

      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  //every view needs a generateMarkup function
  _generateMarkup() {
    const curPage = this._data.page;
    //we need to know how many pages are there
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    console.log(numPages);
    //Page 1 , and there are other pages
    if (curPage === 1 && numPages > 1) {
      //we add the attribute data-goto
      //button to go to the next page
      return `
      <button data-goto="${
        curPage + 1
      }" class="btn--inline pagination__btn--next">
            <span>Page  ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
    }
    //Last page
    if (curPage === numPages && numPages > 1) {
      //going to the previous page
      return `
      <button data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>`;
    }

    //Other page
    if (curPage < numPages) {
      //button to go back and button to go forward
      return `
      <button data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>
       <button data-goto="${
         curPage + 1
       }" class="btn--inline pagination__btn--next">
            <span>Page  ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
    }
    //Page 1, and there are NO other pages, no button needed
    return '';
  }
}

export default new PaginationView();
