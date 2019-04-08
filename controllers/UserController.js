class UserController{
    constructor(formIdCreate, formIdUpdate, tableId){
        this.formEl = document.getElementById(formIdCreate);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();
        this.onEdit();
    }

    onEdit(){
        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e =>{

            this.showPanelCreate();
        });

        this.formUpdateEl.addEventListener("submit", event => {
            //para cancelar o submit padrão do formulário
            event.preventDefault();                   
            
            let btn = this.formUpdateEl.querySelector("[type=submit]");
            btn.disabled = true;

            let values = this.getValues(this.formUpdateEl); 

            let index = this.formUpdateEl.dataset.trIndex;

            let tr = this.tableEl.rows[index];

            let userOld = JSON.parse(tr.dataset.user);

            //comando assign: copia o valor de atributos de um objeto
            //cria um objeto destino (no caso result), retornando este objeto
            let result = Object.assign({}, userOld, values);

            //utilizando Promises para tratar solicitações assíncronas
            this.getPhoto(this.formUpdateEl).then(
                (content) => {

                    if (!values.photo){
                        result._photo = userOld._photo;
                    } else {
                        result._photo = content;
                    }

                    tr.dataset.user = JSON.stringify(result);

                    tr.innerHTML = `
                    <td>
                    <img src="${result._photo}" alt="User Image" class="img-circle img-sm">
                    </td>
                    <td>${result._name}</td>
                    <td>${result._email}</td>
                    <td>${(result._admin ? 'Sim' : 'Não')}</td>
                    <td>${Utils.dateFormat(result._register)}</td>
                    <td>
                    <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                    <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                    </td>
                    `;    

                    this.addEventsTr(tr);
                    this.updateCount();        
                    this.formUpdateEl.reset();
                    btn.disabled = false;
                    this.showPanelCreate();
            
                },
                (e) => {
                    console.error(e);
                }
            );           

        });

    }


    onSubmit(){
        
        
        this.formEl.addEventListener('submit', (event)=>{
            //para cancelar o submit padrão do formulário
            event.preventDefault();       

            let btn = this.formEl.querySelector("[type=submit]");

            btn.disabled = true;
            
            let values = this.getValues(this.formEl);            

            //tratamento: se retornou false, nem tenta pegar a informação de foto (seguimento do fluxo)
            if (! values) return false;

            //utilizando Promises para tratar solicitações assíncronas
            this.getPhoto(this.formEl).then(
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

    getPhoto(formEl){

        return new Promise((resolve, reject) => {

            let fileReader = new FileReader();

            let elements = [...formEl.elements].filter(item => {
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

    getValues(formEl){

        let user = {};
        let isValid = true;
        let fields = formEl.elements;

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
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
                </td>
        `;

        this.addEventsTr(tr);
    
        this.tableEl.appendChild(tr);

        //atualizar contadores
        this.updateCount();

    }    

    addEventsTr(tr) {

        tr.querySelector(".btn-delete").addEventListener("click", e => {
                if (confirm('Tem certeza que deseja excluir?')){
                    tr.remove();
                    this.updateCount();
                }
            }
        );

        tr.querySelector(".btn-edit").addEventListener("click", e => {
            let json = JSON.parse(tr.dataset.user);
            
            //adiciona um índice para controlar o grid            
            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;
            //faz o de/para do json para os campos do formulario
            for (let name in json) {
                let field = this.formUpdateEl.querySelector(`[name="${name.replace("_", "")}"]`);
                //se encontrou o campo...
                if (field) {
                    switch (field.type) {
                        case 'file':
                            continue; //continua o loop
                            break; //sai do switch
                        case 'radio':
                            field = this.formUpdateEl.querySelector(`[name="${name.replace("_", "")}"][value="${json[name]}"] `);
                            field.checked = true;
                            break;
                        case 'checkbox':
                            field.checked = json[name];
                            break;
                        default:
                            field.value = json[name];
                    }
                }
            }

            this.formUpdateEl.querySelector(".photo").src = json._photo;

            this.showPanelUpdate();
        });
    }

    showPanelCreate(){
        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector("#box-user-update").style.display = "none";
    }

    showPanelUpdate(){
        document.querySelector("#box-user-create").style.display = "none";
        document.querySelector("#box-user-update").style.display = "block";
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