
//BUDGET CONTROLLER
var budgetController = (function (){
    
    

})();



//UI CONTROLLER
var UIController = (function(){


})();



//GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {

	document.querySelector('.add__btn').addEventListener('click', ()=>{
		//console.log('clicked!');

		//get input data
		//add item to the budget controller
		//add item to UI
		//calc budget
		//display budget on UI
	});
	//keyPressed event
	document.addEventListener('keypress', (e)=>{
		if(e.keyCode === 13 || e.which ===13){
			console.log('ENTER was pressed');
		}
	});

})(budgetController, UIController);