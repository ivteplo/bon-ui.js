# Contributing to Bon UI

:tada: Thanks for contributing to Bon UI :tada:

_Contributing guide is still under development._

## Table of contents

-   [Styleguides](#styleguides)
    -   [Git commit messages](#git-commit-messages)
    -   [JavaScript styleguide](#javascript-styleguide)

## Styleguides

### Git commit messages

-   Use present tense ("Add feature" and not "Added feature")
-   Use the imperative mood ("Update logging message" and not "Updates logging message")
-   Limit the first line to 72 characters or less
-   Reference issues and pull requests after the first line
-   Start a commit message with an [applicable emoji](https://gitmoji.carloscuesta.me/)

### JavaScript styleguide

-   Prefer the object spread operator (`{ ...anotherObject }`) to `Object.assign()`
-   Use inline `export`s with expressions when possible

    ```javascript
    // Use this:
    export class Name {}

    // Instead of this:
    class Name {}

    export { Name }
    ```

-   Prefer named exports instead of default export
-   Prefer ES6 modules instead of CommonJS
-   Prefer placing class static methods and properties before instance methods and properties
