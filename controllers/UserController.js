class UserController{
    constructor(formId, tableId){
        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();
    }


    onSubmit(){
        
        
        this.formEl.addEventListener('submit', (event)=>{
            //para cancelar o submit padrão do formulário
            event.preventDefault();       

            let btn = this.formEl.querySelector("[type=submit]");

            btn.disabled = true;
            
            let values = this.getValues();            

            //tratamento: se retornou false, nem tenta pegar a informação de foto (seguimento do fluxo)
            if (! values) return false;

            //utilizando Promises para tratar solicitações assíncronas
            this.getPhoto().then(
                (content) => {
                    values.photo =content;
                    this.addLine(values);                    
                    this.formEl.reset()
                    btn.disabled = false;
                },
                (e) => {
                    console.error(e);
                }
            );           
            
        });
    }

    getPhoto(){

        return new Promise((resolve, reject) => {

            let fileReader = new FileReader();

            let elements = [...this.formEl.elements].filter(item => {
                if (item.name == "photo"){
                    return item;
                }
            });
    
            let file = elements[0].files[0];
    
            fileReader.onload = () => {
    
                resolve(fileReader.result);
            }

            fileReader.onerror = (e) =>{
                reject(e);
            }
    
            if (file){
                fileReader.readAsDataURL(file);
            }
            else{
                resolve(`dist/img/boxed-bg.jpg`);
            }
    

        });

    }

    getValues(){

        let user = {};
        let isValid = true;
        let fields = this.formEl.elements;

        //esses 3 primeiros pontos e colocar o objeto entre [] é uma técnica chamada "spread"
        //isso transforma o objeto em array e os ... significam que não preciso informar os índices... 
        [...fields].forEach((field, index) => {

            //validação se campos obrigatórios preenchidos
            if (['name', 'email', 'password'].indexOf(field.name) > -1){

                if (!field.value){
                    
                    //inclui a classe has-error no elemento pai do formulário
                    field.parentElement.classList.add('has-error');
                    isValid = false;
                    return false;
                }
                else{
                    field.parentElement.classList.remove('has-error');
                }

            }
            

            if (field.name=='gender'){
                if (field.checked){
                    user[field.name] = field.value;
                }
            } else if (field.name == 'admin'){
                user[field.name] = field.checked;                        
            }else {
                user[field.name] = field.value;
            }    
        });    

        if (!isValid){
            return false;
        }

        return new User(
            user.name, 
            user.gender, 
            user.birth, 
            user.country, 
            user.email, 
            user.password, 
            user.photo, 
            user.admin
        );        

    }
        
    addLine(dataUser){
        
        let tr = document.createElement("tr");

        //adicionando informações ao objeto dataset do HTML, que armazena informações que eu quiser
        //no caso abaixo, os dados do usuário. Uso stringfy para armazenar o objeto em formato JSON
        tr.dataset.user = JSON.stringify(dataUser);

        tr.innerHTML = `
                <td>
                <img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm">
                </td>
                <td>${dataUser.name}</td>
                <td>${dataUser.email}</td>
                <td>${(dataUser.admin ? 'Sim' : 'Não')}</td>
                <td>${Utils.dateFormat(dataUser.register)}</td>
                <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                </td>
        `;
    
        this.tableEl.appendChild(tr);

        //atualizar contadores
        this.updateCount();

    }    

    updateCount(){

        let numberUsers = 0;
        let numberAdmin = 0;

        [...this.tableEl.children].forEach(tr=>{

            numberUsers++;

            let user = JSON.parse(tr.dataset.user);

            if (user._admin) numberAdmin++;

        });

        document.querySelector("#number-users").innerHTML = numberUsers;
        document.querySelector("#number-users-admin").innerHTML = numberAdmin;
    }
    
}