let fields = document.querySelectorAll('#form-user-create [name]');
let user = {};
fields.forEach((field, index) => {
    //console.log(`${index} - ${field.name}`);
    if (field.name=='gender'){
        if (field.checked){
            user[field.name] = field.value;
        }
    }else {
        user[field.name] = field.value;
    }    
})

console.log(user);