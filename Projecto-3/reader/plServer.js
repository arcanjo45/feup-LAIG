
/**
 * getPrologRequest
 * @param{requestString(String)}
Função que faz pedidos Ajax ao Prolog
 */
function getPrologRequest(requestString, onSuccess, onError, port,assinc) {
    var requestPort = port || 8081;
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, assinc);

    request.onload = onSuccess || function(data) {
        console.log("Request successful. Reply: " + data.target.response);
    };
    request.onerror = onError || function() {
        console.log("Error waiting for response");
    };

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
}

/**
 * matrixToList
 * @param{matrix(Matrix)}
Função que transforma uma matrix de javascript numa lista para enviar para o Prolog
 */
function matrixToList(matrix) {

    var list = "[";
    
    for(mat in matrix)
        list += "[" + matrix[mat] + "],";
    
    list = list.substring(0, list.length - 1);
    
    list += "]";
        
    console.log(list);
        
    return list;

}

/**
 * listToMatrix
 * @param{list(String)}
Função que transforma uma lista de Prolog numa matriz de Javascript
 */
function listToMatrix(list) {

    console.log(list);

    return JSON.parse(list);

}