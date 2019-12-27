//load時の実行
window.addEventListener("load",function(){
    change_tab("settings");
    var buttons = document.getElementsByTagName("button");
    disable_button(buttons);
    var auth_button = document.getElementsByClassName("auth_button");
    able_button(auth_button);
},false);

//ページ操作用
function change_tab(id) {
    hide("tts");
    hide("dictionary");
    hide("settings");
    hide("information");
    display(id);
}

function hide(id){
    document.getElementById(id).style.display = "none";
    document.getElementById(id+"_tab").style.borderBottom = "solid 2px black";
}

function display(id){
    document.getElementById(id).style.display = "block";
    document.getElementById(id+"_tab").style.borderBottom = "solid 2px white";
}

//ボタン操作
function able_button(buttons){
    numof_button = buttons.length;
    for(i=0;i<numof_button;i++){
        buttons[i].disabled = "";
    }
}

function disable_button(buttons){
    numof_button = buttons.length;
    for(i=0;i<numof_button;i++){
        buttons[i].disabled = "disabled";
    }
}

//range表示更新
window.addEventListener("load",function getRange(){
    updateValue = function(elem,target){
        return function(){
            target.innerHTML=elem.value;
        }
    }
    var elem = document.getElementsByClassName("range");
    for(var i = 0, max = elem.length; i < max; i++){
        bar = elem[i].getElementsByTagName("input")[0];
        target = elem[i].getElementsByTagName("span")[0];
        bar.addEventListener("input", updateValue(bar, target), false);
    }
}, false);

//声調パラメタリセット
function reset_param(){
    document.getElementById("param").reset();
    update_param_display();
}

//リセット時表示更新
function update_param_display(){
    var elem = document.getElementsByClassName("range");
    for(let i = 0, max = elem.length; i < max; i++){
        bar = elem[i].getElementsByTagName("input")[0];
        target = elem[i].getElementsByTagName("span")[0];
        target.innerHTML=bar.value;
    }
}

//子要素をすべて削除
function remove_all_child(id){
    parent_elem = document.getElementById(id);
    while(parent_elem.firstChild){
        parent_elem.removeChild(parent_elem.firstChild);
    }
}

//子要素を最初の一つを除いてすべて削除
function remove_all_child_without_first_child(id){
    parent_elem = document.getElementById(id);
    while(parent_elem.childElementCount!=1){
        parent_elem.removeChild(parent_elem.lastChild);
    }
}

//モデルID表示
function display_model_id(){
    var models = document.getElementsByClassName("speaker_models");
    var display_cb = document.getElementById("display_speaker_model_id");
    var offset = 28;
    if(display_cb.checked){
        for(var i = 0; i < models.length; i++){
            model_id = models[i].value;
            models[i].text+=("（"+model_id+"）");
        }
    }
    else{
        for(var i = 0; i < models.length; i++){
            models[i].text = models[i].text.slice(0,models[i].text.length-offset);
        }
    }
}

//辞書レコードページ遷移
function change_page(dict_type, method = ""){
    if(dict_type=="word"){
        var display_func = display_words;
    }
    else if(dict_type=="sentence"){
        var display_func = display_sentences;
    }
    else{
        var display_func = display_companies;
    }
    page = to_halfwidth(document.getElementById(dict_type+"_page_num").value);
    if((1 <= page) && (page <= 999)){
        if(method == "next"){
            if(page == 999){
                return;
            }
            page++;
        }
        else if(method == "prev"){
            if(page==1){
                return;
            }
            page--;
        }
        display_func(page);
    }
    else{
        display_func();
    }
}
