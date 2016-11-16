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

function Connector(options)
{
    this.from = options.from;
    this.to = options.to;

    if (options.minimumInterval === undefined) {
        options.minimumInterval = 1;
    }

    if (options.maximumInterval === undefined) {
        options.maximumInterval = -1;
    }

    this.options = options;

    this.from.onDateClick(function() {
        var from_date = this.from.getCurrentDate();
        var to_date = this.to.getCurrentDate();

        this._connect_calendar();
        this._check_connected_calendar_integrity(this.from.input.getDate());

        if (from_date.getTime() > to_date.getTime()) {
            this.to.show();
        }
    }.bind(this));

    this.from.onSetCurrentDate(function() {
        var next_valid_date = new Date(this.from.getCurrentDate());
        next_valid_date.setDate(next_valid_date.getDate() + this.options.minimumInterval);

        var to_date = this.to.getCurrentDate();

        if ((!to_date) || next_valid_date.getTime() > to_date.getTime()) {
            this.to.input.setDate(next_valid_date);
            this.to.setCurrentDate(next_valid_date);
        }

        this._set_connected_calendar_range_min_date(this.from.input.getDate());
        this._set_connected_calendar_range_max_date(this.from.input.getDate());

        this._check_connected_calendar_integrity(this.from.input.getDate());
    }.bind(this));

    this._connect_calendar();
}

Connector.prototype = {
    _connect_calendar: function()
    {
        var date = this.from.input.getDate();

        if (!date) {
            return;
        }

        var to_current_date = this.to.getCurrentDate();
        var from_current_date = this.from.getCurrentDate();

        var new_date = new Date(date.getTime());
        new_date.setDate(new_date.getDate() + this.options.minimumInterval);

        this._set_connected_calendar_range_min_date(date);
        this._set_connected_calendar_range_max_date(date);

        if (from_current_date && to_current_date && (from_current_date.getTime() < to_current_date.getTime())) {
            return;
        }

        this.to.input.setDate(new_date);
        this.to.setCurrentDate(new_date);
    },

    _set_connected_calendar_range_min_date: function(date)
    {
        var new_date = new Date(date.getTime());
        new_date.setDate(new_date.getDate() + this.options.minimumInterval);

        this.to.setRangeMin(this.from.i18n.date2DateString(new_date));
    },

    _set_connected_calendar_range_max_date: function(date)
    {
        if (this.options.maximumInterval < 0) {
            return;
        }

        var new_date = new Date(date.getTime());
        new_date.setDate(new_date.getDate() + this.options.maximumInterval);

        this.to.setRangeMax(this.from.i18n.date2DateString(new_date));

        if (this.to.getCurrentDate().getTime() > new_date.getTime()) {
            this.to.selectDate(new_date);
        }
    },

    _check_connected_calendar_integrity: function(date)
    {
        var new_date = new Date(date.getTime());

        if (new_date.getTime() >= this.to.getCurrentDate().getTime()) {
            this.to.input.setError();
            return;
        }

        if (this.options.maximumInterval < 0) {
            this.to.input.setValidated();
            return;
        }

        new_date.setDate(new_date.getDate() + this.options.maximumInterval);

        if (new_date.getTime() < this.to.getCurrentDate().getTime()) {
            this.to.input.setError();
            return;
        }

        this.to.input.setValidated();
    }
};

module.exports = Connector;
