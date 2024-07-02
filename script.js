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
	.then(json => createCalendar(json))

const mod = (n, m) => (n % m + m) % m;

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
		let start = new Date(event.start);
		let end = new Date(event.end);

		var loop = start;
		while (loop <= end) {
			var current_month = loop.getMonth() - startMonthNum + 1;
			var current_day = loop.getDate();

			var parent = document.querySelector(`.month:nth-of-type(${current_month}) > div:nth-child(${current_day} of :not(.blank))`)
			let elem = document.createElement("div");
			elem.classList.add("event");
			for (var elem_class of event.class) {
				elem.classList.add(elem_class)
			}
			
			if (loop === start) {
				elem.classList.add("start");
			}
			else if (loop === end) {
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