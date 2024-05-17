import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';

let page = 1;
let matches = books;

/*---------------------------------------DOM Elements---------------------------------------*/
const elements = {
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
};

/*------------------------------------------------------------------------------------------*/
renderPreviewButtons(matches, 0);

renderSearchOptions('genres', genres);
renderSearchOptions('authors', authors);

initialiseTheme();

showMoreBtn();

setupEventListeners();

/*-------------------------------------Event Listenners-------------------------------------*/
function setupEventListeners() {
    /*---- Search Modal Event Listeners ----*/

    // Cancel search modal event listener
    elements.dataSearchCancel.addEventListener('click', () => {
        toggleSearchOverlay(false);
    });

    // Open search modal event listener
    elements.dataHeaderSearch.addEventListener('click', () => {
        toggleSearchOverlay(true);
        elements.dataSearchTitle.focus();
    });

    // Submit search modal settings
    elements.dataSearchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const filters = Object.fromEntries(formData);
        const result = [];

        for (const book of books) {
            let genreMatch = filters.genre === 'any';

            for (const singleGenre of book.genres) {
                if (genreMatch) break;
                if (singleGenre === filters.genre) {
                    genreMatch = true;
                }
            }

            if (
                (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
                (filters.author === 'any' || book.author === filters.author) &&
                genreMatch
            ) {
                result.push(book);
            }
        }

        page = 1;
        matches = result;

        if (result.length < 1) {
            elements.dataListMessage.classList.add('list__message_show');
        } else {
            elements.dataListMessage.classList.remove('list__message_show');
        }

        elements.dataListItems.innerHTML = '';

        renderPreviewButtons(matches, 0);

        showMoreBtn();

        window.scrollTo({ top: 0, behavior: 'smooth' });
        toggleSearchOverlay(false);
    });

    /*---- Settings/Theme Modal Event Listeners ----*/

    // Cancel theme setting overlay event listener
    elements.dataSettingsCancel.addEventListener('click', () => {
        toggleSettingsOverlay(false);
    });

    // Open theme setting overlay event listener
    elements.dataHeaderSettings.addEventListener('click', () => {
        toggleSettingsOverlay(true);
    });

    // Submit theme setting event listener
    elements.dataSettingsForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const { theme } = Object.fromEntries(formData);

        setTheme(theme);

        toggleSettingsOverlay(false);
    });

    /*---- Show More Button Event Listeners ----*/

    // show more button event listener
    elements.dataListButton.addEventListener('click', () => {
        renderPreviewButtons(matches, page);
        page += 1;
        showMoreBtn();
    });

    /*---- View Book Details Event Listener ----*/

    //Close book details event listener
    elements.dataListClose.addEventListener('click', () => {
        elements.dataListActive.open = false;
    });

    // Display active book details event listener
    elements.dataListItems.addEventListener('click', (event) => {
        const pathArray = Array.from(event.path || event.composedPath());
        let active = null;

        for (const node of pathArray) {
            if (active) break;

            if (node?.dataset?.preview) {
                let result = null;

                for (const singleBook of books) {
                    if (result) break;
                    if (singleBook.id === node?.dataset?.preview) result = singleBook;
                }

                active = result;
            }
        }

        if (active) {
            elements.dataListActive.open = true;
            elements.dataListBlur.src = active.image;
            elements.dataListImage.src = active.image;
            elements.dataListTitle.innerText = active.title;
            elements.dataListSubtitle.innerText = `${authors[active.author]} (${new Date(
                active.published
            ).getFullYear()})`;
            elements.dataListDescription.innerText = active.description;
        }
    });
}

/*-----------------------------------------FUNCTIONS----------------------------------------*/

//Abstaction of re-used code

/**
 * Function renders a list of preview buttons for books
 *
 * @param {array} matches
 * @param {number} page - current page (start at 0)
 */
function renderPreviewButtons(matches, page) {
    const fragment = document.createDocumentFragment();

    for (const { author, id, image, title } of matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)) {
        const buttonElement = document.createElement('button');
        buttonElement.classList = 'preview';
        buttonElement.setAttribute('data-preview', id);

        buttonElement.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `;

        fragment.appendChild(buttonElement);
    }

    elements.dataListItems.appendChild(fragment);
}

/**
 * Function renders a fragment of option elements and appends it to a select tag with a 'data-search-${category}' tag.
 *
 * @param {string} categoryName
 * @param {object} categoryData
 */
function renderSearchOptions(categoryName, categoryData) {
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
function initialiseTheme() {
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
function setTheme(theme) {
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
function showMoreBtn() {
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
function toggleSearchOverlay(open) {
    elements.dataSearchOverlay.open = open ? true : false;
}

/**
 *
 * @param {boolean} open
 */
function toggleSettingsOverlay(open) {
    elements.dataSettingsOverlay.open = open ? true : false;
}
