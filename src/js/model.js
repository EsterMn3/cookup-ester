import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

//we export it so we can use it in the controller
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    //how we want to remame them, and whats their property name
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    //adding the key if it excists, if the recipekey doesnt exists, nothing happens
    //if there is any value the second part of the operator (after&&) is excecuted and returned
    //we spread the object
    ...(recipe.key && { key: recipe.key }),
  };
};
//fetching recipe data from api
//this will change the state object above that contains the recipe, and the controller will grab it from there
export const loadRecipe = async function (id) {
  try {
    //1.Loading recpe
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    //creating the object with the data that we recieve
    state.recipe = createRecipeObject(data);

    //some lops over an array and returns true if any of them has the condition we have specified as true
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err; //so that we catch the error in model.js file
  }
};

//search funtionality
//we export it so that we can use it by the controller
//since it will perform an ajax call, it will be an async function
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    //with the key in the url we add in the search results our own recipes also
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);
    //we build a new array where the property names are different
    state.search.results = data.data.recipes.map(rec => {
      //returning the new object
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1; //when we do a new search it goes back to the first page
  } catch (err) {
    throw err; //so that we catch the error in model.js file
  }
};

//getting results with pagination
export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; //10 reslts per page,0
  const end = page * state.search.resultsPerPage; //9
  return state.search.results.slice(start, end);
};

//changing the quantity in each ingredient, updating the servings
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    //newQt= oldQt* newServings /old*8/4=4
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

//storing bookmarks in localstorage
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  //add bookmark
  state.bookmarks.push(recipe);

  //mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};
//when we add data we need the entire recipe, when we want to delete it we need only the id
export const deleteBookmark = function (id) {
  //delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  //mark current recipe as not bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

//taking the bookmarks out of the localstorage and rendering it in the bookmarks section
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage); //converting the string back to an object
};
init();

const clearBookmarks = function () {
  //only used by dev to clear bookmarks
  localStorage.clear('bookmarks');
};
//clearBookmarks();

//making a request to the api = async function
export const uploadRecipe = async function (newRecipe) {
  try {
    console.log(Object.entries(newRecipe));

    //the first element of the ingredients array property, should start with ingredient and
    //the second element should not be an empty string
    //each array in ingredients stores quantity, unit description
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '') //we have to take data out of the string and put it into an object,spliting by ,
      .map(ing => {
        //const ingArr = ing[1].replaceAll(' ', '').split(',');
        const ingArr = ing[1].replaceAll(' ', '').split(',');

        if (ingArr.length !== 3) {
          throw new Error(
            'Wrong ingredient format. Please use the correct format!'
          );
        }

        //destructuring the array
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    //create the object that is ready to be uploaded in the api
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    //creating a new ajax rerquest
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe); //ths will send the recipe back to us, so we have to store and await it

    //we store the data into the state
    state.recipe = createRecipeObject(data);
    //adding the bookmark to this recipe
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
