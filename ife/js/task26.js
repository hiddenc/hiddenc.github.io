/**
 * Created by Administrator on 2017/2/28.
 */
function Car(model,year,miles){
    this.model = model;
    this.year = year;
    this.miles = miles;
    this.output = function(){
        return this.model + "走了" + this.miles + "公里";
    }
}

var tom = new Car("大步",2009,2000);
var dudu = new Car("Dudu",2010,5000);

console.log(tom.output());

function Car2(model,year,miles){
    this.model = model;
    this.year = year;
    this.miles = miles;
}

Car2.prototype.output = function(){
    return this.model + "走了" + this.miles + "公里";
};

var Car3 =(function(){
    var Car = function(model,year,miles){
        this.model = model;
        this.year = year;
        this.miles = miles;
    };
    return function(model,year,miles){
        return new Car(model,year,miles);
    };
})();