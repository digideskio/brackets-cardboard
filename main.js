/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, Mustache, _ */

/** 
    brackets-cardboard Brackets Cardboard Extension
    Manage packages/dependencies for your project.
    Copyright 2014 Kyle Hornberg
    LICENSE Apache 2.0
*/

define(function (require, exports, module) {
    'use strict';

    // Modules
    var CommandManager    = brackets.getModule("command/CommandManager"),
        Menus             = brackets.getModule("command/Menus"),
        PanelManager      = brackets.getModule("view/PanelManager"),
        ExtensionUtils    = brackets.getModule("utils/ExtensionUtils"),
        AppInit           = brackets.getModule("utils/AppInit"),
        FileSystem        = brackets.getModule("filesystem/FileSystem"),
        _                 = brackets.getModule("thirdparty/lodash"),

        // Setup Extension
        moduleDirectory   = ExtensionUtils.getModulePath(module),
        managerDirectory  = moduleDirectory + "modules/managers",

        // Extension modules
        Interface         = require("modules/Interface"),
        Strings           = require("strings"),

        // Extension variables
        COMMAND_ID        = "brackets-cardboard.cardboardTogglePanel",
        $icon             = $( "<a href='#' title='" + Strings.EXTENSION_NAME + "' class='brackets-cardboard-icon'></a>" ),
        panel             = null;

// Tests in lieu of unittest not working-----------------------
    var m = Interface.getManagers();
    console.log("returned managers", m);

    //Deferred returns
    waitForIt(Interface.getAvailable(), "getAvailable");
    var i = Interface.install(m[0], "Package 1");

    wait(i, "install");
    wait(Interface.uninstall(m[0], "package :( "), "uninstall");
    wait(Interface.update(m[0], "package ..."), "update");
    waitForIt(Interface.search(m[1], "PKG"), "seach single");
    waitForIt(Interface.search("PKG"), "search all");
    waitForIt(Interface.list(m[0]), "list single");
    waitForIt(Interface.list(), "list all");
//    testData.openReadme  = Interface.openReadme(testData.getManagers[0], "PACKage");
//    testData.openUrl     = Interface.openUrl(testData.getManagers[0], "pakage");

    function waitForIt (promise, msg) {
        $.when.apply($, promise).then(function () {
                var e = arguments;
                console.log(msg + " promise:", e);
            });
    }

    function wait (promise, msg) {
        $.when(promise).then(function (data) {
                console.log(data, msg);
            });
    }
// --------------------------------------------------------------

    // Load CSS
    ExtensionUtils.loadStyleSheet(module, "css/brackets-cardboard.css");
    ExtensionUtils.loadStyleSheet(module, "css/font-awesome.min.css");

    // UI Methods

    /**
     * Show the cardboard panel
     */
    function cardboardTogglePanel(toggle) {
        if(panel.isVisible() || toggle) {
            panel.hide();
            $icon.removeClass("active");
            CommandManager.get(COMMAND_ID).setChecked(false);
        }
        else {
            panel.show();
            $icon.addClass("active");
            CommandManager.get(COMMAND_ID).setChecked(true);
        }
    }

    function listManagers(data, selector) {
        var template = require("text!html/managers.html"),
            templateData = _.merge({"getAvailable" : data }, Strings),
            templateHtml = Mustache.render(template, templateData);
console.log(templateData);
        $(selector).html(templateHtml);
    }

    function updateResults(data, selector) {
        var template = require("text!html/results.html"),
            templateData = _.merge(data, Strings),
            templateHtml = Mustache.render(template, templateData),
            $showButton = $('#brackets-cardboard-show');;

        $(selector).html(templateHtml);
        $showButton.html(Strings.HIDE_INSTALLED);
    }

    function addPanel(data) {
        var template = require("text!html/panel.html");
        var panelHtml = Mustache.render(template, data);

        panel = PanelManager.createBottomPanel(COMMAND_ID, $(panelHtml), 200);

        // Listeners for panel
        var $cardboardPanel = $("#brackets-cardboard");

        $cardboardPanel
            .on( "click", ".close", function () {
                console.log("close");
                cardboardTogglePanel(false);
            })
            .on( "click", "#brackets-cardboard-show", function () {
                console.log("show");
                var $results = $('tr:not([class=""])', $('.brackets-cardboard-table tbody')),
                // var $results = $('tr:not(.brackets-cardboard-result-installed):not(.brackets-cardboard-result-update)', $('.brackets-cardboard-table tbody')),
                    $showButton = $('#brackets-cardboard-show');


// test search data display
        var data = { "results" : _.flatten(testData.list) };
        data.results[0].installed = "installed";
        // data.results[2].installed = "update";
        updateResults(data, '.brackets-cardboard-table');

                // if results are present (eg. a search performed)
                // $results.toggle();
                // else show only the installed packages
                // var installed = Interface.getInstalled();
                // updateResults(installed, '.brackets-cardboard-table');

                if ($showButton.html() === Strings.HIDE_INSTALLED) {
                    $(this).html(Strings.SHOW_INSTALLED);
                } else {
                    $(this).html(Strings.HIDE_INSTALLED);
                }
            })
            .on( "keydown", ".brackets-cardboard-search input", function (event) {
                if(event.which === 13) {
                    var query = $(this).val(),
                        manager = $('#brackets-cardboard-managers .dropdown').text();
                    console.log("search " + query + " manager " + manager);
                    if (manager === Strings.SEARCH_ALL) {
                        Interface.search(query);
                    } else {
                        Interface.search(manager, query);
                    }
                }
            })
            .on( "click", ".brackets-cardboard-manager", function () {
                console.log($(this).text());
                $(this).parent().prev().html($(this).text() + ' <span class="caret"></span>');
            })
            .on( "click", ".brackets-cardboard-install", function () {
                var id = $(this).parents("tr").attr("data-id"),
                    manager = $(this).parents("tr").attr("data-manager");
                console.log("instal " + id + " manager " + manager);
                $.when( Interface.install(manager, id) ).then (
                    function (s) { console.log(s);}
                    );
            })
            .on( "click", ".brackets-cardboard-update", function () {
                var id = $(this).parents("tr").attr("data-id"),
                    manager = $(this).parents("tr").attr("data-manager");
                console.log("update " + id + " manager " + manager);
                $.when( Interface.update(manager, id) ).then (
                    function (s) { console.log(s);}
                    );

            })
            .on( "click", ".brackets-cardboard-uninstall", function () {
                var id = $(this).parents("tr").attr("data-id"),
                    manager = $(this).parents("tr").attr("data-manager");
                console.log("uninstall " + id + " manager " + manager);
                $.when( Interface.uninstall(manager, id) ).then (
                    function (s) { console.log(s);}
                    );
            })
        ;
    }

    function init () {
        addPanel(Strings);
        $.when.apply($, testData.getAvailable).then(function () {
            var a = arguments,
                e = [];
            for (var i = a.length - 1; i >= 0; i--) {
                e.push(a[i]);
            };
            listManagers(e, '#brackets-cardboard-managers');
        });

    }

    // Listener for toolbar icon
    $icon.click(function () {
        CommandManager.execute(COMMAND_ID);
    }).appendTo("#main-toolbar .buttons");

    // View menu
    // TODO remove?
    CommandManager.register(Strings.MENU_NAME, COMMAND_ID, cardboardTogglePanel);
    var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
    menu.addMenuItem(COMMAND_ID);


    AppInit.appReady(function () {
        init();

    });

});
