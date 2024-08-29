import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
//💥
//to make sure all browsers are being wupported by our application
//polyfylling everything
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const controlRecipes = async function () {
  try {
    //getting the hash of the recipe
    const id = window.location.hash.slice(1); //getting the portion of the url that comes after the #

    if (!id) return; //if there aint no id we return
    recipeView.renderSpinner(); //rendering the spinner on the recipeview

    //0. Update results view to mark selected search result
    resultsView.update(model.getSearchResultPage());

    //1. Updating bookmarks view
    bookmarksView.update(model.state.bookmarks); //appears at bookmarks list as selected

    //2.Loading recipe
    //loadrecipe returns a promise so we have to await it
    await model.loadRecipe(id);

    //3. Rendering recipe
    //render method will accept the data in (), that we got from 1. and store it to the new object
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};
const controlSearchResults = async function () {
  try {
    //rendering the spinner on search result
    resultsView.renderSpinner();

    //1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2)Load seach results
    //this manipulates the data, doesnt return anything
    await model.loadSearchResults(query);

    //3) Render results
    //resultsView.render(model.state.search.results); //these are all the results
    //some of results(x per page)
    resultsView.render(model.getSearchResultPage()); //passing nothing is same as passing 1

    //4) Render initial pagination buttons
    paginationView.render(model.state.search); //passing the entire search object
  } catch (err) {
    console.log(err);
  }
};

//controller that will be excecuted whenever a click on the button happens
//this is called in the paginationview handler(gotopage)
const controlPagination = function (goToPage) {
  //3) Render NEW results
  resultsView.render(model.getSearchResultPage(goToPage)); //in the model state.search.page gets updated to that new value

  //4) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //we get the argument from the recipeview
  //Update the recipe sevings(in state)
  model.updateServings(newServings);

  //update the recipe view, no servings view
  //recipeView.render(model.state.recipe);//this renders the whole view
  //to update only the text and attributes on the dom
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1)add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2)update recipe view
  recipeView.update(model.state.recipe);

  //3)render bookmarks(when we hhover the bookmarks button up, it will show all our bookmarks)
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

//since uploadrecipe is an async function this should be too, and we have to await the uploDRECIPE
const controlAddRecipe = async function (newRecipe) {
  try {
    //rendering the loading spinner before we upload the data
    addRecipeView.renderSpinner();

    //upload the new recipe data
    await model.uploadRecipe(newRecipe); //handling it as a function that returns a promise
    //console.log(model.state.recipe); //{id: '66d06d45ca7ca000149350eb', title: 'TEST23', publisher: 'TEST23', sourceUrl: 'TEST23', image: 'TEST23', …}

    //render the uploaded recipe in the website
    recipeView.render(model.state.recipe);

    //success message
    addRecipeView.renderMessage();

    //Render bookmark view
    bookmarksView.render(model.state.bookmarks); //adding the recipe to the bookmark

    //change id in the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    //the rejected promise will be caught here
    console.error(err);
    addRecipeView.renderError(err.message); //this error message is excevuted
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
