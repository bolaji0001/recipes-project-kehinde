import * as model from './module.js';
import {MODAL_CLOSE_SEC} from './config.js'
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookMarkView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////

// if(module.hot){
//   module.hot.accept()
//   //Doesn't reload the entire page
// }

const controllerRecipe = async function () {
  try {
    const hash = window.location.hash;
   
    const id = hash.slice(1);
    // console.log(id)

    if (!id) return;
    recipeView.renderSpinner();

    //0). Results view to mark selected search results

    resultsView.update(model.getSearchResultsPage());


    bookmarkView.update(model.state.bookmarks)

    //1.) Loading recipe
    await model.loadRecipe(id);
   

    //Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError(`${err} 💥💥💥`);
  }
};

const controllerSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //1). Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2). Load search results
    await model.loadSearchResults(query);

    //3). Reder results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    //4). render pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controllerPaginationBtn = function (gotopage) {
  //3). Reder results
  // resultsView.render(model.state.search.results);
  resultsView.render(model.getSearchResultsPage(gotopage));

  //4). render pagination
  paginationView.render(model.state.search);
};

const controlServings = function (currentServing) {
  //Update the recipe servings in the state
  model.updateServings(currentServing);

  //Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //Update recipe
  recipeView.update(model.state.recipe);

  //render bookmark
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function(){
  bookmarkView.render(model.state.bookmarks)
}

const controlAddRecipe = async function(newRecipe){
  try{

    //render Spinner
    addRecipeView.renderSpinner()
    
    await model.uploadRecipe(newRecipe)
   
    
    //render recipe
    recipeView.render(model.state.recipe)

    //render message
    addRecipeView.renderMessage()

    //render bookmarkview
    bookmarkView.render(model.state.bookmarks)

    //Change ID url
    window.history.pushState(null, '', `#${model.state.recipe.id}`)
    //Close form window
    
    setTimeout(function(){
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 100)

  }catch(err){
    console.error('💥', err)
    addRecipeView.renderError(err.message)
  }
}


const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);

  recipeView.addHandlerRender(controllerRecipe);

  searchView.addHandlerSearch(controllerSearchResults);

  recipeView.addHandlerBookmark(controlAddBookmark);

  paginationView.addPaginationHandler(controllerPaginationBtn);

  recipeView.addHandlerUpdateServing(controlServings);

  addRecipeView.addHandlerUpload(controlAddRecipe)


};

init();


