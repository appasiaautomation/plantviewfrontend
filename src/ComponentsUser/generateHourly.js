class intervals {
    constructor(start, end) {
        this.intervals = this.generateIntervals(start, end)
    }
    generateIntervals(start, end) {
        let intervals = [];
        const startHour = parseInt(start.split(":")[0]);
        const endHour = parseInt(end.split(":")[0]);
        const startHourMinutes = parseInt(start.split(":")[1]);
        const endHourMinutes = parseInt(end.split(":")[1]);

        if (start <= end) {
            // Shift within the same day
            for (let hour = startHour; hour < endHour; hour++) {
                if (hour + 1 >= endHour) {
                    if (startHourMinutes >= endHourMinutes) {
                        intervals.push(
                            `${hour}:${startHourMinutes} - ${hour + 1}:${endHourMinutes}`
                        );
                        break;
                    } else {
                        intervals.push(
                            `${hour}:${startHourMinutes} - ${hour + 1}:${startHourMinutes}`
                        );
                        intervals.push(
                            `${hour + 1}:${startHourMinutes} - ${hour + 1}:${endHourMinutes}`
                        );
                        break;
                    }
                }
                intervals.push(
                    `${hour}:${startHourMinutes} - ${hour + 1}:${startHourMinutes}`
                );
            }
        } else {
            // Shift spans overnight
            let zero = 0;
            for (let hour = startHour; hour < 24; hour++) {
                if (endHour == zero && hour == 23) {
                    intervals.push(
                        `${hour}:${startHourMinutes} - ${zero}:${endHourMinutes}`
                    );
                    continue;
                }

                intervals.push(
                    `${hour}:${startHourMinutes} - ${hour + 1}:${startHourMinutes}`
                );
            }
            for (let hour = 0; hour < endHour; hour++) {
                if (hour + 1 >= endHour) {
                    if (startHourMinutes >= endHourMinutes) {
                        intervals.push(
                            `${hour}:${startHourMinutes} - ${hour + 1}:${endHourMinutes}`
                        );
                        break;
                    } else {
                        intervals.push(
                            `${hour}:${startHourMinutes} - ${hour + 1}:${startHourMinutes}`
                        );
                        intervals.push(
                            `${hour + 1}:${startHourMinutes} - ${hour + 1}:${endHourMinutes}`
                        );
                        break;
                    }
                }
                intervals.push(
                    `${hour}:${startHourMinutes} - ${hour + 1}:${startHourMinutes}`
                );
            }
        }
        const convertTo12HourFormat = (time) => {
            const [hour, minute] = time.split(":").map(Number);
            const adjustedHour = hour % 12 || 12;
            const period = hour >= 12 ? "PM" : "AM";
            return `${adjustedHour}:${minute < 10 ? `0${minute}` : minute} ${period}`;
        };
        // Convert 24-hour intervals to 12-hour format
        return intervals.map((interval) => {
            const [start, end] = interval.split(" - ");
            //console.table(`${start}- ${end}`);
            return `${convertTo12HourFormat(start)}- ${convertTo12HourFormat(end)}`;
        });
    };
}