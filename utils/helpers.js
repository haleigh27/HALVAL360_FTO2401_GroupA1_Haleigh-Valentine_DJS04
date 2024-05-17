import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';
import '../components/book-previews.js';

/*---------------------------------------DOM Elements---------------------------------------*/
export const elements = {
    dataSearchCancel: document.querySelector('[data-search-cancel]'),
    dataHeaderSearch: document.querySelector('[data-header-search]'),
    dataSearchTitle: document.querySelector('[data-search-title]'),
    dataSearchForm: document.querySelector('[data-search-form]'),
    dataListMessage: document.querySelector('[data-list-message]'),
    dataListItems: document.querySelector('[data-list-items]'),
    dataSettingsCancel: document.querySelector('[data-settings-cancel]'),
    dataHeaderSettings: document.querySelector('[data-header-settings]'),
    dataSettingsForm: document.querySelector('[data-settings-form]'),
    dataListButton: document.querySelector('[data-list-button]'),
    dataListClose: document.querySelector('[data-list-close]'),
    dataListActive: document.querySelector('[data-list-active]'),
    dataListBlur: document.querySelector('[data-list-blur]'),
    dataListImage: document.querySelector('[data-list-image]'),
    dataListTitle: document.querySelector('[data-list-title]'),
    dataListSubtitle: document.querySelector('[data-list-subtitle]'),
    dataListDescription: document.querySelector('[data-list-description]'),
    dataSettingsTheme: document.querySelector('[data-settings-theme]'),
    dataSearchOverlay: document.querySelector('[data-search-overlay]'),
    dataSettingsOverlay: document.querySelector('[data-settings-overlay]'),

    // Custom Components
    bookPreviews: document.querySelector('book-previews'),
};

/*------------------------------------------------------------------------------------------*/

/*-----------------------------------------FUNCTIONS----------------------------------------*/

//Abstaction of re-used code

// /**
//  * Function renders a list of preview buttons for books
//  *
//  * @param {array} matches
//  * @param {number} page - current page (start at 0)
//  */
// export function renderPreviewButtons(matches, page) {
//     const fragment = document.createDocumentFragment();

//     for (const { author, id, image, title } of matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)) {
//         const buttonElement = document.createElement('button');
//         buttonElement.classList = 'preview';
//         buttonElement.setAttribute('data-preview', id);

//         buttonElement.innerHTML = `
//             <img
//                 class="preview__image"
//                 src="${image}"
//             />

//             <div class="preview__info">
//                 <h3 class="preview__title">${title}</h3>
//                 <div class="preview__author">${authors[author]}</div>
//             </div>
//         `;

//         fragment.appendChild(buttonElement);
//     }

//     elements.dataListItems.appendChild(fragment);
// }

/**
 * Function renders a fragment of option elements and appends it to a select tag with a 'data-search-${category}' tag.
 *
 * @param {string} categoryName
 * @param {object} categoryData
 */
export function renderSearchOptions(categoryName, categoryData) {
    const category = categoryName.toLowerCase();
    const optionHTML = document.createDocumentFragment();
    const firstOptionElement = document.createElement('option');
    firstOptionElement.value = 'any';
    firstOptionElement.innerText = `All ${category}`;
    optionHTML.appendChild(firstOptionElement);

    for (const [id, name] of Object.entries(categoryData)) {
        const element = document.createElement('option');
        element.value = id;
        element.innerText = name;
        optionHTML.appendChild(element);
    }

    document.querySelector(`[data-search-${category}]`).appendChild(optionHTML);
}

/**
 * Initialises light or dark theme
 */
export function initialiseTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        elements.dataSettingsTheme.value = 'night';
        setTheme('night');
    } else {
        elements.dataSettingsTheme.value = 'day';
        setTheme('day');
    }
}

/**
 *
 * @param {('night'|'day')} theme
 */
export function setTheme(theme) {
    if (theme === 'night') {
        document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
        document.documentElement.style.setProperty('--color-light', '10, 10, 20');
    } else {
        document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
        document.documentElement.style.setProperty('--color-light', '255, 255, 255');
    }
}

/**
 * Function updates the number of books remaining and disables the button if the user is on the last page.
 */
export function showMoreBtn(matches, page) {
    elements.dataListButton.disabled = matches.length - page * BOOKS_PER_PAGE < 1;

    elements.dataListButton.innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${
            matches.length - page * BOOKS_PER_PAGE > 0 ? matches.length - page * BOOKS_PER_PAGE : 0
        })</span>
    `;
}

/**
 *
 * @param {boolean} open
 */
export function toggleSearchOverlay(open) {
    elements.dataSearchOverlay.open = open ? true : false;
}

/**
 *
 * @param {boolean} open
 */
export function toggleSettingsOverlay(open) {
    elements.dataSettingsOverlay.open = open ? true : false;
}

/*------------------------------------------------------------------------------------------*/
