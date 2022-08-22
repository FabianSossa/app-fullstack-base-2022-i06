
function SayHello(){
    let current_value = document.getElementById("textarea_1") as HTMLInputElement;
    let new_value = "Hello world!!!" + "\n" + current_value.value;
    document.getElementById("textarea_1").innerHTML = new_value;
}

declare const M;
var index_data = 0;     //Utilizado para la creación de nuevos elementos
var id_Card;            //Lectura del id de la card
class Main implements EventListenerObject, ResponseLister {
    public framework: FrameWork = new FrameWork();
    constructor() {
        
        this.framework.ejecutarRequest("GET", "http://localhost:8000/devices", this)
        
    }

    public handlerResponse(status: number, response: string) {
        if (status == 200) {
            let resputaString: string = response;
            let resputa: Array<Device> = JSON.parse(resputaString);    
            let contenedor    =   document.getElementById("container"); //identificamos nuestro contenedor principal de los componentes
            let addhtml:string =''; //mantenemos el texto html a agregar a la pagina
            //Listamos los dispositivos devueltos por el servidor a la peticion GET
            for (let disp of resputa) {
            
                if (disp.id > index_data) 
                {
                    index_data = disp.id;
                    console.log(index_data);
                }
                addhtml+='<div class="col xs12 s12 m6 l4 xl3"> ' +
                                ' <div class="card" id="card${disp.id}" style="background-color:#124580" > ' +
                                    ' <div class="card-content white-text"> ' +
                                           ' <div align="center"> ';
                //Identificamos el tipo correspondiente y le asiganamos una imagen de referencia
                if (disp.type == 1) {
                    addhtml += ' <img src="../static/images/lightbulb.png" alt="" class="circle"> ';
                } else if (disp.type == 2) {
                    addhtml += ' <img src="../static/images/window.png" alt="" class="circle"> ';
                } 
                addhtml += ' <span class="card-title"><b>' + disp.name + '</b></span> ' + 
                                ' <p><i>' + disp.description + ' </i></p> ' +                               
                                ' <br> ' +
                                ' <div class="switch"> ' +
                                    ' <label> Off ' +
                                        ' <input ' ;
                //Validamos el estado del dispositivo
                if (disp.state) {
                    addhtml += ' checked ';
                }
                                            
                addhtml += ' type="checkbox" id="cb_' + disp.id + '"> '+
                                            ' <span class="lever"></span> On' +
                                            ' </label> ' +
                                        ' </div> ' +
                                ' <br> ' +
                                            ' <button id="btn_del' + disp.id + '" class="btn waves-effect waves-light button-view btn red ">Borrar</button> ' +
                                            ' <button id="btn_mod' + disp.id + '" data-target="modal_Edit_Device" class="btn modal-trigger">Editar</button> ' +   
                                            ' </div> ' +
                                    ' </div> ' +
                                ' </div> ' +
                            ' </div> ';

                
            }

            contenedor.innerHTML = addhtml;
            for (let disp of resputa) {
                // Agregamos los eventListener de cada componente
                let checkbox = document.getElementById("cb_" + disp.id);
                checkbox.addEventListener("click",this);
                let btnEliminar = document.getElementById("btn_del" + disp.id);
                btnEliminar.addEventListener("click",this);
                let btnModificar = document.getElementById("btn_mod" + disp.id);
                btnModificar.addEventListener("click",this);
            }
        
          } else {
              alert("Disculpe las molestas estamos con problemas tecnicos =(!")
          }
    }
    
    public handlerResponseActualizar(status: number, response: string) {
        if (status == 200) {
            console.log(response);
            if(JSON.parse(response).tipo == "add_ok"){
                let cierre=this.framework.recuperarElemento("closeModalNew");
                cierre.click();
                location.reload();
            }
            else if(JSON.parse(response).tipo == "update_ok"){
                let cierre2=this.framework.recuperarElemento("closeModalEdit");
                cierre2.click();
                location.reload();
            }
            else if(JSON.parse(response).tipo == "delete_ok"){
                location.reload();
            } else if (JSON.parse(response)[0].tipo == "getDevice_ok"){
                let valoresDB = JSON.parse(response)[0];
                let inputName = <HTMLInputElement> document.getElementById('mod_Name');
                let inputDescription = <HTMLInputElement> document.getElementById('mod_Desc');
                let inputStateOff = <HTMLInputElement> document.getElementById('mod_off');
                let inputStateOn = <HTMLInputElement> document.getElementById('mod_on');
                let inputType1 = <HTMLInputElement> document.getElementById('mod_luces');
                let inputType2 = <HTMLInputElement> document.getElementById('mod_persiana');
                let inputType3 = <HTMLInputElement> document.getElementById('mod_otros');
                
                inputName.value = valoresDB.name;
                inputDescription.value = valoresDB.description;
                if(valoresDB.state  == 1){
                    inputStateOn.checked = true;
                } else {
                    inputStateOff.checked = true;
                }

                if(valoresDB.type == 1){
                    inputType1.checked = true;
                } else if(valoresDB.type == 2){
                    inputType2.checked = true;
                } else {
                    inputType3.checked = true;
                }

                
            }
            
        } else {
            alert("Error")    
        }
        
    }
    // Recibo los eventos y los proceso
    public handleEvent(e:Event): void {
        //console.log(e.target);
        let objetoEvento = <HTMLInputElement>e.target;
                
        if (e.type == "click" && objetoEvento.id.startsWith("cb_")) {
            // Actualizar estado del switch
            console.log(objetoEvento.id,);
            let datos = { "idDevice": parseInt(objetoEvento.id.substring(3)), "state": (objetoEvento.checked) ? 1 : 0 };
            this.framework.ejecutarRequest("POST","http://localhost:8000/updateStateDev/", this,datos); 
        
        }else if (e.type == "click" && ( objetoEvento.id.startsWith("btn_mod"))){
      
            id_Card = objetoEvento.id.substring(7);
            console.log(objetoEvento.id.substring(7))
            let datos = {"idDevice": objetoEvento.id.substring(7)};
            this.framework.ejecutarRequest("POST","http://localhost:8000/getDevice/", this, datos);     
        
        } else if (e.type == "click" && ( objetoEvento.id.startsWith("btn_del"))){
            //Borrar un dispositivo    
            let datos=({ "idDevice": objetoEvento.id.substring(7)})
            this.framework.ejecutarRequest("POST","http://localhost:8000/deleteDevice/", this,datos)
        } 
        else if(e.type == "click" && ( objetoEvento.id.startsWith("btnSalvarNew"))){
            //Agregar dispositivo
                console.log(objetoEvento.id,)
                let fld_new_Name =this.framework.recuperarElemento("new_Name") as HTMLInputElement;
                let fld_new_Desc =this.framework.recuperarElemento("new_Desc") as HTMLInputElement;

                let off =this.framework.recuperarElemento("new_off") as HTMLInputElement;
                let on =this.framework.recuperarElemento("new_on") as HTMLInputElement;

                let luces =this.framework.recuperarElemento("new_luces") as HTMLInputElement;
                let persiana =this.framework.recuperarElemento("new_persiana") as HTMLInputElement;
                let otros =this.framework.recuperarElemento("new_otros") as HTMLInputElement;


                let state = 2;
                let type = 0;


                if(off.checked== true){
                    state=0;} 
    
                if(on.checked == true){
                    state=1;} 

                if(luces.checked == true){
                    type=1;} 
    
                if(persiana.checked == true){
                    type=2;} 
    
                if(otros.checked == true){
                    type=3;} 

                if((fld_new_Name.value =='')||(fld_new_Desc.value =='')||(state ==2)||(type ==0))
                {
                    alert("No se almacenarán campos vacíos")
                }
                else 
                {  
                    let datos = { "idDevice": index_data+1, "name": fld_new_Name.value, "description": fld_new_Desc.value, "state": state, "type": type };
                    console.log(datos)
                    this.framework.ejecutarRequest("POST","http://localhost:8000/newDevice/", this,datos)
                }
          
        }
        else if(e.type == "click" && ( objetoEvento.id.startsWith("btnSalvarMod"))){
            //Modificar dispositivo
            console.log(objetoEvento.id,)
            let fld_mod_Name =this.framework.recuperarElemento("mod_Name")  as HTMLInputElement;
            let fld_mod_Desc =this.framework.recuperarElemento("mod_Desc") as HTMLInputElement;

            let off =this.framework.recuperarElemento("mod_off") as HTMLInputElement;
            let on =this.framework.recuperarElemento("mod_on") as HTMLInputElement;

            let luces =this.framework.recuperarElemento("mod_luces") as HTMLInputElement;
            let persiana =this.framework.recuperarElemento("mod_persiana") as HTMLInputElement;
            let otros =this.framework.recuperarElemento("mod_otros") as HTMLInputElement;
            
            let type=0;
            let state=2;

            if(off.checked== true){
                state=0;} 

            if(on.checked == true){
                state=1;} 

            if(luces.checked == true){
                type=1;} 

            if(persiana.checked == true){
                type=2;} 

            if(otros.checked == true){
                type=3;} 

            if((fld_mod_Name.value =='')||(fld_mod_Desc.value =='')||(state ==2)||(type ==0))
            {
                alert("No se modificarán campos vacíos")
            }
            else 
            {  
                let datos = { "idDevice": id_Card, "name": fld_mod_Name.value, "description": fld_mod_Desc.value, "state": state, "type": type};
                console.log(datos)
                this.framework.ejecutarRequest("POST","http://localhost:8000/updateDevice/", this,datos)
            }
            
    }
    }
}

window.addEventListener("load", () => {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems,"");
    M.updateTextFields();
    var elems1 = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems1, "");
    let main: Main = new Main();
    console.log("window")
    this.btnSalvarNew.addEventListener("click", main); //Se agrega Listener para boton del modal de Agregar Dispositivo
    this.btnSalvarMod.addEventListener("click", main); //Se agrega Listener para boton del modal de Modificar Dispositivo
});