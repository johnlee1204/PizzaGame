document.companyInformation = {
	products:[
		{
			name:"Pepperoni Pizza",
			source:"Make",
			price:8,
			cost:0,
			onMenu:true,
			onHand:0,
			safety:0
		},
		{
			name:"Cheese Pizza",
			source:"Make",
			price:8,
			cost:0,
			onMenu:true,
			onHand:0,
			safety:0
		},
		{
			name:"Sausage Pizza",
			source:"Make",
			price:8,
			cost:0,
			onMenu:true,
			onHand:0,
			safety:0
		},
		{
			name:"Cheese",
			source:"Stock",
			price:0,
			cost:.95,
			onMenu:false,
			onHand:500,
			safety:500
		},
		{
			name:"Pepperoni",
			source:"Stock",
			price:0,
			cost:.01,
			onMenu:false,
			onHand:5000,
			safety:5000
		},
		{
			name:"Dough",
			source:"Stock",
			price:0,
			cost:1,
			onMenu:false,
			onHand:500,
			safety:500
		},
		{
			name:"Sausage",
			source:"Stock",
			price:0,
			cost:.75,
			onMenu:false,
			onHand:450,
			safety:450
		},
	],
	billsOfMaterial:[
		{
			name:"Pepperoni Pizza",
			children:[
				{
					name:"Cheese",
					quantity:1
				},
				{
					name:"Pepperoni",
					quantity:40
				},
				{
					name:"Dough",
					quantity:1
				}
			]
		},
		{
			name:"Cheese Pizza",
			children:[
				{
					name:"Cheese",
					quantity:1.2
				},
				{
					name:"Dough",
					quantity:1
				}
			]
		},
		{
			name:"Sausage Pizza",
			children:[
				{
					name:"Cheese",
					quantity:1
				},
				{
					name:"Sausage",
					quantity:5
				},
				{
					name:"Dough",
					quantity:1
				}
			]
		}
	],
	day:1,
	taxRate:.2,
	initialEmployeeCount:8,
	yesterdaySalesCount:0,
	yesterdayProfit:0,
	yesterdaySales:0,
	yesterdayLaborCost:0,
	yesterdayMaterialCost:0,
	shifts:[
		{
			name:"First",
			start:8,
			duration:8
		},
		{
			name:"Second",
			start:16,
			duration:8
		}
	],
	employees:[

	],
	startingWage:10
};

var originalCompanyInformation = {};
Object.assign(originalCompanyInformation, document.companyInformation);

var viewScript = null;
var employeesScript = null;

var formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
});

var days = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday"
];

if(localStorage.getItem("companyInformation")) {//Continue
	document.companyInformation = JSON.parse(localStorage.getItem("companyInformation"));
	document.views = JSON.parse(localStorage.getItem("views"));
	if(viewScript === null) {
		viewScript = document.createElement("script");
		viewScript.src = "views/views.js";
		document.head.appendChild(viewScript);
	}
	viewScript.onload = function() {
		showCompanyDashboard();
	}
} else {//New Game
	createView("createCompany");
}

function createCompany() {
	let ownerNameField = document.getElementById("ownerName");
	let companyNameField = document.getElementById("companyName");
	let initialCapitalField = document.getElementById("initialCapital");
	let companyStateField = document.getElementById("companyState");

	document.companyInformation.ownerName = ownerNameField.value;
	document.companyInformation.companyName = companyNameField.value;
	document.companyInformation.capital = parseInt(initialCapitalField.value);
	document.companyInformation.companyState = companyStateField.value;
	createInitialEmployees();
	costRollUp();
	getDailyOrders();
	showCompanyDashboard();

	//setInterval(nextDay, 3000);
}

function showCompanyDashboard() {
	destroyView("createCompany");
	createView("companyDashboard");

	document.getElementById("capital").innerHTML = formatCurrency(document.companyInformation.capital);
	document.getElementById("companyName").innerHTML = document.companyInformation.companyName;
	document.getElementById("ownerName").innerHTML = document.companyInformation.ownerName;
	document.getElementById("day").innerHTML = "Day: " + document.companyInformation.day + " " + days[document.companyInformation.day % 7];
	document.getElementById("yesterdaySalesCount").innerHTML = "Pizzas Sold: " + document.companyInformation.yesterdaySalesCount;
	document.getElementById("yesterdayProfit").innerHTML = "Profit: " + formatCurrency(document.companyInformation.yesterdayProfit);
	document.getElementById("yesterdaySales").innerHTML = "Sales: " + formatCurrency(document.companyInformation.yesterdaySales);
	document.getElementById("yesterdayLaborCost").innerHTML = "Labor: " + formatCurrency(document.companyInformation.yesterdayLaborCost);
	document.getElementById("yesterdayMaterialCost").innerHTML = "Material: " + formatCurrency(document.companyInformation.yesterdayMaterialCost);
}

function createView(viewName) {
	if(viewScript === null) {
		viewScript = document.createElement("script");
		viewScript.src = "views/views.js";
		document.head.appendChild(viewScript);
	} else {
		document.views.createView(viewName);
	}
	viewScript.onload = function() {
		document.views.createView(viewName);
	}
}

function destroyView(viewName) {
	document.views.destroyView(viewName);
}

function openMenu() {
	destroyView("companyDashboard");
	createView("menu");
}

function closeMenu() {
	destroyView("menu");
	showCompanyDashboard();
}

function openInventory() {
	destroyView("companyDashboard");
	createView("inventory");
}

function closeInventory() {
	destroyView("inventory");
	showCompanyDashboard();
}

function openEmployees() {
	destroyView("companyDashboard");
	createView("employees");
}

function closeEmployees() {
	destroyView("employees");
	showCompanyDashboard();
}

function openOrders() {
	destroyView("companyDashboard");
	createView("orders");
}

function closeOrders() {
	destroyView("orders");
	showCompanyDashboard();
}

function formatCurrency($amount) {
	return formatter.format($amount);
}

function createInitialEmployees() {
	if(employeesScript === null) {
		employeesScript = document.createElement("script");
		employeesScript.src = "resources/employees.js";
		document.head.appendChild(employeesScript);
	} else {
		for(let i = 0; i < document.companyInformation.initialEmployeeCount; i++) {
			document.companyInformation.employees.push({
				name:getRandomName(),
				wage:document.companyInformation.startingWage,
				shift:i%2
			});
		}
	}
	employeesScript.onload = function() {
		for(let i = 0; i < document.companyInformation.initialEmployeeCount; i++) {
			document.companyInformation.employees.push({
				name:getRandomName(),
				wage:document.companyInformation.startingWage,
				shift:i%2
			});
		}
	}
}

function fireEmployee(employeeIndex) {
	document.companyInformation.employees.splice(employeeIndex, 1);
}

function hireEmployee() {
	document.companyInformation.employees.push({
		name:getRandomName(),
		wage:document.companyInformation.startingWage,
		shift:0
	});
}

function costRollUp() {
	for(let i in document.companyInformation.products) {
		let product = document.companyInformation.products[i];
		let costTotal = 0;
		if(product.source === "Make") {
			let billOfMaterial = getObjectByKeyValue(document.companyInformation.billsOfMaterial, "name", product.name);
			
			for(let j in billOfMaterial.children) {
				let childProduct = document.companyInformation.products.find(obj => {
	  				return obj.name === billOfMaterial.children[j].name
				});
				costTotal += childProduct.cost * billOfMaterial.children[j].quantity;
			
}
			product.cost = costTotal;
		}
	}
}

function nextDay() {
	if(!document.views.companyDashboard.active) {
		return;
	}
	let yesterdaySalesCount = 0;
	let yesterdayProfit = 0;
	let yesterdaySales = 0;
	let yesterdayLaborCost = 0;
	let yesterdayMaterialCost = 0;
	for(let i in document.companyInformation.orders) {
		let order = document.companyInformation.orders[i];
		let product = getObjectByKeyValue(document.companyInformation.products, "name", order.productName);
		let billOfMaterial = getObjectByKeyValue(document.companyInformation.billsOfMaterial, "name", order.productName);
		for(let j in billOfMaterial.children) {
			let child = billOfMaterial.children[j];
			let childProduct = getObjectByKeyValue(document.companyInformation.products, "name", child.name);
			childProduct.onHand -= child.quantity * order.quantity;
		}

		document.companyInformation.capital += (product.price * order.quantity);
		yesterdaySalesCount += order.quantity; 
		yesterdaySales += product.price * order.quantity;
		yesterdayMaterialCost += product.cost * order.quantity;
	}

	for(let i in document.companyInformation.employees) {
		let employee = document.companyInformation.employees[i];
		document.companyInformation.capital -= employee.wage * document.companyInformation.shifts[employee.shift].duration;
		yesterdayLaborCost += employee.wage * document.companyInformation.shifts[employee.shift].duration;
	}

	document.companyInformation.yesterdaySalesCount = yesterdaySalesCount;
	document.companyInformation.yesterdayProfit = yesterdaySales - yesterdayLaborCost - yesterdayMaterialCost;
	document.companyInformation.yesterdaySales = yesterdaySales;
	document.companyInformation.yesterdayLaborCost = yesterdayLaborCost;
	document.companyInformation.yesterdayMaterialCost = yesterdayMaterialCost;

	document.companyInformation.day++;

	purchaseStock();

	getDailyOrders();

	destroyView("companyDashboard");
	showCompanyDashboard();
	localStorage.setItem('companyInformation', JSON.stringify(document.companyInformation));
}

function getBillOfMaterialsByProduct(productName) {
	return document.companyInformation.billsOfMaterial.find(obj => {
		return obj.name === productName
	});
}

function getObjectByKeyValue(object, key, value) {
	return object.find(obj => {
		return obj[key] === value
	});
}

function getDailyOrders() {
	let ordersCount = parseInt((Math.random() * 50) + 50);
	if(document.companyInformation.day % 7 === 5 || document.companyInformation.day % 7 === 6) {
		ordersCount *= 2;
	}

	let orders = [];

	let products = readProductsOnMenu();

	for(let i = 0; i < ordersCount; i++) {
		let quantity = parseInt((Math.random() * 5) + 1);
		orders.push({
			productIndex:i % products.length,
			productName:products[i % products.length].name,
			quantity:quantity
		});
	}

	document.companyInformation.orders = orders;
}

function readProductsOnMenu() {
	let productsOnMenu = [];
	for(let i in document.companyInformation.products) {
		if(document.companyInformation.products[i].onMenu) {
			productsOnMenu.push({name:document.companyInformation.products[i].name});
		}
	}

	return productsOnMenu;
}

function purchaseStock() {
	for(let i in document.companyInformation.products) {
		let product = document.companyInformation.products[i];
		if(product.onHand < product.safety) {
			document.companyInformation.capital -= (product.safety - product.onHand) * product.cost;
			product.onHand = product.safety;
		}
	}
}

function restart() {
	let restart = confirm("Are you sure?");
	if(restart) {
		localStorage.clear();
		document.companyInformation = originalCompanyInformation;
		destroyView("companyDashboard");
		createView("createCompany");
	}
}