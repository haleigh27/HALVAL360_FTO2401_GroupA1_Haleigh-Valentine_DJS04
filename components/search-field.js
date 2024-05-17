import { authors, genres } from '../data.js';

const template = document.createElement('template');
template.innerHTML = `
    <style>
        .overlay__input {
            width: 100%;
            margin-bottom: 0.5rem;
            background-color: rgba(var(--color-dark), 0.05);
            border-width: 0;
            border-radius: 6px;
            width: 100%;
            height: 4rem;
            color: rgba(var(--color-dark), 1);
            padding: 1rem 0.5rem 0 0.75rem;
            font-size: 1.1rem;
            font-weight: bold;
            font-family: Roboto, sans-serif;
            cursor: pointer;
        }

        .overlay__input_select {
            padding-left: 0.5rem;
        }
        .overlay__field {
            position: relative;
            display: block;
        }

        .overlay__label {
            position: absolute;
            top: 0.75rem;
            left: 0.75rem;
            font-size: 0.85rem;
            color: rgba(var(--color-dark), 0.4);
        }

        .overlay__input:hover {
            background-color: rgba(var(--color-dark), 0.1);
        }
    </style>
    <label class="overlay__field">
        <div class="overlay__label"></div>
        <select class="overlay__input overlay__input_select">
            <option value="any"></option>
        </select>
    </label>
`;

export class SearchField extends HTMLElement {
    /**
     * @type {string}
     */
    #label = this.getAttribute('label');

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        console.log(this.#label);
        const capLabel = this.#label.charAt(0).toUpperCase() + this.#label.slice(1);
        this.shadowRoot.querySelector('.overlay__label').innerText = capLabel;

        const select = this.shadowRoot.querySelector('select');
        select.setAttribute(`data-search-${this.#label}s`, '');
        select.setAttribute('name', this.#label);

        const defaultOption = this.shadowRoot.querySelector('option');
        defaultOption.innerText = `All ${capLabel}s`;

        if (this.#label === 'genre') {
            this.renderSearchOptions(genres);
        } else if (this.#label === 'author') {
            this.renderSearchOptions(authors);
        }
    }

    renderSearchOptions(category) {
        for (const [id, name] of Object.entries(category)) {
            const element = document.createElement('option');
            element.value = id;
            element.innerText = name;
            this.shadowRoot.querySelector('select').appendChild(element);
        }
    }
}
customElements.define('search-field', SearchField);
