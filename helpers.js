function getWeekList(){
	let currentDay = new Date();
	const week = [currentDay];

	for (let i = 0; i < 6; i++) {
		const nextDay = getNextDay(currentDay)
		week.push(nextDay)
		currentDay = nextDay;
	}

	return week;
}

function getNextDay(day){
	const nextDay = new Date(day)
	nextDay.setDate(nextDay.getDate() + 1)
	return nextDay;
}