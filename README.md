# Project: Book Connect - Abstractions (DJS03) and Web Components (DJS04)

The "Book Connect" application renders a list of previews of books in a database. Each preview is a button styled to display the book cover image, title and author.

User interactions available include:

-   Changing the theme (day and night)
-   Filtering the book previews by Title, Author and Genre
-   Clicking on a book to view more details (description and year published)

![alt text](image.png)

## Discussion and Reflection Report (DJS03 Project: Book Connect - Abstractions)

### Changes and rational

##### Rendering list of preview buttons

-   Refactored creating a function with parameters for the array of books and the current page.
-   This function can now be reused and called when needed.

##### Rendering author and genre filter options

-   The code for rendering the author and genre was repetititive so I refactored it by creating one function that can be called by passing in two arguments. Argument one is the filter category name as a string and argument 2 is the data object containing the options as key value pairs.
-   This single function can now be reused to render the author and genre options in the search modal.

##### Setting the theme

-   Refactored the code to set the theme by creating a function with a theme parameter for day or night. This function was called in two instances to replace code was repetitive (in the initialise theme functions and the event listener for the theme modal).

##### Show more button

-   Refactored the code to render the button to show more books by creating a function which can be reused. This function was eventually called three times in the code.

##### Search and Settings overlay

-   Created a toggle function for the seach and settings overlay which takes in a boolean as an argument. This is more readable and prevents errors related to selecting the correct element. Both were used multiple times.

##### Event listeners

-   Grouped all event listeners into a function.

##### Element selectors

-   Grouped all the selectors in an elements object.

##### JSDOC

-   Added js documentation for the functions and comments for the rest of the code.

### Challenges

-   The challenges I faced mainly related to identifying how much to refactor the code. I mainly refactored repetitive code.

### Reflections

-   This project was challenging as there was no strict guideline of what to do or what to refactor. It was a good learning experience.

## Discussion and Reflection Report (DJS04 Project: Book Connect - Web Components)

### Changes and rational

-   Transform the book preview functionality of the "Book Connect" application into a fully operational Web Component to meet objective.

### Reflections

-   I found converting the functionality to a fully functional web component quite challenging as I initially struggled to make the styling work correctly.
