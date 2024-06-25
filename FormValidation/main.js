function Validator(options){
    console.log(options.rules)
}

Validator.isRequired = function(selector){
    return {
        selector: selector,
        test: function(){

        }
    }
}

Validator.isRequired = function(selector){

}


Validator({
    formId: '#form-1',
    rules: [
        Validator.isRequired('#fullname'),
        Validator.isEmail('#email')
    ]
})