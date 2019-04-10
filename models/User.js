class User{

    //this.

    constructor(name, gender, birth, country, email, password, photo, admin){
        this._id;
        this._name = name;
        this._gender = gender;
        this._birth = birth;
        this._country = country;
        this._email = email;
        this._password = password;
        this._photo = photo;
        this._admin = admin;
        this._register = new Date();
    }

    get id(){
        return this._id;
    }

    get name(){
        return this._name;
    }

    get gender(){
        return this._gender;
    }
    
    get birth(){
        return this._birth;
    }
    
    get country(){
        return this._country;
    }
    
    get email(){
        return this._email;
    }    

    get password(){
        return this._password;
    }    

    get photo(){
        return this._photo;
    }    
    
    get admin(){
        return this._admin;
    }    
      
    get register(){
        return this._register;
    }

    set photo(value){
        this._photo = value;
    }

    set id(value){
        this._id = value;
    }

    loadFromJSON(json){
        for (let name in json){

            switch(name){
                //tratamento para o campo data
                case '_register':
                    this[name] = new Date(json[name]);
                    break;
                default:
                    this[name] = json[name];
            }
        }
    }

    static getUsersStorage(){

        let users = [];

        //if (sessionStorage.getItem("users")){
        if (localStorage.getItem("users")){

            //users = JSON.parse(sessionStorage.getItem("users"));
            users = JSON.parse(localStorage.getItem("users"));
        }

        return users;
    }

    getNewID(){

        let UsersId = parseInt(localStorage.getItem("usersID"));
        //coloca em um escopo maior do que o objeto atual.
        //por isso foi escolhido o window para armazenar.
        if (UsersId > 0) UsersId = 0;

        UsersId++;

        localStorage.setItem("usersID", UsersId);

        return UsersId;
    }

    save(){
        
        let users = User.getUsersStorage();

        if (this.id > 0){

            users.map(u=> {

                if (u._id == this.id){

                    Object.assign(u, this);                    
                }

                return u;

            });

        } else {

            this._id = this.getNewID();

             //push adiciona item no fim do array
            users.push(this);
            
        }

        //sessionStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("users", JSON.stringify(users));
       
    }

    delete(){

        let users = User.getUsersStorage();

        users.forEach((userData, index) => {

            if (this._id == userData._id){

                //splice é o método para excluir um item de array pelo índice
                users.splice(index, 1);
                localStorage.setItem("users", JSON.stringify(users));

                break;
            }
        });
        
    }

}