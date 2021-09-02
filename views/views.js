var idCounts = {};

document.views = {
	createView: function(view) {
		if(!this.hasOwnProperty(view)) {
			console.error("View: " + view + " Not Found!");
		}

		if(this[view].active) {
			return;
		}

		this[view].active = true;

		for(let i in this[view].elements) {
			elementObject = this[view].elements[i];
			this.createAndAddElement(elementObject, document.body);
		}

		if(this[view].hasOwnProperty("afterRender")) {
			this[view].afterRender();
		}
	},
	createAndAddElement: function(elementObject, parent){
		let element = document.createElement(elementObject.elementType);
		if(elementObject.hasOwnProperty("attributes")) {
			for(let attribute in elementObject.attributes) {
				if(attribute === "innerHTML") {
					element.innerHTML = elementObject.attributes[attribute];
				}
				element.setAttribute(attribute, elementObject.attributes[attribute]);
			}

			if(!elementObject.attributes.hasOwnProperty("id")) {
				if(!idCounts.hasOwnProperty(elementObject.elementType)) {
					idCounts[elementObject.elementType] = 1;
				} else {
					idCounts[elementObject.elementType]++;
				}
				let generatedId = elementObject.elementType + idCounts[elementObject.elementType];
				element.setAttribute("id", generatedId);
				elementObject.attributes.id = generatedId;
			}

		}

		if(elementObject.hasOwnProperty("children")) {
			for(let child in elementObject.children) {
				this.createAndAddElement(elementObject.children[child], element);
			}
		}
		parent.appendChild(element);
	},
	destroyView:function(view) {
		if(!this.hasOwnProperty(view)) {
			console.error("View: " + view + " Not Found!");
		}

		if(!this[view].active) {
			return;
		}

		this[view].active = false;

		let elementsToKeep = [];
		for(let i in this[view].elements) {
			elementObject = this[view].elements[i];
			this.destroyChildren(elementObject);
			if(!this[view].elements[i].hasOwnProperty("destroyMeTempObject") || !this[view].elements[i].destroyMeTempObject) {
				elementsToKeep.push(this[view].elements[i]);
			}
		}
		if(elementsToKeep.length !== 0) {
			this[view].elements = elementsToKeep;
		}
	},
	destroyChildren(elementObject) {
		let element = document.getElementById(elementObject.attributes.id);
		let childrenToKeep = [];
		if(elementObject.hasOwnProperty("children")) {
			for(let child in elementObject.children) {
				this.destroyChildren(elementObject.children[child]);
				if(!elementObject.children[child].hasOwnProperty("destroyMeTempObject") || !elementObject.children[child].destroyMeTempObject) {
					childrenToKeep.push(elementObject.children[child]);
				}
			}
		}
		if(childrenToKeep.length !== 0) {
			elementObject.children = childrenToKeep;
		}
		element.remove();
	},
	createCompany:{
		active:false,
		elements:[
			{
				elementType:"style",
				attributes:{
					innerHTML: `
					.formInputContainer {
						display: block;
						margin-bottom: 5;
					}
					.formLabel {
						position: absolute;
					}

					.formInput {
						margin-left: 150;
					}`
				}
			},
			{
				elementType:"div",
				attributes: {
					class:"signUpFormContainer",
				},
				children:[
					{
						elementType:"div",
						attributes: {
							class:"formInputContainer",
						},
						children:[
							{
								elementType:"label",
								attributes: {
									class:"formLabel",
									for:"ownerName",
									innerHTML :"Name:"
								},
							},
							{
								elementType:"input",
								attributes: {
									class:"formInput",
									id:"ownerName",
									name:"ownerName",
									value:"John Lee",
									required:true
								}
							}
						]
					},
					{
						elementType:"div",
						attributes: {
							class:"formInputContainer",
						},
						children:[
							{
								elementType:"label",
								attributes: {
									class:"formLabel",
									for:"initialCapital",
									innerHTML :"Initial Capital:"
								}
							},
							{
								elementType:"input",
								attributes: {
									class:"formInput",
									id:"initialCapital",
									name:"initialCapital",
									type: "number",
									value:0,
									required:true
								}
							}
						]
					},
					{
						elementType:"div",
						attributes: {
							class:"formInputContainer",
						},
						children:[
							{
								elementType:"label",
								attributes: {
									class:"formLabel",
									for:"companyName",
									innerHTML :"Company Name:"	
								}
								
							},
							{
								elementType:"input",
								attributes: {
									class:"formInput",
									id:"companyName",
									name:"companyName",
									value:"Lee Pizza",
									required:true
								}
							}
						]
					},
					{
						elementType:"div",
						attributes: {
							class:"formInputContainer",
						},
						children:[
							{
								elementType:"label",
								attributes: {
									class:"formLabel",
									for:"companyState",
									innerHTML :"Company State:"
								}
							},
							{
								elementType:"select",
								attributes: {
									class:"formInput",
									id:"companyState",
									name:"companyState",
									required:true
								}
							},
							{
								elementType:"script",
								attributes:{
									src:"resources/states.js"
								}
							}
						]
					},
					{
						elementType:"div",
						attributes: {
							class:"formInputContainer",
						},
						children:[
							{
								elementType:"button",
								attributes: {
									class:"formLabel",
									innerHTML :"Submit",
									onclick:"createCompany()"
								}
							}
						]
					}
				]
			}
		]
	},
	companyDashboard:{
		active:false,
		elements:[
			{
				elementType:"style",
				attributes:{
					innerHTML:`
					.companyDashbordOutterDiv {
						width:100%;
						display: block;
					}
					.companyDashbordInnerLeftDiv {
						width:33%;
						display: inline-block;
						float:left;
						text-align: center;
					}
					.companyDashbordInnerCenterDiv {
						width:33%;
						display: inline-block;
						float:center;
						text-align: center;
					}
					.companyDashbordInnerRightDiv {
						width:33%;
						display: inline-block;
						float:right;
						text-align: center;
					}
					.companyDashbordEmployeeButton, .companyDashbordInventoryButton, .companyDashbordOrdersButton {
						margin-left:10
					}
					`
				}
			},
			{
				elementType:"button",
				attributes:{
					innerHTML:"Menu",
					onclick:"openMenu()"
				}
			},
			{
				elementType:"button",
				attributes:{
					innerHTML:"Inventory",
					onclick:"openInventory()",
					class:"companyDashbordInventoryButton"
				}
			},
			{
				elementType:"button",
				attributes:{
					innerHTML:"Employees",
					onclick:"openEmployees()",
					class:"companyDashbordEmployeeButton"
				}
			},
			{
				elementType:"button",
				attributes:{
					innerHTML:"Orders",
					onclick:"openOrders()",
					class:"companyDashbordOrdersButton"
				}
			},
			{
				elementType:"button",
				attributes:{
					innerHTML:"Restart",
					onclick:"restart()",
					class:"companyDashbordOrdersButton"
				}
			},
			{
				elementType:"div",
				attributes:{
					class:"companyDashbordOutterDiv"
				},
				children:[
					{
						elementType:"div",
						attributes:{
							class:"companyDashbordInnerLeftDiv"
						},
						children:[
							{
								elementType:"h3",
								attributes:{
									id:"capital"
								}
							},
							{
								elementType:"h3",
								attributes:{
									id:"yesterdayProfit"
								}
							},
							{
								elementType:"h3",
								attributes:{
									id:"yesterdaySalesCount"
								}
							},
							{
								elementType:"h3",
								attributes:{
									id:"yesterdaySales"
								}
							},
							{
								elementType:"h3",
								attributes:{
									id:"yesterdayLaborCost"
								}
							},
							{
								elementType:"h3",
								attributes:{
									id:"yesterdayMaterialCost"
								}
							}
						]
					},
					{
						elementType:"div",
						attributes:{
							class:"companyDashbordInnerCenterDiv"
						},
						children:[
							{
								elementType:"h1",
								attributes:{
									id:"companyName"
								}
							},
							{
								elementType:"h3",
								attributes:{
									id:"day"
								}
							},
							{
								elementType:"button",
								attributes:{
									innerHTML:"Next Day",
									onclick:"nextDay()"
								}
							}
						]
					},
					{
						elementType:"div",
						attributes:{
							class:"companyDashbordInnerRightDiv"
						},
						children:[
							{
								elementType:"h3",
								attributes:{
									id:"ownerName"
								}
							},
						]
					}
				]
			}
		]
	},
	menu:{
		active:false,
		elements:[
			{
				elementType:"style",
				attributes:{
					innerHTML:`
					.menuOuterDiv {
						width:100%;
						text-align:center;
						display: flex;
  						align-items: center;
  						justify-content: center;
					}
					.menuTable, .menuTableHead, .menuTableData {
						border-collapse: collapse;
  						border: 1px solid black;
					}

					.menuTableHead, .menuTableData {
						padding:10
					}
					`
				}
			},
			{
				elementType:"button",
				attributes:{
					innerHTML:"Back",
					onclick:"closeMenu()"
				}
			},
			{
				elementType:"div",
				attributes:{
					class:"menuOuterDiv"
				},
				children:[
					{
						elementType:"h3",
						attributes:{
							innerHTML:"Menu"
						}
					}	
				]
			}
		],
		afterRender:function() {
			let menuItems = [];
			for(let i in document.companyInformation.products) {
				let product = document.companyInformation.products[i];
				if(!product.onMenu) {
					continue;
				}

				menuItems.push(
					{
						elementType:"tr",
						destroyMeTempObject:true,
						attributes:{},
						children:[
							{
								elementType:"td",
								destroyMeTempObject:true,
								attributes:{
									innerHTML:product.name,
									class:"menuTableData"
								}
							},
							{
								elementType:"td",
								destroyMeTempObject:true,
								attributes:{
									innerHTML:formatCurrency(product.price),
									class:"menuTableData"
								}
							},
							{
								elementType:"td",
								destroyMeTempObject:true,
								attributes:{
									class:"menuTableData"
								},
								children:[
									{
										elementType:"button",
										destroyMeTempObject:true,
										attributes:{
											innerHTML:"Change Price",
											onclick:"let newPrice = prompt(\"New Price:\"); if(isNaN(newPrice) || newPrice <= 0){alert(\"Invalid Price!\");return;}document.companyInformation.products[" + i + "].price = newPrice;closeMenu(); openMenu();"
										}
									}
								]
							},
							{
								elementType:"td",
								destroyMeTempObject:true,
								attributes:{
									innerHTML:formatCurrency(product.cost),
									class:"menuTableData"
								}
							}
						]
					}
				);
			}

			if(menuItems.length !== 0) {
				let rows = []
				this.elements.push(
					{
						elementType:"div",
						destroyMeTempObject:true,
						attributes:{
							class:"menuOuterDiv"
						},
						children:[
							{
								elementType:"table",
								destroyMeTempObject:true,
								attributes:{
									class:"menuTable"
								},
								children:[
									{
										elementType:"tr",
										attributes:{},
										children:[
											{
												elementType:"th",
												destroyMeTempObject:true,
												attributes:{
													innerHTML:"Product",
													class:"menuTableHead"
												}
											},
											{
												elementType:"th",
												destroyMeTempObject:true,
												attributes:{
													innerHTML:"Price",
													class:"menuTableHead"
												}
											},
											{
												elementType:"th",
												destroyMeTempObject:true,
												attributes:{
													innerHTML:"Change Price",
													class:"menuTableHead"
												}
											},
											{
												elementType:"th",
												destroyMeTempObject:true,
												attributes:{
													innerHTML:"Cost",
													class:"menuTableHead"
												}
											}
										]
									}
								].concat(menuItems)
							}
						]
					}
				);

				document.views.createAndAddElement(this.elements[this.elements.length - 1], document.body);
			}
		}
	},
	inventory:{
		active:false,
		elements:[
			{
				elementType:"style",
				attributes:{
					innerHTML:`
					.inventoryOuterDiv {
						width:100%;
						text-align:center;
						display: flex;
  						align-items: center;
  						justify-content: center;
					}
					.inventoryTable, .inventoryTableHead, .inventoryTableData {
						border-collapse: collapse;
  						border: 1px solid black;
					}

					.inventoryTableHead, .inventoryTableData {
						padding:10
					}
					`
				}
			},
			{
				elementType:"button",
				attributes:{
					innerHTML:"Back",
					onclick:"closeInventory()"
				}
			},
			{
				elementType:"div",
				attributes:{
					class:"inventoryOuterDiv"
				},
				children:[
					{
						elementType:"h3",
						attributes:{
							innerHTML:"Inventory"
						}
					}	
				]
			}
		],
		afterRender:function() {
			let inventoryItems = [];
			for(let i in document.companyInformation.products) {
				let product = document.companyInformation.products[i];
				if(product.onMenu) {
					continue;
				}

				inventoryItems.push(
					{
						elementType:"tr",
						destroyMeTempObject:true,
						attributes:{},
						children:[
							{
								elementType:"td",
								destroyMeTempObject:true,
								attributes:{
									innerHTML:product.name,
									class:"inventoryTableData"
								}
							},
							{
								elementType:"td",
								destroyMeTempObject:true,
								attributes:{
									innerHTML:formatCurrency(product.cost),
									class:"inventoryTableData"
								}
							},
							{
								elementType:"td",
								destroyMeTempObject:true,
								attributes:{
									innerHTML:product.onHand,
									class:"inventoryTableData"
								}
							},
							{
								elementType:"td",
								destroyMeTempObject:true,
								attributes:{
									innerHTML:formatCurrency(product.cost * product.onHand),
									class:"inventoryTableData"
								}
							},
							{
								elementType:"td",
								destroyMeTempObject:true,
								attributes:{
									innerHTML:product.safety,
									class:"inventoryTableData"
								}
							}
						]
					}
				);
			}

			if(inventoryItems.length !== 0) {
				let rows = []
				this.elements.push(
					{
						elementType:"div",
						destroyMeTempObject:true,
						attributes:{
							class:"inventoryOuterDiv"
						},
						children:[
							{
								elementType:"table",
								destroyMeTempObject:true,
								attributes:{
									class:"inventoryTable"
								},
								children:[
									{
										elementType:"tr",
										attributes:{},
										children:[
											{
												elementType:"th",
												destroyMeTempObject:true,
												attributes:{
													innerHTML:"Product",
													class:"inventoryTableHead"
												}
											},
											{
												elementType:"th",
												destroyMeTempObject:true,
												attributes:{
													innerHTML:"Cost",
													class:"inventoryTableHead"
												}
											},
											{
												elementType:"th",
												destroyMeTempObject:true,
												attributes:{
													innerHTML:"On Hand",
													class:"inventoryTableHead"
												}
											},
											{
												elementType:"th",
												destroyMeTempObject:true,
												attributes:{
													innerHTML:"On Hand Value",
													class:"inventoryTableHead"
												}
											},
											{
												elementType:"th",
												destroyMeTempObject:true,
												attributes:{
													innerHTML:"Safety",
													class:"inventoryTableHead"
												}
											}
										]
									}
								].concat(inventoryItems)
							}
						]
					}
				);

				document.views.createAndAddElement(this.elements[this.elements.length - 1], document.body);
			}
		}
	},
	employees:{
		active:false,
		elements:[
			{
				elementType:"style",
				attributes:{
					innerHTML:`
					.employeesOuterDiv {
						width:100%;
						text-align:center;
						display: flex;
  						align-items: center;
  						justify-content: center;
  						margin-top:15
					}
					.employeesTable, .employeesTableHead, .employeesTableData {
						border-collapse: collapse;
  						border: 1px solid black;
					}

					.employeesTableHead, .employeesTableData {
						padding:10
					}
					`
				}
			},
			{
				elementType:"button",
				attributes:{
					innerHTML:"Back",
					onclick:"closeEmployees()"
				}
			},
			{
				elementType:"div",
				attributes:{
					class:"employeesOuterDiv"
				},
				children:[
					{
						elementType:"h3",
						attributes:{
							class:"employeesHeader",
							innerHTML:"Employees"
						}
					}
				]
			},
			{
				elementType:"div",
				attributes:{
					class:"employeesOuterDiv"
				},
				children:[
					{
						elementType:"button",
						attributes:{
							class:"employeesHireButton",
							innerHTML:"Hire Employee",
							onclick:"hireEmployee();closeEmployees(); openEmployees();"
						}
					}
				]
			},
		],
		afterRender:function() {
			let employeesItems = [];
			for(let i in document.companyInformation.employees) {
				let employee = document.companyInformation.employees[i];
				employeesItems.push(
					{
						elementType:"tr",
						destroyMeTempObject:true,
						attributes:{},
						children:[
							{
								elementType:"td",
								destroyMeTempObject:true,
								attributes:{
									innerHTML:employee.name,
									class:"employeesTableData"
								}
							},
							{
								elementType:"td",
								destroyMeTempObject:true,
								attributes:{
									innerHTML:formatCurrency(employee.wage),
									class:"employeesTableData"
								}
							},
							{
								elementType:"td",
								destroyMeTempObject:true,
								attributes:{
									class:"employeesTableData"
								},
								children:[
									{
										elementType:"button",
										destroyMeTempObject:true,
										attributes:{
											innerHTML:"Change Wage",
											onclick:"let newRate = prompt(\"New Rate:\"); if(isNaN(newRate) || newRate <= 0){alert(\"Invalid Rate!\");return;}document.companyInformation.employees[" + i + "].wage = newRate;closeEmployees(); openEmployees();"
										}
									}
								]
							},
							{
								elementType:"td",
								destroyMeTempObject:true,
								attributes:{
									class:"employeesTableData"
								},
								children:[
									{
										elementType:"button",
										destroyMeTempObject:true,
										attributes:{
											innerHTML:"Fire",
											onclick:"fireEmployee(" + i + ");closeEmployees(); openEmployees();"
										}
									}
								]
							},
							{
								elementType:"td",
								destroyMeTempObject:true,
								attributes:{
									innerHTML:employee.shift + 1,
									class:"employeesTableData"
								}
							}
						]
					}
				);
			}

			if(employeesItems.length !== 0) {
				let rows = []
				this.elements.push(
					{
						elementType:"div",
						destroyMeTempObject:true,
						attributes:{
							class:"employeesOuterDiv"
						},
						children:[
							{
								elementType:"table",
								destroyMeTempObject:true,
								attributes:{
									class:"employeesTable"
								},
								children:[
									{
										elementType:"tr",
										destroyMeTempObject:true,
										attributes:{},
										children:[
											{
												elementType:"th",
												destroyMeTempObject:true,
												attributes:{
													innerHTML:"Employee",
													class:"employeesTableHead"
												}
											},
											{
												elementType:"th",
												destroyMeTempObject:true,
												attributes:{
													innerHTML:"Wage",
													class:"employeesTableHead"
												}
											},
											{
												elementType:"th",
												destroyMeTempObject:true,
												attributes:{
													innerHTML:"Change Wage",
													class:"employeesTableHead"
												}
											},
											{
												elementType:"th",
												destroyMeTempObject:true,
												attributes:{
													innerHTML:"Fire",
													class:"employeesTableHead"
												}
											},
											{
												elementType:"th",
												destroyMeTempObject:true,
												attributes:{
													innerHTML:"Shift",
													class:"employeesTableHead"
												}
											}
										]
									}
								].concat(employeesItems)
							}
						]
					}
				);

				document.views.createAndAddElement(this.elements[this.elements.length - 1], document.body);
			}
		},
	},
	orders:{
		active:false,
		elements:[
			{
				elementType:"style",
				attributes:{
					innerHTML:`
					.ordersOuterDiv {
						width:100%;
						text-align:center;
						display: flex;
  						align-items: center;
  						justify-content: center;
					}
					.ordersTable, .ordersTableHead, .ordersTableData {
						border-collapse: collapse;
  						border: 1px solid black;
					}

					.ordersTableHead, .ordersTableData {
						padding:10
					}
					`
				}
			},
			{
				elementType:"button",
				attributes:{
					innerHTML:"Back",
					onclick:"closeOrders()"
				}
			},
			{
				elementType:"div",
				attributes:{
					class:"ordersOuterDiv"
				},
				children:[
					{
						elementType:"h3",
						attributes:{
							innerHTML:"Orders"
						}
					}	
				]
			}
		],
		afterRender:function() {
			let ordersItems = [];
			for(let i in document.companyInformation.orders) {
				let order = document.companyInformation.orders[i];
				let orderProduct = getObjectByKeyValue(document.companyInformation.products, "name", order.productName)
				ordersItems.push(
					{
						elementType:"tr",
						destroyMeTempObject:true,
						attributes:{},
						children:[
							{
								elementType:"td",
								destroyMeTempObject:true,
								attributes:{
									innerHTML:order.productName,
									class:"ordersTableData"
								}
							},
							{
								elementType:"td",
								destroyMeTempObject:true,
								attributes:{
									innerHTML:order.quantity,
									class:"ordersTableData"
								}
							},
							{
								elementType:"td",
								destroyMeTempObject:true,
								attributes:{
									innerHTML:formatCurrency(orderProduct.price * order.quantity),
									class:"ordersTableData"
								}
							},
							{
								elementType:"td",
								destroyMeTempObject:true,
								attributes:{
									innerHTML:formatCurrency(orderProduct.cost),
									class:"ordersTableData"
								}
							}
						]
					}
				);
			}

			if(ordersItems.length !== 0) {
				let rows = []
				this.elements.push(
					{
						elementType:"div",
						destroyMeTempObject:true,
						attributes:{
							class:"ordersOuterDiv"
						},
						children:[
							{
								elementType:"table",
								destroyMeTempObject:true,
								attributes:{
									class:"ordersTable"
								},
								children:[
									{
										elementType:"tr",
										destroyMeTempObject:true,
										attributes:{},
										children:[
											{
												elementType:"th",
												destroyMeTempObject:true,
												attributes:{
													innerHTML:"Product",
													class:"ordersTableHead"
												}
											},
											{
												elementType:"th",
												destroyMeTempObject:true,
												attributes:{
													innerHTML:"Quantity",
													class:"ordersTableHead"
												}
											},
											{
												elementType:"th",
												destroyMeTempObject:true,
												attributes:{
													innerHTML:"Price",
													class:"ordersTableHead"
												}
											},
											{
												elementType:"th",
												destroyMeTempObject:true,
												attributes:{
													innerHTML:"Cost",
													class:"ordersTableHead"
												}
											}
										]
									}
								].concat(ordersItems)
							}
						]
					}
				);

				document.views.createAndAddElement(this.elements[this.elements.length - 1], document.body);
			}
		},
	}
};