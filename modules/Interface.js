/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */

/**
 * Provides the abstract interface for all managers.
 * @class  Interface
 * @classdesc While not strictly an abstract class in the OOP sense it acts as an interface
 * between the GUI and manager modules. Managers implement most of the the class methods.
 * @todo  Dynamically load and add managers
 */

define(function (require, exports, module) {
    'use strict';

    // Dependencies
    var ExtensionUtils   = brackets.getModule("utils/ExtensionUtils"),
        moduleDirectory  = ExtensionUtils.getModulePath(module),
        managerDirectory = moduleDirectory + "managers/",

        //Tests directory
        // managerDirectory    = moduleDirectory + "../tests/managers/",

        /**
         * @example
         * 
         * Managers are added here by hand currently. Do so by adding the manager file name to the managerModules array.
         * Then add a new variable that follows the present pattern.
         * TODO Dynamically load managers
         */

        /**
         * The name of the manager file. Include the .js extension. This should also be the name of the manager within the module.
         * @param managerModules
         * @type {Array}
         */
        // managerModules      = ["example.js", "example2.js", "template.js"];
        managerModules      = ["bower.js", "npm.js"];

    /**
     * Install package/dependency
     * @memberof Interface
     * @abstract
     * @param  {String} managerModule Manager name as defined in the `managerModules` array
     * @param  {String} packageName   Unique package/dependency name
     * @return {Status}               Deferred* Installed Status object
     */
    function install (managerModule, packageName) {
        var deferred = $.Deferred();

        require([managerDirectory + managerModule], function (manager) {
            deferred.resolve( manager.install(packageName) );
        });
        return deferred.promise();
    }

    /**
     * Uninstall package/dependency
     * @memberof Interface
     * @abstract
     * @param  {String} managerModule Manager name as defined in the `managerModules` array
     * @param  {String} packageName   Unique package/dependency name
     * @return {Status}               Deferred* Uninstalled Status object
     */
    function uninstall (managerModule, packageName) {
        var deferred = $.Deferred();

        require([managerDirectory + managerModule], function (manager) {
            deferred.resolve( manager.uninstall(packageName) );
        });
        return deferred.promise();
    }

    /**
     * Update package/dependency
     * @memberof Interface
     * @abstract
     * @param  {String} managerModule Manager name as defined in the `managerModules` array
     * @param  {String} packageName   Unique package/dependency name
     * @return {Status}               Deferred* Updated Status object
     */
    function update (managerModule, packageName) {
        var deferred = $.Deferred();

        require([managerDirectory + managerModule], function (manager) {
            deferred.resolve( manager.update(packageName) );
        });
        return deferred.promise();
    }

    /**
     * Searches one or more managers for a package
     * @memberof Interface
     * @abstract
     * @param  {String} searchManager Manager name as defined in the `managerModules` array. Optional
     * @param  {String} query         Search query
     * @return {Array}                Deferred* Search result objects
     */
    function search () {
        // search (searchManager, query)
        var searchManager = (arguments.length > 1) ? arguments[0] : undefined,
            query = (arguments.length > 1) ? arguments[1]: arguments[0],
            results = [];

        // search using a single manager
        if (searchManager !== undefined) {
            var deferred = $.Deferred();

            require([managerDirectory + searchManager], function (manager) {
                deferred.resolve(manager.search(query));
            });
            results.push(deferred.promise());

            return results;
        }

        managerModules.forEach(function (managerModule) {
            var deferred = $.Deferred();

            require([managerDirectory + managerModule], function (manager) {
                deferred.resolve(manager.search(query));
            });
            results.push(deferred.promise());
        });

        return results;
    }

    /**
     * Returns installed packages/dependencies
     * @memberof Interface
     * @abstract
     * @param  {String} managerName Manager name as defined in the `managerModules` array. Optional.
     * @return {Array}              Deferred* Array of Result objects
     */
    function getInstalled () {
        // getInstalled (managerName)
        var managerName = (arguments.length === 1) ? arguments[0] : undefined,
            results = [];

        if (managerName !== undefined) {
            var deferred = $.Deferred();

            require([managerDirectory + managerName], function (manager) {
                deferred.resolve(manager.getInstalled());
            });
            results.push(deferred.promise());

            return results;
        }

        managerModules.forEach(function (managerModule) {
            var deferred = $.Deferred();

            require([managerDirectory + managerModule], function (manager) {
                deferred.resolve(manager.getInstalled());
            });
            results.push(deferred.promise());
        });
        return results;
    }

    // Helper methods

    /**
     * Returns manager module names added to a static array
     * @memberof Interface
     * @return {Array} Manager module names
     */
    function getManagers () {
        return managerModules;
    }

    /**
     * Returns availble managers after a test is performed to ensure the manager is available
     * @memberof Interface
     * @return {Array} Deferred* Array of manager module names
     */
    function getAvailable () {
        var available = [];

        managerModules.forEach(function (managerModule) {
            var deferred = $.Deferred();

            require([managerDirectory + managerModule], function (manager) {
                    deferred.resolve(manager.isAvailable());
                });
            available.push(deferred.promise());
        });
        return available;
    }

    // TODO remove?
    // opens readme in default browser
    function openReadme (managerModule, packageName) {
        var NativeApp = brackets.getModule("utils/NativeApp");

        require([managerDirectory + managerModule], function (manager) {
            NativeApp.openURLInDefaultBrowser(manager.getReadme(packageName));
        });
    }

    // opens project url in default brwoser
    function openUrl (managerModule, packageName) {
        var NativeApp = brackets.getModule("utils/NativeApp");

        require([managerDirectory + managerModule], function (manager) {
            NativeApp.openURLInDefaultBrowser(manager.getUrl(packageName));
        });
    }

    // gets project url
    function getUrl (managerModule, packageName) {
        var deferred = $.Deferred();

        require([managerDirectory + managerModule], function (manager) {
            deferred.resolve(manager.getUrl(packageName));
        });
        return deferred.promise();
    }

    exports.install         = install;
    exports.uninstall       = uninstall;
    exports.update          = update;
    exports.search          = search;
    exports.getInstalled    = getInstalled;
    exports.getManagers     = getManagers;
    exports.getAvailable    = getAvailable;
    exports.openReadme      = openReadme;
    exports.openUrl         = openUrl;
    exports.getUrl          = getUrl;
});

//sdg
