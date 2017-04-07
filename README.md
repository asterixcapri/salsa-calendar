# salsa-calendar
Salsa Calendar is a standalone pure JavaScript library created to generate
date (range) pickers for hotel booking applications.


## How to use it
Insert the JavaScript file SalsaCalendar.min.js and style sheet SalsaCalendar.min.css
into the html document:
```
<script src="build/SalsaCalendar.min.js"></script>
<link rel="stylesheet" href="build/SalsaCalendar.min.css">
```

Create the check-in, check-out date inputs and number of nights span as follows:
```
<input type="text" id="checkin" class="salsa-calendar-input" autocomplete="off" name="arrival" value="" />
<input type="text" id="checkout" class="salsa-calendar-input" autocomplete="off" name="departure" value="" />

<span id="nights-no">
  (
  <span class="counter"></span>
  <span class="singular" style="display:none;">night</span>
  <span class="plural" style="display:none;">nights</span>
  )
</span>
```

Initialize the date picker:
```
var calendar_from = new SalsaCalendar({
    inputId: 'checkin',
    lang: 'en',
    range: {
        min: 'today'
    },
    calendarPosition: 'right',
    fixed: false,
    connectCalendar: true
});

var calendar_to = new SalsaCalendar({
    inputId: 'checkout',
    lang: 'en',
    range: {
        min: 'today'
    },
    calendarPosition: 'right',
    fixed: false
});
```

Setup the connection between these two date inputs and output the total of nights you user picked:
```
new SalsaCalendar.Connector({
    from: calendar_from,
    to: calendar_to,
    maximumInterval: 21,
    minimumInterval: 1
});

new SalsaCalendar.NightsCalculator({
    from: calendar_from,
    to: calendar_to,
    nightsNo: 'nights-no'
});
```

