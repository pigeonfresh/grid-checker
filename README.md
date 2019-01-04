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

```
new GridChecker({
    columns: 4,
    gutter: 20,
    maxWidth: 1360,
    padding: 20,
    color: 'tomato',
    className: 'grid-layout',
})
```