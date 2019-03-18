
//BUDGET CONTROLLER
var budgetController = (function (){
    //id should be unique
    var Expense = function(id, description,value) {
    	this.id = id;
    	this.description = description;
    	this.value = value;
    };

    var Income = function(id, description,value) {
    	this.id = id;
    	this.description = description;
    	this.value = value;
    };

    var calculateTotal = function (type) {
    	var sum = 0;
    	data.allItems[type].forEach(function(curr) {
    		sum = sum +curr.value; 
    	});
    	data.totals[type] = sum;
    }

    //store all data in Object
    var data = {
    	allItems: {
    		exp: [],
    		inc: []
    	},
    	totals: {
    		exp: 0,
    		inc: 0
    	},
    	budget: 0,
    	percentage: -1
    };

    return {
    	//add item to data
    	addItem: function(type, des, val){
    		var newItem, ID;

    		//create new ID = the ID (of last element in exp[] or inc[]) + 1
    		if(data.allItems[type].length > 0){
    			ID = data.allItems[type][data.allItems[type].length -1].id + 1;
    			}else {
    				ID = 0;
    			}
    		
    		//create new item based on 'inc' or 'exp' type
    		if(type === 'exp'){
    			newItem = new Expense(ID, des, val);
    		} else if (type === 'inc'){
    			newItem = new Income(ID, des, val);
    		}
    		//push new item to data
    		data.allItems[type].push(newItem);
    		//return new item
    		return newItem;
    		
    	},

    	calculateBudget: function(){
    		//calc total inc and exp
    		calculateTotal('exp');
    		calculateTotal('inc');
    		//calc budget: inc - exp
    		data.budget = data.totals.inc - data.totals.exp;
    		//calc the percentage of inc we spend
    		if(data.totals.inc>0){
    			data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
    		} else {
    			data.percentage = -1;
    		}
    	},

    	getBudget: function() {
    		return {
    			budget: data.budget,
    			totalInc: data.totals.inc,
    			totalExp: data.totals.exp,
    			percentage: data.percentage
    		}
    	},

    	testing: function(){
    		console.log(data);
    	}
    }

})();



//UI CONTROLLER
var UIController = (function(){
	var DOMstrings = {
			inputType: ".add__type",
			inputDescription: ".add__description",
			inputValue: ".add__value",
			inputBtn: ".add__btn",
			incomeContainer: '.income__list',
			expensesContainer: '.expenses__list',
			budgetLabel: '.budget__value',
			incomeLabel: '.budget__income--value',
			expensesLabel: '.budget__expenses--value',
			percentageLabel: '.budget__expenses--percentage'
		};
	return {
		//public method to get input
		getinput: function() {
			return{
					type : document.querySelector(DOMstrings.inputType).value, //"inc for +, exp for -"
					description: document.querySelector(DOMstrings.inputDescription).value,
					value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
				}
			},

		addListItem: function(obj, type){
			var html, newHtml, element;
			//create HTML string with placeholder text
			if (type === 'inc'){
				element = DOMstrings.incomeContainer;
				html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if (type === 'exp'){
				element = DOMstrings.expensesContainer;
				html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%percentage%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			//replace placeholder text with user's input
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', obj.value);
			//insert the HTML to DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

		},

		clearFields: function(){
			var fields, fieldsArr;
			fields = document.querySelectorAll(DOMstrings.inputDescription +','+DOMstrings.inputValue);//return a list
			//change fields type to Array
			fieldsArr = Array.prototype.slice.call(fields);

			fieldsArr.forEach(function(current){
				current.value = "";
			});
			fieldsArr[0].focus();
		},

		displayBudget: function (obj) {
			document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
			document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
			document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
			if(obj.percentage > 0){
				document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
			} else {
				document.querySelector(DOMstrings.percentageLabel).textContent = '--';
			}

		},

		getDOMstrings: function(){
			return DOMstrings;
		}
		
	}

})();



//GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {

	

	var setupEventListener = function (){
		var DOM = UICtrl.getDOMstrings();
		document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem) ;
	
	//keyPressed event
		document.addEventListener('keypress', (e)=>{
			if(e.keyCode === 13 || e.which ===13){
				ctrlAddItem();
				}
		});
	};

	var updateBudget = function() {
		//calc budget
		budgetCtrl.calculateBudget();
		//return the budget
		var budget = budgetCtrl.getBudget();
		//display the budget on the UI
		UICtrl.displayBudget(budget);
	};

	var ctrlAddItem = function(){
		var input, newItem
		//get input data
		input = UICtrl.getinput();
		if(input.description!=="" && !isNaN(input.value) && input.value>0){
		//add item to the budget controller
		newItem = budgetCtrl.addItem(input.type, input.description, input.value); 
		//add item to UI
		UICtrl.addListItem(newItem, input.type);
		//clear fields
		UICtrl.clearFields();
		//calc and update budget
		updateBudget();
		}
	};

	return {
		init: function (){
			console.log("app has started.");
			UICtrl.displayBudget({
    			budget: 0,
    			totalInc: 0,
    			totalExp: 0,
    			percentage: -1
    		});
			setupEventListener();
		}
	}
})(budgetController, UIController);


controller.init();