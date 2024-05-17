import { books, authors } from './utils/data.js';
import './components/book-previews.js';
import { SearchField } from './components/search-field.js';

import {
    elements,
    //renderPreviewButtons,
    //renderSearchOptions,
    initialiseTheme,
    setTheme,
    showMoreBtn,
    toggleSearchOverlay,
    toggleSettingsOverlay,
} from './utils/helpers.js';

/*------------------------------------------------------------------------------------------*/

let page = 1;
let matches = books;

elements.bookPreviews.setMatchesAndPage(matches, 0);

// renderSearchOptions('genres', genres);
// renderSearchOptions('authors', authors);

initialiseTheme();

showMoreBtn(matches, page);

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
        const filters = Object.fromEntries(formData.entries());
        // Merge with selected values from SearchField
        Object.assign(filters, SearchField.selectedValues);
        console.log(filters);
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

        //elements.dataListItems.innerHTML = '';

        elements.bookPreviews.setMatchesAndPage(matches, 0);

        showMoreBtn(matches, page);

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
        elements.bookPreviews.setMatchesAndPage(matches, page);
        page += 1;
        showMoreBtn(matches, page);
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
