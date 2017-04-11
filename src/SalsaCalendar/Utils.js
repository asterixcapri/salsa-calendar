/* Salsa Calendar
 * https://github.com/asterixcapri/salsa-calendar
 *
 * (C) Copyright 2002-2016, Capri Online S.r.l. All rights reserved.
 *
 * Authors: Alessandro Astarita <aleast@caprionline.it>
 *          Mario Landolfo <mario@caprionline.it>
 *
 */

'use strict';

var Utils = {};

Utils.getElementsByClassName = function(elem, class_name)
{
    var elements = elem.getElementsByTagName('*');
    var tmp = [];
    var reg = "(^|\\s)" + class_name + "(\\s|$)";

    for (var i = 0; i < elements.length; i++) {
        // Cache the current element to prevent memory leaks
        var e = elements[i];

        if (e.className.match && e.className.match(reg)) {
            // To improve performance when appending a new array item use the length
            // to increment the current index
            tmp[tmp.length] = e;
        }
    }

    return tmp;
};

Utils.elementHasClass = function(elem, class_name)
{
    var classes = elem.className.split(" ");

    return classes.indexOf(class_name) !== -1;
};

Utils.findElementPosition = function(elem)
{
    var x = 0;
    var y = 0;

    while (elem) {
        x += elem.offsetLeft;
        y += elem.offsetTop;

        elem = elem.offsetParent;
    }

    return {
        left: x,
        top: y
    };
};

Utils.isElementVisible = function(elem)
{
    var w = elem.offsetWidth;
    var h = elem.offsetHeight;

    if ((w === 0) && (h === 0)) {
        return false;
    }

    if ((w > 0) && (h > 0)) {
        return true;
    }

    return elem.display !== "none";
};

Utils.getEvent = function(event)
{
    return event || window.event;
};

Utils.getEventTarget = function(event)
{
    event = Utils.getEvent(event);

    return event.target || window.event.srcElement;
};

Utils.addEvent = function(elem, event, callback)
{
    if (elem.addEventListener) {
        elem.addEventListener(event, callback, false);
    }
    else if (elem.attachEvent) {
        elem.attachEvent("on" + event, callback);
    }
};

Utils.isMobile = function()
{
    var current_device_width = (window.innerWidth > 0)
        ? window.innerWidth
        : screen.width;

    return current_device_width <= 480;
};

module.exports = Utils;
