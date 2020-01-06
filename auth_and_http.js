//アクセストークン取得URL定義
const oauth_url = "https://api.ce-cotoha.com/v1/oauth/accesstokens";

//音声合成API URL定義
const api_url = "https://api.ce-cotoha.com/api/tts";

//アクセストークン変数定義
var access_token = null;

//HTTP通信
function http_request(url, method, response_type, callback, data = {}, callback_error = function(){}){
    try{
        data = JSON.stringify(data);
        var http = new XMLHttpRequest();
        http.open(method, url);
        if(access_token){
            http.setRequestHeader("Authorization","Bearer "+access_token);
        }
        if(method == "post"||method == "put"){
            http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        }
        http.responseType = response_type;
        http.send(data);
        http.onreadystatechange = function(){
            if(http.readyState == 4){
                if(http.status == 0){
                    window.alert("[ERROR]通信失敗");
                    callback_error();
                }
                else{
                    console.log("--- Response Status ---");
                    console.log("Status Code: " + http.status);
                    console.log("Status Text: " + http.statusText);
                    console.log("-----------------------");
                    
                    if((200 <= http.status && http.status < 300) || (http.status == 304)){
                        console.log("--- Response Header ---");
                        console.log(http.getAllResponseHeaders("\n"))
                        console.log("-----------------------");
                        if(http.response){
                            callback(http.response);                        
                        }
                        else{
                            callback();
                        }
                    }
                    else{
                        console.log("--- Response Header ---");
                        console.log(http.getAllResponseHeaders("\n"));
                        console.log("--- Response Body ---");
                        console.log(http.response);
                        console.log("-----------------------");
                        if(access_token){
                            if(response_type=="arraybuffer"){
                                var error_res = new Uint8Array(http.response);
                                error_res = String.fromCharCode.apply(null, error_res);
                                error_res = JSON.parse(error_res);
                            }
                            else if(response_type=="text"){
                                error_res = JSON.parse(http.response);
                            }
                            else{
                                error_res = http.response;
                            }
                            window.alert("[ERROR]通信失敗\nhttpステータスコード:" + http.status+"\ncode:"+error_res.code+"\ndetail:"+error_res.detail);
                        }
                        else{
                            token_error_res = http.response;
                            window.alert("[ERROR]アクセストークン取得失敗\nhttpステータスコード:" + http.status+"\nmessage:"+token_error_res.message);
                        }
                        callback_error();
                    }
                }
            }
        };
    }
    catch(e){
        window.alert(e.message);
        callback_error();
    }
}

//アクセストークン取得
function set_up(){
    var client_id = document.getElementById("client_id").value;
    var client_secret = document.getElementById("client_secret").value;
    var data = {"grantType":"client_credentials", "clientId":client_id, "clientSecret":client_secret};
    http_request(oauth_url, "post", "json", function(response_json){
        access_token = response_json.access_token;
        change_tab("tts");
        display_words();
        display_sentences();
    }, data);
    var buttons = document.getElementsByTagName("button");
    able_button(buttons);
}
