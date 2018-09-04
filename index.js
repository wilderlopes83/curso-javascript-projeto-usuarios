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

//console.log(user);

/*
document.querySelectorAll('button').forEach((btn)=>{
    btn.addEventListener('click', (e) => {
        alert(`clicou no ${btn.className}`);
    });
});
*/
document.getElementById('form-user-create').addEventListener('submit', (event)=>{
    //para cancelar o submit padrão do formulário
    event.preventDefault();

    console.log(user);
});