//辞書登録単語一覧表示
function display_words(page = 1){
    var target = document.getElementById("filter_w_target").value;
    var dict_data_id = to_halfwidth(document.getElementById("filter_w_ddid").value);
    var limit = to_halfwidth(document.getElementById("w_limit").value);
    var address = api_url+"/v1/dicts/word_dicts/ja_JP?limit="+limit+"&page="+page+"&target="+target+"&dictDataId="+dict_data_id;
    var sort = new Array;
    if(document.getElementById("wo1").checked){
        if(document.getElementById("wo1_u").checked){
            sort.push("target");
        }
        else{
            sort.push("-target");
        }
    }

    if(document.getElementById("wo2").checked){
        if(document.getElementById("wo2_u").checked){
            sort.push("pronunciation");
        }
        else{
            sort.push("-pronunciation");
        }
    }

    if(document.getElementById("wo3").checked){
        if(document.getElementById("wo3_u").checked){
            sort.push("createdAt");
        }
        else{
            sort.push("-createdAt");
        }
    }
    
    if(document.getElementById("wo4").checked){
        if(document.getElementById("wo4_u").checked){
            sort.push("updatedAt");
        }
        else{
            sort.push("-updatedAt");
        }
    }

    if(sort.length>0){
        address = address + "&sort=" + sort[0];        
        for(i=1;i<sort.length;i++){
            address = address + "," + sort[i];
        }
    }

    http_request(address, "get", "json", function(response_json){
        remove_all_child("word_list");
        for(i=0;i<response_json.dictData.length;i++){
            var word_line = document.createElement("tr");
            var word_cb = document.createElement("td");
            var cb = document.createElement("input")
            cb.value= response_json.dictData[i].dictDataId;
            cb.type = "checkbox";
            cb.id = cb.value+"_w";
            cb.classList.add("words");
            word_cb.appendChild(cb);
            word_line.appendChild(word_cb);
            var word_tar = document.createElement("td");
            var word = document.createElement("input");
            word.type = "text";
            word.id = cb.id+"_target"
            word.value = response_json.dictData[i].target;
            word_tar.appendChild(word);
            word_line.appendChild(word_tar);
            var word_pron = document.createElement("td");
            var pron = document.createElement("input");
            pron.type = "text";
            pron.id = cb.id+"_pron";
            pron.value = response_json.dictData[i].pronunciation;
            word_pron.appendChild(pron);
            word_line.appendChild(word_pron);
            var word_pos = document.createElement("td");
            var pos_list = document.getElementById("pos");
            var pos = pos_list.cloneNode(true);
            pos.id = cb.id+"_pos";
            pos.removeChild(pos.firstChild);
            pos_children = pos.children;
            for(j=0;j<pos.childElementCount;j++){
                if(pos_children[j].value==response_json.dictData[i].partOfSpeech){
                    pos_children[j].selected = true;
                    break;
                }
            }
            word_pos.appendChild(pos);
            word_line.appendChild(word_pos);
            word_list.appendChild(word_line);
        }
        document.getElementById("word_page_num").value = page;
    });
}

//単語登録
function reg_word(){
    var address = api_url+"/v1/dicts/word_dicts/ja_JP";
    var target = to_fullwidth(document.getElementById("target").value);
    var pron = document.getElementById("pron").value;
    var pos = document.getElementById("pos").value;
    var data = {"target":target, "partOfSpeech":pos, "pronunciation":pron}
    http_request(address, "post", "text", function(response_text){
        console.log(response_text);
        document.getElementById("target").value = "";
        document.getElementById("pron").value = "";
        document.getElementById("pos").selectedIndex = 0;
        change_page("word");
    }, data);
}

//単語更新
function update_words(){
    var address = api_url+"/v1/dicts/word_dicts/ja_JP/";
    var words = document.getElementsByClassName("words");
    var ids = new Array;
    for(i=0;i<words.length;i++){
        if(words[i].checked){
            ids.push(words[i].value);
        }
    }
    for(i=0;i<ids.length;i++){
        var id=ids[i];
        var target = to_fullwidth(document.getElementById(id+"_w_target").value);
        var pron = document.getElementById(id+"_w_pron").value;
        var pos = document.getElementById(id+"_w_pos").value;
        var data={"target": target, "pronunciation": pron, "partOfSpeech": pos};
        if((i+1)!=ids.length){
            http_request(address+id, "put", "text", function(){}, data, function(){
                change_page("word");
            });
        }
        else{
            http_request(address+id, "put", "text", function(){
                change_page("word");
            }, data, function(){
                change_page("word");
            });
        }
    }
}

//辞書登録文一覧表示
function display_sentences(page = 1){
    var target = document.getElementById("filter_s_target").value;
    var dict_data_id = to_halfwidth(document.getElementById("filter_s_ddid").value);
    var limit = to_halfwidth(document.getElementById("s_limit").value);
    var address = api_url+"/v1/dicts/sentence_dicts/ja_JP?limit="+limit+"&page="+page+"&target="+target+"&dictDataId="+dict_data_id;
    var sort = new Array;
    if(document.getElementById("so1").checked){
        if(document.getElementById("so1_u").checked){
            sort.push("target");
        }
        else{
            sort.push("-target");
        }
    }

    if(document.getElementById("so2").checked){
        if(document.getElementById("so2_u").checked){
            sort.push("utterance");
        }
        else{
            sort.push("-utterance");
        }
    }

    if(document.getElementById("so3").checked){
        if(document.getElementById("so3_u").checked){
            sort.push("createdAt");
        }
        else{
            sort.push("-createdAt");
        }
    }
    
    if(document.getElementById("so4").checked){
        if(document.getElementById("so4_u").checked){
            sort.push("updatedAt");
        }
        else{
            sort.push("-updatedAt");
        }
    }

    if(sort.length>0){
        address = address + "&sort=" + sort[0];        
        for(i=1;i<sort.length;i++){
            address = address + "," + sort[i];
        }
    }
    http_request(address, "get", "json", function(response_json){
        remove_all_child("sentence_list");
        for(i=0;i<response_json.dictData.length;i++){
            var sentence_line = document.createElement("tr");
            var sentence_cb = document.createElement("td");
            var cb = document.createElement("input");
            cb.value = response_json.dictData[i].dictDataId;
            cb.type = "checkbox";
            cb.id = cb.value+"_s";
            cb.classList.add("sentences");
            sentence_cb.appendChild(cb);
            sentence_line.appendChild(sentence_cb);
            var sentence_tar = document.createElement("td");
            var sentence = document.createElement("textarea");
            sentence.id = cb.id+"_target";
            sentence.cols = 60;
            sentence.rows = 1;
            sentence.value = response_json.dictData[i].target;
            sentence_tar.appendChild(sentence);
            sentence_line.appendChild(sentence_tar);
            var sentence_utter = document.createElement("td");
            var utter = document.createElement("textarea");
            utter.id = cb.id+"_utter";
            utter.cols = 60;
            utter.rows = 1;
            utter.value = response_json.dictData[i].utterance;
            sentence_utter.appendChild(utter);
            sentence_line.appendChild(sentence_utter);
            sentence_list.appendChild(sentence_line);
        }
        document.getElementById("sentence_page_num").value = page;
    });
}

//文登録
function reg_sentence(){
    var address = api_url+"/v1/dicts/sentence_dicts/ja_JP";
    var target = document.getElementById("sentence_target").value;
    var utter = document.getElementById("sentence_utter").value;
    var data = {"target":target, "utterance":utter}
    http_request(address, "post", "text", function(response_text){
        console.log(response_text);
        document.getElementById("sentence_target").value = "";
        document.getElementById("sentence_utter").value = "";
        change_page("sentence");
    }, data);
}

//文更新
function update_sentences(){
    var address = api_url+"/v1/dicts/sentence_dicts/ja_JP/";
    var sentences = document.getElementsByClassName("sentences");
    var ids = new Array;
    for(i=0;i<sentences.length;i++){
        if(sentences[i].checked){
            ids.push(sentences[i].value);
        }
    }
    for(i=0;i<ids.length;i++){
        var id=ids[i];
        var target = document.getElementById(id+"_s_target").value;
        var utter = document.getElementById(id+"_s_utter").value;
        var data={"target": target, "utterance": utter};
        if((i+1)!=ids.length){
            http_request(address+id, "put", "text", function(){}, data, function(){
                change_page("sentence");
            });
        }
        else{
            http_request(address+id, "put", "text", function(){
                change_page("sentence");
            }, data, function(){
                change_page("sentence");
            });
        }
    }
}

//辞書データ一括削除処理
function delete_items(dict_type){
    var selected_items = document.getElementsByClassName(dict_type+"s");
    var ids = new Array;
    for(i=0;i<selected_items.length;i++){
        if(selected_items[i].checked){
            ids.push(selected_items[i].value);
        }
    }
    for(i=0;i<ids.length;i++){
        var address = api_url+"/v1/dicts/"+dict_type+"_dicts/ja_JP/"+ids[i];
        if((i+1)!=ids.length){
            http_request(address, "delete", "text", function(){});
        }
        else{
            http_request(address, "delete", "text", function(){
                change_page(dict_type);
            });
        }
    }
}

//全角数値を半角数値に変換
function to_halfwidth(elm){
    return elm.replace(/[０-９]/g, function(s){
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
}

//半角文字を全角文字に変換
function to_fullwidth(elm){
    return elm.replace(/[A-Za-z0-9]/g, function(s){
        return String.fromCharCode(s.charCodeAt(0)+0xFEE0);
    });
}