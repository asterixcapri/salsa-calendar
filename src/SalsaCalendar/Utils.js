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

Utils.findPosition = function(elem)
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

Utils.getEvent = function(event)
{
    return event || window.event;
};

Utils.getEventTarget = function(event)
{
    event = Utils.getEvent(event);

    return event.target || window.event.srcElement;
};

Utils.getElementsByClassName = function(element, class_name)
{
    var elements = element.getElementsByTagName('*');
    var tmp = [];
    var reg = "(^|\\s)" + class_name + "(\\s|$)";

    for (var i = 0; i < elements.length; i++) {
        // Cache the current element to prevent memory leaks
        var e = elements[i];

        if (e.className.match && (e.className.match(reg))) {
            // To improve performance when appending a new array item use the length
            // to increment the current index
            tmp[tmp.length] = e;
        }
    }

    return tmp;
};

Utils.addEvent = function(element, event, callback)
{
    if (element.addEventListener) {
        element.addEventListener(event, callback, false);
    }
    else if (element.attachEvent) {
        element.attachEvent("on" + event, callback);
    }
};

Utils.getRandomString = function(count)
{
    if (count === undefined) {
        count = 6;
    }

    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < count; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
};

Utils.isVisible = function(elem)
{
    var w = elem.offsetWidth;
    var h = elem.offsetHeight;

    if (w === 0 && h === 0) {
        return false;
    }

    if (w > 0 && h > 0) {
        return true;
    }

    return elem.display !== "none";
};

Utils.isTouchDevice = function()
{
    return ('ontouchstart' in window)
        || (navigator.MaxTouchPoints > 0)
        || (navigator.msMaxTouchPoints > 0);
};

module.exports = Utils;
