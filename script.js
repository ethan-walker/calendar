const calendar = document.querySelector(".calendar");

months = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec"
]

fetch("./data.json")
	.then(response => response.json())
	.then(json => {
		createCalendar(json);
		highlightToday(json);
	})

const mod = (n, m) => (n % m + m) % m;

const isSameDay = (d1, d2) => {
	return d1.getFullYear() === d2.getFullYear() &&
		d1.getMonth() === d2.getMonth() &&
		d1.getDate() === d2.getDate();
}

function createCalendar(data) {
	// SETUP MONTHS
	let startMonth = new Date(data.setup.startMonth)
	let endMonth = new Date(data.setup.endMonth)
	
	let monthDiff = endMonth.getMonth() - startMonth.getMonth() + 
		 (12 * (endMonth.getFullYear() - startMonth.getFullYear()))

	let startMonthNum = startMonth.getMonth();
	let startMonthYear = startMonth.getFullYear();
	
	for (let i = 0; i <= monthDiff; i++) {
		let monthStart = new Date(startMonthYear, startMonthNum + i, 1);
		let monthEnd = new Date(startMonthYear, startMonthNum + i + 1, 0);
	
		
		let daysInMonth = monthEnd.getDate();
		let firstDay = mod(monthStart.getDay() - 1, 7);
		
		let nearestMultiple = Math.ceil((daysInMonth + firstDay) / 7) * 7;
		

		var month_elem = document.createElement("section");
		month_elem.classList.add("month");

		month_elem.dataset.month = months[(startMonthNum + i) % 12]
		month_elem.dataset.year = monthStart.getFullYear();
		
		for (let i = 0; i < firstDay; i++) {
			let blank_cell = document.createElement("div");
			blank_cell.classList.add("blank");

			month_elem.appendChild(blank_cell);
		}
		
		for (let i = 0; i < daysInMonth; i++) {
				let date_cell = document.createElement("div");

				month_elem.appendChild(date_cell);
		}
		let finalGap = nearestMultiple - daysInMonth - firstDay

		for (let i = 0; i < finalGap; i++) {
			let blank_cell = document.createElement("div");
			blank_cell.classList.add("blank");

			month_elem.appendChild(blank_cell);
		}

		calendar.appendChild(month_elem);
	}
	
	createEvents(data);
}
function createEvents(data) {
	let startMonth = new Date(data.setup.startMonth);
	let startMonthNum = startMonth.getMonth();
	
	for (var event of data.events) {
		var start = new Date(event.start);
		var end = new Date(event.end);

		var loop = new Date(start);
		while (loop <= end) {
			var current_month = loop.getMonth() - startMonthNum + 1;
			var current_day = loop.getDate();

			var parent = document.querySelector(`.month:nth-of-type(${current_month}) > div:nth-child(${current_day} of :not(.blank))`)
			let elem = document.createElement("div");
			elem.classList.add("event");
			
			for (var elem_class of event.class) {
				elem.classList.add(elem_class)
			}
			if (isSameDay(loop, start)) {
				elem.classList.add("start");
				elem.dataset.label = event.label
			}
			else if (isSameDay(loop, end)) {
				elem.classList.add("end");
			}
			
			parent.appendChild(elem);

			loop = new Date(loop.setDate(loop.getDate() + 1));
		}
	}
	const style = document.createElement("style");
	document.head.appendChild(style);
	const styleSheet = style.sheet;

	let rules = ""
	for (var item of data.classes) {
		console.log(item)
		var rule = "." + item.name + " {" + "background-color:" + "var(--color-" + item.color + "); grid-row:" + item.row + ";}\n"
		styleSheet.insertRule(rule, 0);
	}
}

function highlightToday(data) {
	try {
		let startMonth = new Date(data.setup.startMonth);
		let startMonthNum = startMonth.getMonth();

		const today = new Date()
		var current_month = today.getMonth() - startMonthNum + 1;
		var current_day = today.getDate();

		var parent = document.querySelector(`.month:nth-of-type(${current_month}) > div:nth-child(${current_day} of :not(.blank))`)
		parent.classList.add("today");
	}
	catch(error) {
		// the date isn't in the calendar 😢
		// who knows why
	}
}