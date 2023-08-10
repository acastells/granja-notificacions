//getTime() -> timestamp

export function getDate7AM() {
	var date = new Date()
	date.setHours(7)
	date.setMinutes(0)
	date.setSeconds(0)
	date.setMilliseconds(0)
	return date
}

export function transformDateTo7AM_Timestamp(date) {
	date.setHours(7)
	date.setMinutes(0)
	date.setSeconds(0)
	date.setMilliseconds(0)
	return date.getTime()
}

export function calculateTriggersAt_Timestamp(date, duration) {
	date.setSeconds(date.getSeconds() + duration)
	return date.getTime()
}