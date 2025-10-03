const dayjs = require("dayjs");
function formatDateLabel(date) {
    const now = dayjs();
    const d = dayjs(date);

    if (d.isSame(now, "day")) return "Today";
    if (d.isSame(now.subtract(1, "week"), "week")) return "Last Week";
    if (d.isSame(now.subtract(1, "month"), "month")) return "Last Month";
    if (d.isSame(now.subtract(1, "year"), "year")) return "Last Year";

    return d.format("YYYY-MM-DD"); // fallback
}

module.exports = { formatDateLabel };