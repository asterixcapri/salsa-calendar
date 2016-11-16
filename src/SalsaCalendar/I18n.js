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

function I18n(calendar, lang, date_formats)
{
    this.calendar = calendar;
    this.lang = lang;

    this.months = {
        it: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
        en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        pt: ["Janeiro", "Fevereiro", "Mar&ccedil;o", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
        fr: ["janvier", "f&eacute;vrier", "mars", "avril", "mai", "juin", "juillet", "ao&ucirc;t", "septembre", "octobre", "novembre", "d&eacute;cembre"],
        de: ["Januar", "Februar", "M&auml;rz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
        ru: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    };

    this.week_days = {
        it: ["Do", "Lu", "Ma", "Me", "Gi", "Ve", "Sa"],
        en: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        pt: ["Do", "Se", "Te", "Qu", "Qu", "Se", "S&aacute;"],
        fr: ["di", "lu", "ma", "me", "je", "ve", "sa"],
        de: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
        ru: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
    };

    this.first_day_of_week = {
        it: 1,
        en: 0,
        pt: 0,
        fr: 1,
        de: 1,
        ru: 1
    };

    this.date_formats = {
        it: "%d/%m/%Y",
        en: "%m/%d/%Y",
        pt: "%d/%m/%Y",
        fr: "%d/%m/%Y",
        de: "%d/%m/%Y",
        ru: "%d/%m/%Y"
    };

    for (var key in date_formats) {
        this.date_formats[key] = date_formats[key];
    }
}

I18n.prototype = {
    getMonth: function(i)
    {
        if (this.months[this.lang][i] === undefined) {
            return this.months['en'][i];
        }

        return this.months[this.lang][i];
    },

    getWeekDay: function(i)
    {
        if (this.week_days[this.lang][i] === undefined) {
            return this.week_days['en'][i];
        }

        return this.week_days[this.lang][i];
    },

    getTodayDate: function()
    {
        var today = new Date();

        return new Date(today.getFullYear(), today.getMonth(), today.getDate());
    },

    getDateFormat: function()
    {
        if (this.date_formats[this.lang] === undefined) {
            return this.date_formats['en'];
        }

        return this.date_formats[this.lang];
    },

    getFirstDayOfWeek: function()
    {
        if (this.first_day_of_week[this.lang] === undefined) {
            return this.first_day_of_week['en'];
        }

        return this.first_day_of_week[this.lang];
    },

    date2DateString: function(date)
    {
        if (!date) {
            return "";
        }

        var date_format = this.getDateFormat();

        var day = this._format_number(date.getDate(), 2);
        var month = this._format_number(date.getMonth() + 1, 2);
        var year = this._format_number(date.getFullYear(), 4);

        return date_format.replace("%d", day)
                          .replace("%m", month)
                          .replace("%Y", year);
    },

    _format_number: function(number, size)
    {
        var base = "000" + number;

        return base.substr(base.length - size);
    },

    dateString2Array: function(date_string)
    {
        if (date_string === "") {
            return {};
        }

        var date_parts = date_string.split("/");
        var format_parts = this.getDateFormat().split("/");

        var day = date_parts[format_parts.indexOf("%d")];
        var month = date_parts[format_parts.indexOf("%m")];
        var year = date_parts[format_parts.indexOf("%Y")];

        return {
            day: day,
            month: month,
            year: year
        };
    },

    dateString2Date: function(date_string)
    {
        if (!date_string) {
            return null;
        }

        if (date_string === "") {
            return null;
        }

        if (date_string === "today") {
            var today = new Date();
            return new Date(today.getFullYear(), today.getMonth(), today.getDate());
        }

        var date_array = this.dateString2Array(date_string);

        return new Date(date_array.year, date_array.month - 1, date_array.day);
    }
};

module.exports = I18n;
