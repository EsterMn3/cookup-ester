//the claswont render anything, it will get the query and listen for the click event in the button
class SearchView {
  _parentEl = document.querySelector('.search');
  getQuery() {
    //getting the value the user enters in the search field
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();

    return query;
  }
  //clearing the input field
  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }
  //this function is the publisher and controlsearch resultfunction will be the subscriber
  addHandlerSearch(handler) {
    //adding the event to the entire element(submit=enter and click)
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault(); //so the page wont reload after clicking the submit button
      handler();
    });
  }
}
export default new SearchView();
