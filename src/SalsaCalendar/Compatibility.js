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

var Compatibility = {};

Compatibility.findPosition = function(elem)
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

Compatibility.getEvent = function(event)
{
    return event || window.event;
};

Compatibility.getEventTarget = function(event)
{
    event = Compatibility.getEvent(event);

    return event.target || window.event.srcElement;
};

Compatibility.getElementsByClassName = function(element, class_name)
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

Compatibility.addEvent = function(element, event, callback)
{
    if (element.addEventListener) {
        element.addEventListener(event, callback, false);
    }
    else if (element.attachEvent) {
        element.attachEvent("on" + event, callback);
    }
};

Compatibility.getRandomString = function(count)
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

Compatibility.isVisible = function(elem)
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

Compatibility.isTouchDevice = function()
{
    return ('ontouchstart' in window)
        || (navigator.MaxTouchPoints > 0)
        || (navigator.msMaxTouchPoints > 0);
};

if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function() {},
            fBound = function() {
                return fToBind.apply(
                    this instanceof fNOP && oThis ? this : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments))
                );
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(obj, start) {
         for (var i = (start || 0), j = this.length; i < j; i++) {
             if (this[i] === obj) {
                 return i;
             }
         }

         return -1;
    };
}

module.exports = Compatibility;
