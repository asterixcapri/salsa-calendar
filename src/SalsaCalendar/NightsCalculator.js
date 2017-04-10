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

var Utils = require('./Utils.js');

function NightsCalculator(options)
{
    this.from = options.from;
    this.to = options.to;
    this.nights_summary = document.getElementById(options.nightsNo);

    this.from.onSetCurrentDate(function() {
        this.updateNightsNo();
    }.bind(this));

    this.to.onSetCurrentDate(function() {
        this.updateNightsNo();
    }.bind(this));

    this.updateNightsNo();
}

NightsCalculator.prototype = {
    updateNightsNo: function()
    {
        var nights_counter = Utils.getElementsByClassName(this.nights_summary, "counter")[0];
        var nights_singular = Utils.getElementsByClassName(this.nights_summary, "singular")[0];
        var nights_plural = Utils.getElementsByClassName(this.nights_summary, "plural")[0];

        var nights_no = this._get_nights_no();

        if (!nights_no) {
            nights_counter.innerHTML = "";
            nights_plural.style.display = "none";
            nights_singular.style.display = "none";

            return;
        }

        nights_counter.innerHTML = nights_no;

        if (nights_no > 1) {
            nights_singular.style.display = "none";
            nights_plural.style.display = "";
        }
        else {
            nights_singular.style.display = "";
            nights_plural.style.display = "none";
        }
    },

    _get_nights_no: function()
    {
        var date_from = this.from.getCurrentDate();
        var date_to = this.to.getCurrentDate();

        var diff_time = date_to.getTime() - date_from.getTime();

        if (diff_time < 0) {
            return false;
        }

        return Math.round(diff_time / 1000 / 60 / 60 / 24);
    }
};

module.exports = NightsCalculator;
