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
            
            let values = this.getValues();            

            this.getPhoto((content)=> {
                values.photo =content;

                this.addLine(values);
            });           
            
        });
    }

    getPhoto(callback){
        let fileReader = new FileReader();

        let elements = [...this.formEl.elements].filter(item => {
            if (item.name == "photo"){
                return item;
            }
        });

        let file = elements[0].files[0];

        fileReader.onload = () => {

            callback(fileReader.result);
        }

        fileReader.readAsDataURL(file);
    }

    getValues(){

        let user = {};
        let fields = this.formEl.elements;

        //esses 3 primeiros pontos e colocar o objeto entre [] é uma técnica chamada "spread"
        //isso transforma o objeto em array e os ... significam que não preciso informar os índices... 
        [...fields].forEach((field, index) => {

            if (field.name=='gender'){
                if (field.checked){
                    user[field.name] = field.value;
                }
            }else {
                user[field.name] = field.value;
            }    
        });    


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
        tr.innerHTML = `
                <td>
                <img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm">
                </td>
                <td>${dataUser.name}</td>
                <td>${dataUser.email}</td>
                <td>${dataUser.admin ? 'Sim' : 'Não'}</td>
                <td>${dataUser.birth}</td>
                <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                </td>
        `;
    
        this.tableEl.appendChild(tr);
    }    
    
}