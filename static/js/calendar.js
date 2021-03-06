"use strict";

const calendar = {
    "month": 0,
    "year": 0
};

const fullDateToday = new Date();
const currentMonth = fullDateToday.getMonth();
const currentYear = fullDateToday.getFullYear();

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MONTHS = {
    "0": {"days": 31, "name": "January"},
    "1": {"days": 28, "name": "February"},
    "2": {"days": 31, "name": "March"},
    "3": {"days": 30, "name": "April"},
    "4": {"days": 31, "name": "May"},
    "5": {"days": 30, "name": "June"},
    "6": {"days": 31, "name": "July"},
    "7": {"days": 31, "name": "August"},
    "8": {"days": 30, "name": "September"},
    "9": {"days": 31, "name": "October"},
    "10": {"days": 30, "name": "November"},
    "11": {"days": 31, "name": "December"}
};

const JAN = 0;
const FEB = 1;
const DEC = 11;
const FEB_LEAP = 29;

const MON = 1;
const WEEK_LENGTH = 7;

const DECADE = 10;
const CENTURY = 100;


/**
 * Return number of days in the month, accounting for leap years
 * @param {number} month - month of the year
 * @param {number} year - to check if leap
 * @returns {number} - number of days in the month
 */
function monthDays (month, year) {
    if (month === FEB) {
        if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
            return FEB_LEAP;
        }
    }

    return MONTHS[month].days;
}


function drawCalendar (month, year) {
    const dateToday = fullDateToday.getDate();
    const daysInThisMonth = monthDays(month, year);
    const firstWeekDay = new Date(year, month).getDay();
    let calendarCell = 0;
    let calendarDates = '';

    for (let weekStart = MON; weekStart < firstWeekDay; weekStart++) {
        calendarDates += "<div class='flex-unit flex-seventh date'>&nbsp;</div>";
        calendarCell++;
    }

    for (let dayCounter = 1; dayCounter <= daysInThisMonth; dayCounter++) {
        if (dateToday === dayCounter) {
            if (month === currentMonth && year === currentYear) {
                calendarDates += `<div class="flex-unit flex-seventh date current-day"> ${dayCounter} </div>`;
                calendarCell++;
                continue;
            }
        }
        calendarDates += `<div class="flex-unit flex-seventh date"> ${dayCounter} </div>`;
        calendarCell++;
    }

    while (calendarCell % WEEK_LENGTH !== 0) {
        calendarDates += "<div class='flex-unit flex-seventh date'>&nbsp;</div>";
        calendarCell++;
    }

    document.getElementById("drawCalendar").textContent = `${MONTHS[month].name} ${year}`;
    document.getElementById("dates").innerHTML = calendarDates;
}


const update = {
    plusMonth (month, year) {
        let newMonth = month;
        let newYear = year;
        if (MONTHS[month + 1]) {
            newMonth += 1;
        } else {
            newMonth = JAN;
            newYear += 1;
        }

        return {
            newMonth,
            newYear
        };
    },
    minusMonth (month, year) {
        let newMonth = month;
        let newYear = year;
        if (MONTHS[month - 1]) {
            newMonth -= 1;
        } else {
            newMonth = DEC;
            newYear -= 1;
        }

        return {
            newMonth,
            newYear
        };
    },
    plusYear (year) {
        return year + 1;
    },
    minusYear (year) {
        return year - 1;
    },
    plusDecade (year) {
        return year + DECADE;
    },
    minusDecade (year) {
        return year - DECADE;
    },
    plusCentury (year) {
        return year + CENTURY;
    },
    minusCentury (year) {
        return year - CENTURY;
    }
};


function mainInit (funcToCall) {
    document.getElementById("drawCalendar").innerHTML = "";
    document.getElementById("dates").innerHTML = "";
    if (funcToCall === "drawCalendar") {
        calendar.month = currentMonth;
        calendar.year = currentYear;
    } else if (funcToCall === "plusMonth" || funcToCall === "minusMonth") {
        const updateCal = update[funcToCall](calendar.month, calendar.year);
        calendar.month = updateCal.newMonth;
        calendar.year = updateCal.newYear;
    } else {
        calendar.year = update[funcToCall](calendar.year);
    }
    drawCalendar(calendar.month, calendar.year);
}


/**
 * Calls mainInit by passing the ID of the clicked element
 * as the function that mainInit should use to
 * update the calendar.
 */
function updateCalendar (evnt) {
    if (evnt.target !== evnt.currentTarget) {
        const func = evnt.target.id;
        mainInit(func);
    }

    evnt.stopPropagation();
}


document.addEventListener("DOMContentLoaded", function () {
    mainInit("drawCalendar");
}, false);

document.addEventListener("DOMContentLoaded", function () {
    const allButtons = document.getElementById("year-jump");
    allButtons.addEventListener("click", updateCalendar, false);
});

document.addEventListener("DOMContentLoaded", function () {
    const allButtons = document.getElementById("title-block");
    allButtons.addEventListener("click", updateCalendar, false);
});
