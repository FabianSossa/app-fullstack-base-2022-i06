class FrameWork{
                     
    public ejecutarRequest(metodo: string, url: string,lister:ResponseLister,data?:any) {
      let xmlHttp: XMLHttpRequest = new XMLHttpRequest();
          xmlHttp.onreadystatechange = () => {
            if (xmlHttp.readyState == 4) {
              if (metodo == "GET") {
                if(typeof data !== 'undefined'){
                    lister.handlerResponseActualizar(xmlHttp.status,xmlHttp.responseText)
                } else {
                    lister.handlerResponse(xmlHttp.status,xmlHttp.responseText)
                }                
              } else {
                lister.handlerResponseActualizar(xmlHttp.status,xmlHttp.responseText)
              }
            }
          }     
          xmlHttp.open(metodo, url, true);
          if (metodo == "POST") {
            xmlHttp.setRequestHeader("Content-Type", "application/json")
            xmlHttp.send(JSON.stringify(data))
          } else {
            if(typeof data !== 'undefined'){
                xmlHttp.setRequestHeader("Content-Type", "application/json")
                xmlHttp.send(JSON.stringify(data))
            } else {
                xmlHttp.send();
            }  
          }     
    }
    
  
    public recuperarElemento(id: string): HTMLElement{
      let element = document.getElementById(id);
      return element;
  
    }
  }