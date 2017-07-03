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

function Input(calendar, inputId, allowEmptyDate, inputReadOnly)
{
    this.calendar = calendar;
    this.input = document.getElementById(inputId);

    if (allowEmptyDate === undefined) {
        allowEmptyDate = false;
    }

    this.allowEmptyDate = allowEmptyDate;

    if (inputReadOnly === undefined) {
        inputReadOnly = false;
    }

    this.inputReadOnly = inputReadOnly;

    this._init_current_date();
    this._init_events();
}

Input.prototype = {
    _init_current_date: function()
    {
        var date = this.checkDate();

        if (date !== false) {
            this.calendar.setCurrentDate(date);
        }
        else if (!this.allowEmptyDate) {
            this.setDate(this.calendar.getRangeValidDate(this.calendar.getMinValidDate()));
            this.calendar.setCurrentDate(this.calendar.getRangeValidDate(this.calendar.getMinValidDate()));
        }

        if (this.inputReadOnly) {
            this.input.setAttribute("readonly", "readonly");
        }
    },

    _init_events: function()
    {
        this.input.onfocus = this.input.onclick = function() {
            this.calendar.hideOthers();

            if (!this.calendar.isShown()) {
                this.calendar.show();
            }
        }.bind(this);

        this.input.onblur = function() {
            var date = this.checkAndValidateDate();

            if (date === false) {
                this.setDate(this.calendar.getCurrentDate());
                this.setValidated();
            }
        }.bind(this);

        this.input.onkeyup = function(event) {
            event = Utils.getEvent(event);

            if (this._is_key_navigation(event.keyCode)) {
                return;
            }

            if (!this._is_key_valid(event.keyCode)) {
                this.setError();
                return;
            }

            var date = this.checkAndValidateDate();

            if (date !== false) {
                this.calendar.setCurrentDate(date);
                this.calendar.show(date.getFullYear(), date.getMonth());
            }
        }.bind(this);
    },

    _is_key_navigation: function(key)
    {
        return (key > 32) && (key < 41);
    },

    _is_key_valid: function(key)
    {
        return (key === 8) || // backspace
               (key === 46) || // delete
               (key === 47) || // slash "/"
               ((key >= 48) && (key <= 57)) || // 0-9
               ((key >= 96) && (key <= 105)) || // 0-9 numpad
               (key === 111); // slash "/" numpad
    },

    getElement: function()
    {
        return this.input;
    },

    setDate: function(date)
    {
        this.input.value = this.calendar.i18n.date2DateString(date);
    },

    getDate: function()
    {
        return this.calendar.i18n.dateString2Date(this.input.value);
    },

    checkDate: function()
    {
        var date = this.getDate();

        if (!date) {
            return false;
        }

        if (isNaN(date.getTime())) {
            return false;
        }

        if (!this._is_string_well_formed(this.input.value)) {
            return false;
        }

        if (!this.calendar.inRangeDate(date)) {
            return false;
        }

        return date;
    },

    checkAndValidateDate: function()
    {
        var date = this.checkDate();

        if (date === false) {
            this.setError();
            return false;
        }

        this.setValidated();

        return date;
    },

    _is_string_well_formed: function(date_string)
    {
        var input_date = this.calendar.i18n.dateString2Array(date_string);

        if ((input_date.day < 1) || (input_date.day > 31)) {
            return false;
        }

        if ((input_date.month < 1) || (input_date.month > 12)) {
            return false;
        }

        var year_upper_limit = new Date().getFullYear() + 10;

        if ((input_date.year < 1970) || (input_date.year > year_upper_limit)) {
            return false;
        }

        return true;
    },

    setError: function()
    {
        if (Utils.elementHasClass(this.input, "salsa-calendar-error")) {
            return;
        }

        this.input.className += " salsa-calendar-error";
    },

    setValidated: function()
    {
        this.input.className = this.input.className.replace(" salsa-calendar-error", "");
    }
};

module.exports = Input;
