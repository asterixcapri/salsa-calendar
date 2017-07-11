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

var I18n = require('./SalsaCalendar/I18n.js');
var Input = require('./SalsaCalendar/Input.js');
var Utils = require('./SalsaCalendar/Utils.js');

require('./polyfill.js');
require('./css/salsa-calendar.less');

function SalsaCalendar(options)
{
    if (options.lang === undefined) {
        options.lang = "en";
    }

    if (options.yearsNavigation === undefined) {
        options.yearsNavigation = false;
    }

    if (options.range === undefined) {
        options.range = {
            min: false,
            max: false,
            weekdays: false,
            closing_dates: false
        };
    }

    if (options.range.min === undefined) {
        options.range.min = false;
    }

    if (options.range.max === undefined) {
        options.range.max = false;
    }

    if (options.ranges === undefined) {
        options.ranges = [options.range];
    }

    if (options.minDate === undefined) {
        options.minDate = false;
    }

    if (options.allowEmptyDate === undefined) {
        options.allowEmptyDate = false;
    }

    if (options.inputReadOnly === undefined) {
        options.inputReadOnly = false;
    }

    if (options.showNextMonth === undefined) {
        options.showNextMonth = false;
    }

    if (Utils.isMobile()) {
        options.showNextMonth = false;
    }

    if (options.onSelect === undefined) {
        options.onSelect = function(input) {};
    }

    if (options.calendarPosition === undefined) {
        options.calendarPosition = "bottom";
    }

    if (options.fixed === undefined) {
        options.fixed = false;
    }

    if (options.dateFormats === undefined) {
        options.dateFormats = {};
    }

    if (options.scrollableContainerElement === undefined) {
        options.scrollableContainerElement = null;
    }

    this.options = options;
    this.calendar = null;
    this.other_calendar = null;
    this.current_date = null;
    this.on_set_current_date_closures = [];
    this.on_date_click = function() {};
    this.before_show = function() {};

    this.i18n = new I18n(this, this.options.lang, options.dateFormats);
    this.input = new Input(this, this.options.inputId, this.options.allowEmptyDate, this.options.inputReadOnly || Utils.isMobile());

    if (this.options.scrollableContainerElement !== null) {
        this.scrollable_container = this.options.scrollableContainerElement;
    }
    else {
        this.scrollable_container = document.body;
    }

    this._init_events();
    this._init_options();
}

SalsaCalendar.prototype = {
    _init_options: function()
    {
        for (var i = 0; i < this.options.ranges.length; i++) {
            if (this.options.ranges[i].min === "today") {
                this.options.ranges[i].min = this.i18n.date2DateString(new Date());
            }
        }
    },

    _init_events: function()
    {
        Utils.addEvent(document, "click", function(event) {
            var target = Utils.getEventTarget(event);

            if (!this._is_calendar_element(target)) {
                this.hide();
            }
        }.bind(this));
    },

    _is_calendar_element: function(el)
    {
        if (el === this.input.getElement()) {
            return true;
        }

        if (Utils.elementHasClass(el, "sc-keep-open")) {
            return true;
        }

        while (el.parentNode) {
            if (el === this.calendar) {
                return true;
            }

            if (Utils.elementHasClass(el, "salsa-calendar-input")) {
                return true;
            }

            el = el.parentNode;
        }

        return false;
    },

    onSetCurrentDate: function(closure)
    {
        this.on_set_current_date_closures.push(closure);
    },

    onDateClick: function(closure)
    {
        this.on_date_click = closure;
    },

    beforeShow: function(closure)
    {
        this.before_show = closure;
    },

    setOtherCalendar: function(calendar)
    {
        this.other_calendar = calendar;
    },

    setCurrentDate: function(date)
    {
        this.current_date = date;

        for (var i = 0; i < this.on_set_current_date_closures.length; i++) {
            this.on_set_current_date_closures[i]();
        }
    },

    getCurrentDate: function()
    {
        return this.current_date;
    },

    selectDate: function(date)
    {
        this.input.setDate(date);

        if (!this.input.checkAndValidateDate()) {
            return;
        }

        this.setCurrentDate(date);
        this.show(date.getFullYear(), date.getMonth());
    },

    setRangeMin: function(date_string)
    {
        var date = this.i18n.dateString2Date(date_string);

        if (date === null) {
            return;
        }

        this.options.range.min = date_string;
    },

    setRangeMax: function(date_string)
    {
        var date = this.i18n.dateString2Date(date_string);

        if (date === null) {
            return;
        }

        this.options.range.max = date_string;
    },

    setFixed: function(fixed)
    {
        this.options.fixed = fixed;

        if (this.calendar) {
            this._position_calendar_near(this.input.getElement());
        }
    },

    isShown: function()
    {
        return this.calendar && (this.calendar.style.display === "");
    },

    show: function(year, month)
    {
        if (!Utils.isElementVisible(this.input.getElement())) {
            return;
        }

        if (!Utils.elementHasClass(document.body, "salsa-calendar-opened")) {
            document.body.className += " salsa-calendar-opened";
        }

        if ((year === undefined) || (month === undefined)) {
            var date = this.input.checkDate();

            if (date === false) {
                date = new Date();
            }

            var year = date.getFullYear();
            var month = date.getMonth();
        }

        if (month < 0) {
            year--;
            month = 11;
        }
        else if (month > 11) {
            year++;
            month = 0;
        }

        if (this.calendar === null) {
            this.calendar = this._get_calendar_structure();

            var body = document.getElementsByTagName('body')[0];
            body.appendChild(this.calendar);
        }

        this.before_show();

        this._refresh(year, month);

        this.calendar.style.display = "";

        Utils.addEvent(this.scrollable_container, "scroll", function(event) {
            if (this.isShown()) {
                this._position_calendar_near(this.input.getElement());
            }
        }.bind(this));

        this._position_calendar_near(this.input.getElement());
    },

    _get_calendar_structure: function()
    {
        var calendar = document.createElement("div");

        calendar.className = "salsa-calendar";
        calendar.className += this.options.showNextMonth ? " salsa-calendar-two-months" : "";

        return calendar;
    },

    _position_calendar_near: function(elem)
    {
        var position = Utils.findElementPosition(elem);

        if (this.scrollable_container !== document.body) {
            position.top -= this.scrollable_container.scrollTop;

            this._hide_calendar_on_input_overflow(this.scrollable_container, elem, position);
        }

        if (this.options.calendarPosition === "right") {
            this.calendar.style.top = parseInt(position.top) + "px";
            this.calendar.style.left = parseInt(position.left + elem.offsetWidth) + "px";

            if (!Utils.elementHasClass(this.calendar, "sc-right")) {
                this.calendar.className += " sc-right";
            }
        }
        else if (this.options.calendarPosition === "left") {
            this.calendar.style.top = parseInt(position.top) + "px";
            this.calendar.style.left = parseInt(position.left - this.calendar.offsetWidth) + "px";

            if (!Utils.elementHasClass(this.calendar, "sc-left")) {
                this.calendar.className += " sc-left";
            }
        }
        else {
            this.calendar.style.top = parseInt(position.top + elem.offsetHeight) + "px";
            this.calendar.style.left = parseInt(position.left) + "px";

            if (!Utils.elementHasClass(this.calendar, "sc-bottom")) {
                this.calendar.className += " sc-bottom";
            }
        }

        this.calendar.style.position = this.options.fixed ? "fixed" : "absolute";
    },

    _hide_calendar_on_input_overflow: function(container, input, input_position)
    {
        var container_pos = Utils.findElementPosition(container);
        var overflow_edge = input_position.top - container_pos.top - container.offsetTop + input.clientHeight;

        if (overflow_edge > container.offsetHeight) {
            this.hide();
        }

        if (input_position.top < container_pos.top) {
            this.hide();
        }
    },

    hide: function()
    {
        if (this.calendar) {
            this.calendar.style.display = "none";
        }

        document.body.className = document.body.className.replace(" salsa-calendar-opened", "");
    },

    hideOthers: function()
    {
        var calendars = Utils.getElementsByClassName(document, "salsa-calendar");

        for (var i = 0; i < calendars.length; i++) {
            if (calendars[i] !== this.calendar) {
                calendars[i].style.display = "none";
            }
        }
    },

    _refresh: function(year, month)
    {
        this.calendar.innerHTML = "";

        var table = this._build_calendar_page(year, month, false);

        this.calendar.appendChild(table);

        if (this.options.showNextMonth) {
            if (month === 11) {
                year++;
                month = 0;
            }
            else {
                month++;
            }

            var table = this._build_calendar_page(year, month, true);

            this.calendar.appendChild(table);
        }
    },

    _build_calendar_page: function(year, month, second_month)
    {
        var table = document.createElement("table");
        table.setAttribute("cellspacing", 0, false);
        table.setAttribute("cellpadding", 0, false);

        table.appendChild(this._get_header(year, month, second_month));

        var tbody = document.createElement("tbody");
        table.appendChild(tbody);

        var date = new Date(year, month, 1);

        for (var row = 0; row < 6; row++) {
            var tr = document.createElement("tr");
            tbody.appendChild(tr);

            for (var week = 0; week < 7; week++) {
                var td = document.createElement("td");
                var week_day = (week + this.i18n.getFirstDayOfWeek()) % 7;

                if ((date.getMonth() === month) && (date.getDay() === week_day)) {
                    td.className = "sc-day sc-keep-open";

                    if (this.getCurrentDate() && (this.getCurrentDate().getTime() === date.getTime())) {
                        td.className += " sc-current";
                    }

                    if (this._is_today(date)) {
                        td.className += " sc-today";
                    }

                    if (this.inRangeDate(date)) {
                        (function(current_date) {
                            td.onclick = function() {
                                this.input.setDate(current_date);
                                this.setCurrentDate(current_date);
                                this.hide();

                                this.options.onSelect(this.input.getElement());

                                this.on_date_click();
                            }.bind(this);
                        }.bind(this))(new Date(date.getTime()));
                    }
                    else {
                        td.className += " sc-disabled";
                    }

                    td.innerHTML = date.getDate();

                    date.setDate(date.getDate() + 1);
                }
                else {
                    td.className = "sc-other-month";
                }

                tr.appendChild(td);
            }
        }

        return table;
    },

    _is_today: function(date)
    {
        var today = new Date();

        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    },

    inRangeDate: function(date)
    {
        if (this.options.minDate && (date.getTime() < this.i18n.dateString2Date(this.options.minDate).getTime())) {
            return false;
        }

        for (var i = 0; i < this.options.ranges.length; i++) {
            if (
                this._check_range_min_date(this.options.ranges[i], date) &&
                this._check_range_max_date(this.options.ranges[i], date) &&
                this._check_range_weekday(this.options.ranges[i], date) &&
                this._check_closed_date(this.options.ranges[i], date)
            ) {
                return true;
            }
        }

        return false;
    },

    getRangeValidDate: function(date)
    {
        if (!date) {
            return this.getMinValidDate();
        }

        if (isNaN(date.getTime())) {
            return this.getMinValidDate();
        }

        for (var i = 0; i < this.options.ranges.length; i++) {
            if (!this._check_range_min_date(this.options.ranges[i], date)) {
                return this.getMinValidDate();
            }
        }

        for (var i = 0; i < this.options.ranges.length; i++) {
            if (!this._check_range_max_date(this.options.ranges[i], date)) {
                return this._get_ranges_max_date();
            }
        }

        return date;
    },

    getMinValidDate: function()
    {
        if (this.options.minDate) {
            var min_date = this.i18n.dateString2Date(this.options.minDate);
        }
        else {
            var min_date = this.i18n.getTodayDate();
        }

        for (var i = 0; i < this.options.ranges.length; i++) {
            var range_min_date = this.i18n.dateString2Date(this.options.ranges[i].min);
            var range_max_date = this.i18n.dateString2Date(this.options.ranges[i].max);

            if (range_min_date === null) {
                return min_date;
            }

            if (range_max_date === null) {
                range_max_date = new Date(2050, 1, 1);
            }

            if ((min_date.getTime() >= range_min_date.getTime()) && (min_date.getTime() <= range_max_date.getTime())) {
                return min_date;
            }
        }

        var min = false;

        for (var i = 0; i < this.options.ranges.length; i++) {
            var range_min_date = this.i18n.dateString2Date(this.options.ranges[i].min);

            if (min === false) {
                if ((range_min_date !== false) && range_min_date.getTime() >= min_date.getTime()) {
                    min = range_min_date;
                }
            }
            else if ((range_min_date.getTime() < min.getTime()) && range_min_date.getTime() >= min_date.getTime()) {
                min = range_min_date;
            }
        }

        return min;
    },

    _get_ranges_min_date: function()
    {
        var min = false;

        for (var i = 0; i < this.options.ranges.length; i++) {
            var range_min_date = this.i18n.dateString2Date(this.options.ranges[i].min);

            if (min === false) {
                min = range_min_date;
            }
            else if (range_min_date.getTime() < min.getTime()) {
                min = range_min_date;
            }
        }

        return min;
    },

    _get_ranges_max_date: function()
    {
        var max = false;

        for (var i = 0; i < this.options.ranges.length; i++) {
            var range_max_date = this.i18n.dateString2Date(this.options.ranges[i].max);

            if (max === false) {
                max = range_max_date;
            }
            else if (range_max_date.getTime() > max.getTime()) {
                max = range_max_date;
            }
        }

        return max;
    },

    _check_range_min_date: function(range, date)
    {
        if (range.min === false) {
            return true;
        }

        var min_date = this.i18n.dateString2Date(range.min);

        if (min_date === null) {
            return false;
        }

        if (isNaN(min_date.getTime())) {
            return true;
        }

        return date.getTime() >= min_date.getTime();
    },

    _check_range_max_date: function(range, date)
    {
        if (range.max === false) {
            return true;
        }

        var max_date = this.i18n.dateString2Date(range.max);

        if (max_date === null) {
            return false;
        }

        if (isNaN(max_date.getTime())) {
            return true;
        }

        return date.getTime() <= max_date.getTime();
    },

    _check_range_weekday: function(range, date)
    {
        if (range.weekdays === undefined) {
            return true;
        }

        if (range.weekdays === false) {
            return true;
        }

        if (range.weekdays === "all") {
            return true;
        }

        var weekday = date.getDay();

        if (weekday === 0) {
            weekday = 7;
        }

        return range.weekdays.split(",").indexOf(weekday.toString()) !== -1;
    },

    _check_closed_date: function(range, date)
    {
        if ((range.closed_dates === undefined) || !range.closed_dates) {
            return true;
        }

        var closed_dates = range.closed_dates;

        var formatted_date = date.getFullYear() + "-" +
                             this._pad(date.getMonth() + 1) + "-" +
                             this._pad(date.getDate());

        for (var i = 0; i <= closed_dates.length; i++) {
            if (closed_dates[i] === formatted_date) {
                return false;
            }
        };

        return true;
    },

    _pad: function(number)
    {
        return number < 10 ? "0" + number : number;
    },

    _get_header: function(year, month, second_month)
    {
        var thead = document.createElement("thead");

        var tr = document.createElement("tr");
        thead.appendChild(tr);

        var th = document.createElement("th");
        th.colSpan = 7;
        tr.appendChild(th);

        var nav = document.createElement("div");
        nav.className = "sc-nav";
        th.appendChild(nav);

        var title = document.createElement("span");
        title.className = "sc-title";
        title.innerHTML = this.i18n.getMonth(month) + " " + year;
        nav.appendChild(title);

        if (!this.options.showNextMonth || !second_month) {
            var prev = document.createElement("span");
            prev.className = "sc-prev";
            nav.appendChild(prev);

            if (this.options.yearsNavigation) {
                var a = document.createElement("a");
                a.href = "#";
                a.className = "sc-prev-year sc-keep-open";
                a.innerHTML = "<span>&lt;&lt;</span>";
                a.onclick = function() { this.show(year - 1, month); return false; }.bind(this);
                prev.appendChild(a);
            }

            var a = document.createElement("a");
            a.href = "#";
            a.className = "sc-prev-month sc-keep-open";
            a.innerHTML = "<span>&lt;</span>";
            a.onclick = function() { this.show(year, month - 1); return false; }.bind(this);
            prev.appendChild(a);
        }

        if (!this.options.showNextMonth || second_month) {
            var next = document.createElement("span");
            next.className = "sc-next";
            nav.appendChild(next);

            var a = document.createElement("a");
            a.href = "#";
            a.className = "sc-next-month sc-keep-open";
            a.innerHTML = "<span>&gt;</span>";
            a.onclick = function() {
                second_month ? this.show(year, month) : this.show(year, month + 1);
                return false;
            }.bind(this);

            next.appendChild(a);

            if (this.options.yearsNavigation) {
                var a = document.createElement("a");
                a.href = "#";
                a.className = "sc-next-year sc-keep-open";
                a.innerHTML = "<span>&gt;&gt;</span>";
                a.onclick = function() { this.show(year + 1, month); return false; }.bind(this);
                next.appendChild(a);
            }
        }

        var tr = document.createElement("tr");
        thead.appendChild(tr);

        for (var week = 0; week < 7; week++) {
            var th = document.createElement("th");
            var week_day = (week + this.i18n.getFirstDayOfWeek()) % 7;

            th.className = "sc-week-day";
            th.innerHTML = this.i18n.getWeekDay(week_day);
            tr.appendChild(th);
        }

        return thead;
    }
};

SalsaCalendar.Connector = require('./SalsaCalendar/Connector.js');
SalsaCalendar.NightsCalculator = require('./SalsaCalendar/NightsCalculator.js');

module.exports = SalsaCalendar;
