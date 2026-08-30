import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View{
   _parentElement = document.querySelector('.pagination');
  _errorMessage = 'We could not find that recipe. Please try another one!';

  addPaginationHandler(handler){
    this._parentElement.addEventListener('click', function(e){
      const btn = e.target.closest('.btn--inline');
      if(!btn)return;
      console.log(btn)
      console.log(handler)
      const dataGoToPage = +btn.dataset.goto
      handler(dataGoToPage);
    })
  }

 
  _generateMarkup(){
    const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
     let currPage = this._data.page;
    console.log(numPages)
    console.log(this._data.page)
    //We are on page one and there are other pages
    if(currPage === 1 && numPages > 1){
      return `
          <button data-goto='${currPage + 1}' class="btn--inline pagination__btn--next">
            <span>Page ${currPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`
    }

    //We are on the last page
    
    if(currPage === numPages && numPages > 1){
      return `<button data-goto='${currPage - 1}' class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currPage - 1}</span>
          </button>`
    }
    
    //Other page
    if(currPage < numPages){
      return `<button data-goto='${currPage - 1}' class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currPage - 1}</span>
          </button>
          <button data-goTo='${currPage + 1}' class="btn--inline pagination__btn--next">
            <span>Page ${currPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`
    }

    //We are on page one there are no other pages
    
      return ''
    
  }
}

export default new PaginationView();