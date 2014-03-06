# Contirbuting

[Follow the brackets style](https://github.com/adobe/brackets/wiki/Brackets-Coding-Conventions). They are not my favorite but that's the app you are developing for so follow them.

## Developing a Manager

If you know of a manager you want access to, you can follow the template in `tests/managers/template.js` or one in the `modules/managers` folder. Those files (for now) serve as the documentation.

### Interface Documentation
(TODO)

Search results must be in a Result. Each data property can have HTML that is rendered. Be kind. The primary property will always be a link to the link property.


## Structure

Primarily, this project provides an interface (the OOP sense of the word) for managers and a view (the UI). A manager can be anything accessable by nodejs on the command line (e.g. npm, composer, bundle, gem, pypi, apt-get, etc.).

In other words, you can add "classes" that use the "interface". The rest of the project displays the data.

Cardboard uses the MV* architecture where * is unknown at this time.

`main.js` handles the setup, is the "view" and handles the user interaction
`modules/Interface.js` is the interface used by each manager; each manager is a "model"
`strings.js` localization
`domain.js` ?
`html/` html templates
`css/` css
`fonts/` fonts
`nls/` localization strings
`tests/` unit tests

`managers/bowerManager.js` manager for bower
`managers/npmManager.js` manager for npm


## Word Diagram

The `view` sends a command to the `interface`. The `interface` routes it to the correct `manager(s)`. Each `manager` executes the command for its `data store`.
The `data store` returns data to the `manager`. The `manager` formats the data and returns them to the `interface`. The `interface` returns the data the `view` for display.

### Terms
* data store - for this application the data store is the executable program (eg. npm, bower, etc.)