/**
 * Miscellaneous utility functions. Module export statement at the bottom.
 */

function formatNumber(number) {
    var result = "";
    if (number < 10) result += "0";
    return result + number;
}

// Converts a date/time passed as UTC into yyyy-mm-dd hh:mm:ss format
function formatDate(utc_time, use_seconds) {
    var d = new Date();
    d.setTime(utc_time);

    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var hour = d.getHours();
    var mn = d.getMinutes();
    var sec = d.getSeconds();

    return "" + year + "-" + formatNumber(month) + "-" + formatNumber(day) + " " + formatNumber(hour) + ":" +
            formatNumber(mn) + ":" + (use_seconds ? formatNumber(sec) : 0);
}

/**
 * Utility function to remove the second and millisecond components from a UTC, to have a time stamp at an exact minute
 * boundary. Take the previous or next minute depending on the roundUp flag.
 */
function roundToMinute(utc, roundUp) {
    var d = new Date(parseInt(utc));
    var zeroSecondsMillisecs = true;
    if ((d.getSeconds() != 0) || (d.getMilliseconds() != 0)) {
        zeroSecondsMillisecs = false;

        // Zero-out the seconds and milliseconds
        d.setSeconds(0);
        d.setMilliseconds(0);
    }

    // Now we have a time stamp rounded at the previous minute.
    var roundedUtc = d.getTime();

    // Do we need to take the next minute instead ?
    if (roundUp && !zeroSecondsMillisecs) {
        roundedUtc += 60 * 1000;
    }

    return roundedUtc;
}

function roundToHour(utc, roundUp) {
    var d = new Date(parseInt(utc, 10));
    var zeroMinutesSecondsMillisecs = true;
    if ((d.getMinutes() !== 0) || (d.getSeconds() !== 0) || (d.getMilliseconds() !== 0)) {
        zeroSecondsMillisecs = false;

        // Zero-out the minutes, seconds and milliseconds
        d.setMinutes(0, 0, 0);
    }

    // Now we have a time stamp rounded at the previous hour.
    var roundedUtc = d.getTime();

    // Do we need to take the next hour instead ?
    if (roundUp && !zeroMinutesSecondsMillisecs) {
        roundedUtc += 60 * 60 * 1000;
    }

    return roundedUtc;
}

function make_error(err, msg) {
    var e = new Error(msg);
    e.code = err;
    return e;
}

function invalidUrl() {
    return make_error("invalidUrl", "the URL is invalid");
}

function queryFailed() {
    return make_error("db_failure", "the DB query failed");
}

function dbConnectionFailed() {
    return make_error("db_conn_failure", "the DB connection failed");
}

function sendFailure(res, code, err) {
    res.writeHead(code, {
        "Content-type" : "html"
    });
    res.end(JSON.stringify({
        error : code,
        message : err.message
    }) + "\n");
}

function log(message) {
    var now = new Date();
    var nowUtc = now.getTime();
    console.log(formatDate(nowUtc, true) + " - " + message);
}

// Export the module
module.exports = {
    formatNumber : formatNumber,
    formatDate : formatDate,
    roundToMinute : roundToMinute,
    roundToHour : roundToHour,
    invalidUrl : invalidUrl,
    queryFailed : queryFailed,
    dbConnectionFailed : dbConnectionFailed,
    sendFailure : sendFailure,
    log : log
};
