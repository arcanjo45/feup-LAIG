function getPrologRequest(requestString, onSuccess, onError, port) {
    var requestPort = port || 8081;
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

    request.onload = onSuccess || function(data) {
        console.log("Request successful. Reply: " + data.target.response);
    };
    request.onerror = onError || function() {
        console.log("Error waiting for response");
    };

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
}

function makeRequest(req, successHandler, errorHandler, port) {
    console.log("Making request '"+req+"'");
    getPrologRequest(req, successHandler);
}

function matrixToList(matrix) {

    var list = "[";
    
    for(mat in matrix)
        list += "[" + matrix[mat] + "],";
    
    list = list.substring(0, list.length - 1);
    
    list += "]";
        
    console.log(list);
        
    return list;

}


function listToMatrix(list) {

    console.log(list);

    return JSON.parse(list);

}