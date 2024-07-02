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
		

		let month_elem = document.createElement("section");
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
	// waa
}