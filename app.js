
var budgetController = (function(){

    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    Expense.prototype.calcPercentage = function(totalInc){
        if(totalInc > 0){
            this.percentage = Math.round((this.value /totalInc) * 100);
        }else{
            this.percentage = -1;
        }  
    };

    Expense.prototype.getPercen = function(){
        return this.percentage;
    }

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type){
        //create the sum of the expense and inc
        var sum = 0;
        data.allItems[type].forEach(function(cur){ //for each  returns call back function
            sum += cur.value;
        }),
        //store the value in totals datastructure
        data.totals[type] = sum;
    };


    //Data Structure of budget
    //Object inside an object
    var data ={
        allItems : {
            exp : [],
            inc :[]
        },

        totals :{
            exp : 0,
            inc : 0
        },
        budget : 0,
        percentage : -1 //-1 cz not valid
    }

    //Using user input data to create a new item for the datastructure

    return {
        addItem : function(type, des, val){

            var newItem, ID;

            //Create new ID
            //ID = last ID + 1

            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else{
                ID = 0;
            }
            

            //Create item based on exp or inc

            if (type === 'exp'){
                newItem = new Expense(ID, des, val);
            }else if (type == 'inc') {
                newItem = new Income(ID, des, val);
            }

            //Adding to the dataStructure
            data.allItems[type].push(newItem);

            //return the new element
            return newItem;//other function going to call this method can direct access
        
        },

        deleteItem : function(type, id){
            var ids, index;
            //id = 6
            //ids = [1,2,4,6,8]
            //index = 3

            ids = data.allItems[type].map(function(current){ //map method returns the entire array
                return current.id;
            });

            //find the index

            index = ids.indexOf(id);

            //delete

            if(index !== -1){
                data.allItems[type].splice(index, 1); // index(which index number you want to delete and 1 is how many)
            }


        },

        calculateBudget : function(){
            // calculate the totals of income and expense (As its a private function )
            calculateTotal('exp');
            calculateTotal('inc');
           
            //calculate the budget income - expense
            data.budget = data.totals.inc - data.totals.exp;

            //percentage
            if ( data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc ) * 100 );
            }else{
                data.percentage = -1;
            }
            
        },
        calculatePercentage :function(){

            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });

        },

        getPercentage : function(){
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercen();
            });
            return allPerc;
        },

        

        getBudget : function(){
            return{
                budget : data.budget,
                totalInc : data.totals.inc,
                totalExp : data.totals.exp,
                percentage : data.percentage
            };
         
        },



        testing : function(){
            console.log(data);
       
    }

    };


})();
var Expense = function(id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
}
//UI CONTROLLER
var UIController = (function(){

    var DOMStrings = {
        inputType : '.add__type',
        inputDescription : '.add__description',
        inputValue : '.add__value',
        inputBtn  : '.add__btn',
        incomeContainer : '.income__list',
        expensesContainer : '.expenses__list',
        budgetLabel : '.budget__value',
        incomeLabel : '.budget__income--value',
        expenseLabel : '.budget__expenses--value',
        percentageLabel : '.budget__expenses--percentage',
        container :'.container',
        expensesPercentageLabel :'.item__percentage',
        yearLabel :'.budget__title--month'
    };

    var nodeListForEach = function(list, callback){
        for(i=0; i<list.length;i++){
            callback(list[i], i);
        }

    };

    return {

        getInput : function(){
        //Returning all three values at the same time using objects 

            return{

                type : document.querySelector(DOMStrings.inputType).value, // exp or inc
                description : document.querySelector(DOMStrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMStrings.inputValue).value) //parsefloat helps in converting a string to number

            };

        },

        addListItems : function (obj, type){ //obj is the input which are passing

            var html,newHtml,element;
            //Create HTML string with placeholder text
            if( type === 'inc'){
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if(type === 'exp'){
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div></div>';
            }
           

           
            //Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id); //searchs for a string and replace with a string  with a data we put in the method
            newHtml = newHtml.replace('%description%', obj.description); //as its in the newHtml we wont replace with html
            newHtml = newHtml.replace('%value%', obj.value);

            //Insert into the HTML DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);


        },

        deleteListItems :function(selectorID){
            var el =  document.getElementById(selectorID);
           el.parentNode.removeChild(el);
        },

        clearFields :function(){

            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMStrings.inputDescription + ',' +DOMStrings.inputValue);

            //QueryselectorAll returns list not an array. The list does not have all the methods that array has. 
            //So we need to covert using array method 'slice' - it returns the copy of array on whats its called on

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array){ //foreach loops over all of the array of fieldArr and loops back current.value to empty string
                current.value = '';
            });

            fieldsArr[0].focus();

            
        },

        displayBudget : function(obj){

            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMStrings.expenseLabel).textContent = obj.totalExp;
            if(obj.percentage > 0){
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + ' % ';
            }else{
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '--';
            }
            

        },

        dispalyPercentage : function(percentage){

            //As query selectors slects first one and we dont know how many expense will be there we use queryselectorall

            var fields = document.querySelectorAll(DOMStrings.expensesPercentageLabel); //returns nodelist cz 



            nodeListForEach (fields, function(current, index){

                if(percentage[index] > 0){
                    current.textContent = percentage [index] + '%';
                }else{
                    current.textContent = '---';
                }

                

            });




        },

        displayCurrentDate : function(){

            //Using object constructor to display current date

            var now, month, months, year; 

             now = new Date();

             months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

             month = now.getMonth()

             year = now.getFullYear();
             
             document.querySelector(DOMStrings.yearLabel).textContent = months[month] + ' ' + year;



        },

        colorChange :function(){
            var fields = document.querySelectorAll(DOMStrings.inputType + ',' + DOMStrings.inputDescription + ',' + DOMStrings.inputValue);

            nodeListForEach(fields, function(cur){
                cur.classList.toggle('red-cross');
            });

            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
        },


        getDOMStrings : function(){
            return DOMStrings; //exposing DOMSTrings object into the public
        }


    };

    

})();



//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){


    var setupEventListeners = function(){ //private function

        var DOM = UICtrl.getDOMStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', function(){

            cntrlAddItem();
        
        });

        document.querySelector(DOM.container).addEventListener('click', cntrlDeleteItem);
        
        document.addEventListener('keypress', function(event){  // which is for the older browser //keycode for mordern
        
            if(event.keyCode === 13 || event.which === 13){
        
                cntrlAddItem();
                
            }
        });

        document.querySelector(DOM.inputType).addEventListener('Change', UICtrl.colorChange);


    }


    var updateBudget = function(){
        
        //Calculate the budget 
        budgetCtrl.calculateBudget();

        //Return the budget
        budget = budgetCtrl.getBudget();
        //Update the budget UI
      UICtrl.displayBudget(budget);


    };

    var updatePercentage = function(){

        //Calculate the percentage 
        budgetCtrl.calculatePercentage();

        //Read the percentage from budegt controller
        var percentage = budgetCtrl.getPercentage();

        //update the percentage in UI
       UICtrl.dispalyPercentage(percentage);

    };



var cntrlAddItem = function(){ //private function

        //Get field input data
        var input, newItem;

        input = UICtrl.getInput();
        console.log(input);

        if(input.description !== '' && input.value > 0 && !isNaN(input.value)){ // if there's any valid data then

        //Add the item budget data
        newItem = budgetCtrl.addItem(input.type, input.description,input.value); //addItem returns an object

        //Update the item to UI
        UICtrl.addListItems(newItem, input.type);

        //Clearing fields
        UICtrl.clearFields();

        //Calculate the budget and update
        updateBudget();

        //Calulate and Update the percentage
        updatePercentage();

        //console.log('clicked');

        // console.log('entered');

        }

};

var cntrlDeleteItem = function(event){

    var itemID, type, ID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; //DOM traversing

    if(itemID){

        splitID = itemID.split('-'); //spliting the unique id
        type = splitID[0];
        ID = parseInt(splitID[1]); //converting string to an integer

        //delete the item from the datastructre
        budgetCtrl.deleteItem(type,ID)

        //update the UI
        UICtrl.deleteListItems(itemID);

        //update and show the new budget
        updateBudget();

        //Calulate and Update the percentage
        updatePercentage();

    }



};

//public initialization function
//As we are exposing it public we should return through an object to create an init
return {
    init : function(){
        console.log('Application starts');
        UICtrl.displayCurrentDate();//as it should be one of the first to be there everytime we load the application
        UICtrl.displayBudget(            {
            budget : 0,
            totalInc : 0,
            totalExp : 0,
            percentage : -1
        })
        setupEventListeners(); //call thefunction
    }
};

})(budgetController, UIController);

controller.init();  //call the init function
