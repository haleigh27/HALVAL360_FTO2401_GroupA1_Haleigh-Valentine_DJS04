import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';

let page = 1;
let matches = books;

createPreviewButtons(matches, 0);

createSearchOptions('genres', genres);
createSearchOptions('authors', authors);

//theme
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.querySelector('[data-settings-theme]').value = 'night';
    setTheme('night');
} else {
    document.querySelector('[data-settings-theme]').value = 'day';
    setTheme('day');
}

// show more button (bottom of screen)
document.querySelector('[data-list-button]').innerText = `Show more (${books.length - BOOKS_PER_PAGE})`; //FIXME: Overridden by innerHTML?
showMoreBtn();

setupEventListeners();

/*---------------------------------------Event Listenners---------------------------------------*/
function setupEventListeners() {
    /*---- Search Modal Event Listeners ----*/

    // Cancel search modal event listener
    document.querySelector('[data-search-cancel]').addEventListener('click', () => {
        toggleSearchOverlay(false);
    });

    // Open search modal event listener
    document.querySelector('[data-header-search]').addEventListener('click', () => {
        toggleSearchOverlay(true);
        document.querySelector('[data-search-title]').focus();
    });

    // Submit search modal settings
    document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
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
            document.querySelector('[data-list-message]').classList.add('list__message_show');
        } else {
            document.querySelector('[data-list-message]').classList.remove('list__message_show');
        }

        document.querySelector('[data-list-items]').innerHTML = '';

        createPreviewButtons(matches, 0);

        showMoreBtn();

        window.scrollTo({ top: 0, behavior: 'smooth' });
        toggleSearchOverlay(false);
    });

    /*---- Settings/Theme Modal Event Listeners ----*/

    // Cancel theme setting overlay event listener
    document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
        toggleSettingsOverlay(false);
    });

    // Open theme setting overlay event listener
    document.querySelector('[data-header-settings]').addEventListener('click', () => {
        toggleSettingsOverlay(true);
    });

    // Submit theme setting event listener
    document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const { theme } = Object.fromEntries(formData);

        setTheme(theme);

        toggleSettingsOverlay(false);
    });

    /*---- Show More Button Event Listeners ----*/

    // show more button event listener
    document.querySelector('[data-list-button]').addEventListener('click', () => {
        createPreviewButtons(matches, page);
        page += 1;
        showMoreBtn();
    });

    /*---- View Book Details Event Listener ----*/

    //Close book details event listener
    document.querySelector('[data-list-close]').addEventListener('click', () => {
        document.querySelector('[data-list-active]').open = false;
    });

    // Display active book details event listener
    document.querySelector('[data-list-items]').addEventListener('click', (event) => {
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
            document.querySelector('[data-list-active]').open = true;
            document.querySelector('[data-list-blur]').src = active.image;
            document.querySelector('[data-list-image]').src = active.image;
            document.querySelector('[data-list-title]').innerText = active.title;
            document.querySelector('[data-list-subtitle]').innerText = `${authors[active.author]} (${new Date(
                active.published
            ).getFullYear()})`;
            document.querySelector('[data-list-description]').innerText = active.description;
        }
    });
}

/*---------------------------------------FUNCTIONS---------------------------------------*/

//Abstaction of re-used code

// Renerdering preview buttons
function createPreviewButtons(matches, page) {
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

    document.querySelector('[data-list-items]').appendChild(fragment);
}

//genres authors search options
function createSearchOptions(categoryName, categoryData) {
    const optionHTML = document.createDocumentFragment();
    const firstOptionElement = document.createElement('option');
    firstOptionElement.value = 'any';
    firstOptionElement.innerText = `All ${categoryName}`;
    optionHTML.appendChild(firstOptionElement);

    for (const [id, name] of Object.entries(categoryData)) {
        const element = document.createElement('option');
        element.value = id;
        element.innerText = name;
        optionHTML.appendChild(element);
    }

    document.querySelector(`[data-search-${categoryName}]`).appendChild(optionHTML);
}

// SetTheme
function setTheme(theme) {
    if (theme === 'night') {
        document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
        document.documentElement.style.setProperty('--color-light', '10, 10, 20');
    } else {
        document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
        document.documentElement.style.setProperty('--color-light', '255, 255, 255');
    }
}

// showMoreBtn
function showMoreBtn() {
    document.querySelector('[data-list-button]').disabled = matches.length - page * BOOKS_PER_PAGE < 1;

    document.querySelector('[data-list-button]').innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${
            matches.length - page * BOOKS_PER_PAGE > 0 ? matches.length - page * BOOKS_PER_PAGE : 0
        })</span>
    `;
}

// toggleSearchOverlay
/*
function toggleSearchOverlay(state) {
    const dataSearchOverlay = document.querySelector('[data-search-overlay]');
    state === open ? (dataSearchOverlay.open = true) : (dataSearchOverlay.open = false);
}
*/

function toggleSearchOverlay(open) {
    const dataSearchOverlay = document.querySelector('[data-search-overlay]');
    dataSearchOverlay.open = open ? true : false;
}

function toggleSettingsOverlay(open) {
    const dataSettingsOverlay = document.querySelector('[data-settings-overlay]');
    dataSettingsOverlay.open = open ? true : false;
}
