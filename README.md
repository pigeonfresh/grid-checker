# Grid Checker
In order to use add Grid Checker to your projects with npm or yarn.

```
yarn add grid-checker
```

Import the module where you want to use it:

```
import GridChecker from 'grid-checker';
```

And specify the layout you want to use:

```javascript
new GridChecker({
    columns: 4,
    gutter: 20,
    maxWidth: 1360,
    padding: 20,
    color: 'tomato',
    className: 'grid-layout',
})
```

Toggle the visibility of the grid by hitting 'g' on the keyboard.

This will create a centered grid with a max-width of 1360px and 20px of padding on the left and right side.
The grid will contain 4 columns with a flexible width separated by a gutter of 20px.
Currently the className is optional but will give you the option to avoid css naming conflicts.

In order to update the values for different breakpoints you can add an array of settings.

```javascript
new GridChecker({
    columns: 4,
    gutter: 20,
    maxWidth: 1360,
    padding: 20,
    color: 'tomato',
    className: 'grid-layout',
    breakpoints: [
        {
          threshold: 768,
          columns: 12,
          padding: 100,
          gutter: 40,
          color: 'orange',
        }
    ],
})
```

## To-dos
- Make more settings optional
- Optimizations
- Include visual examples
- Add custom key-combinations for toggling the grid
- Explore more features