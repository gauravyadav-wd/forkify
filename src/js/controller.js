// import { render } from 'sass';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
if (module.hot) {
  module.hot.accept();
}

const forkifyApi = async function () {
  try {
    //Fetching api
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    //Load Recipe
    await model.loadRecipe(id);
    //Rendering API
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    await model.loadSearchResults(query);
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);
  recipeView.render(model.state.recipe);
};

const init = function () {
  recipeView.addHandlerRender(forkifyApi);
  recipeView.addHandlerUpdateRecipe(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView._addHandlerClick(controlPagination);
};

init();
//Event Listener for hashchange and load
// window.addEventListener('hashchange', forkifyApi);
// window.addEventListener('load', forkifyApi);
