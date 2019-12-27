//テキスト解析
function text_analyze(){
    var address = api_url+"/v1/text_analyze";
    var text = document.getElementById("plain_textarea").value;
    var lang = "ja_JP";
    var data = {"text":text, "lang":lang};
    http_request(address, "post", "text", function(response_text){
        document.getElementById("sentence_target").value = text
        document.getElementById("utterance_textarea").value = response_text;
        document.getElementsByName("text_type")[1].checked = true;
    }, data);
}

//音声合成
function text_to_speech(sequential=""){
    tts_button = document.getElementsByClassName("tts_button");
    disable_button(tts_button);

    var address = api_url+"/v1/" + sequential + "tts";
    var type = document.getElementsByName("text_type");
    if(type[0].checked){
        var text = document.getElementById("plain_textarea").value;
        var text_type = type[0].value;
    }
    else{
        var text = document.getElementById("utterance_textarea").value;
        var text_type = type[1].value;
    }
    var speaker_id = document.getElementById("speaker_list").value;
    var speech_rate = document.getElementById("speech_rate").value;
    var power_rate = document.getElementById("power_rate").value;
    var pitch = +document.getElementById("pitch").value;
    var intonation = +document.getElementById("intonation").value;
    var sampling_rate = 22050;

    var data = {"text":text, "textType":text_type,"speakerId":speaker_id, "powerRate":power_rate, "pitch":pitch, "intonation":intonation, "speechRate":speech_rate};

    //逐次音声合成
    if(sequential){
        try{
            var scheduled_time = 0;
            var current_offset = 0;
            var initial_delay = +document.getElementById("initial_delay").value;
            data = JSON.stringify(data);
            var http = new XMLHttpRequest();
            http.open("post", address);
            http.setRequestHeader("Authorization","Bearer "+access_token);
            http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            http.setRequestHeader("Accept","text/plain");
            http.responseType = "text";
            var length_1=0;
            var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            http.send(data);

            http.onprogress = function () {
                if((200 <= http.status && http.status < 300) || (http.status == 304)){  
                    var length_2 = http.responseText.length;
                    if(http.readyState != 4){
                        var rem = (length_2 - length_1) % 8;
                        if(rem!=0){
                            length_2 = length_2 - rem;
                        }
                    }
                    var arrayBuffer = base64ToArrayBuffer(http.responseText.slice(length_1,length_2));
                    length_1 = length_2; 
                    var wav_size = arrayBuffer.byteLength;
                    var file_size = wav_size + 36;
                    var wav_size_16 = ("00000000" + wav_size.toString(16)).slice(-8);
                    var file_size_16 = ("00000000" + file_size.toString(16)).slice(-8);
                    var sampling_rate_16 = ("00000000" + sampling_rate.toString(16)).slice(-8);
                    var byteps_16 = ("00000000" + (sampling_rate*2).toString(16)).slice(-8);
                    var head = [
                        0x52, 0x49, 0x46, 0x46, "0x" + file_size_16.slice(6,8), "0x" + file_size_16.slice(4,6), "0x" + file_size_16.slice(2,4), "0x" + file_size_16.slice(0,2),
                        0x57, 0x41, 0x56, 0x45, 0x66, 0x6D, 0x74, 0x20, 0x10, 0, 0, 0, 0x01, 0, 0x01, 0,
                        "0x" + sampling_rate_16.slice(6,8), "0x" + sampling_rate_16.slice(4,6), "0x" + sampling_rate_16.slice(2,4), "0x" + sampling_rate_16.slice(0,2),
                        "0x" + byteps_16.slice(6,8), "0x" + byteps_16.slice(4,6), "0x" + byteps_16.slice(2,4), "0x" + byteps_16.slice(0,2), 0x02, 0, 0x10, 0, 0x64, 0x61, 0x74, 0x61,
                        "0x" + wav_size_16.slice(6,8), "0x" + wav_size_16.slice(4,6), "0x" + wav_size_16.slice(2,4), "0x" + wav_size_16.slice(0,2)
                    ];
                    var head_array = new Uint8Array(44);
                    for(i = 0; i < 44; i++){
                        head_array[i]=head[i];
                    }
                    arrayBuffer = concatenation([head_array,arrayBuffer]);
                                    
                    audioCtx.decodeAudioData(arrayBuffer).then(function(decodedData){
                        var source = audioCtx.createBufferSource();
                        source.buffer = decodedData;
                        source.connect(audioCtx.destination);
                        var current_time = audioCtx.currentTime-current_offset;
                        if(scheduled_time==0){
                            source.start(initial_delay + current_time);
                            scheduled_time = initial_delay + current_time + decodedData.duration;
                        }
                        else if(current_time < scheduled_time){
                            source.start(scheduled_time);
                            scheduled_time += decodedData.duration;

                        }
                        else{
                            source.start();
                            current_offset += current_time;
                            scheduled_time = decodedData.duration;
                        }
                    });
                }
            }

            http.onreadystatechange = function(){
                if(http.readyState == 4){
                    if(http.status == 0){
                        window.alert("[ERROR]通信失敗");
                        able_button(tts_button);
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
                            if(http.response==""){
                                window.alert("レスポンスに音声データがありません。\n※英語話者を使用している場合、日本語文字は音声生成されません。");
                                able_button(tts_button);
                                return;
                            }
                            else{
                                console.log("通信終了");
                                able_button(tts_button);
                            }
                        }
                        else{
                            console.log("--- Response Header ---");
                            console.log(http.getAllResponseHeaders("\n"));
                            console.log("--- Response Body ---");
                            console.log(http.response);
                            console.log("-----------------------");
                            var error_res=JSON.parse(http.response);
                            window.alert("[ERROR]通信失敗\nhttpステータスコード:" + http.status+"\ncode:"+error_res.code+"\ndetail:"+error_res.detail);
                            able_button(tts_button);
                        }
                    }
                }
            };
        }
        catch(e){
            window.alert(e);
            able_button(tts_button);
        }  
    }

    //一括音声合成
    else{
        http_request(address, "post", "arraybuffer", function(response_array){
            if(response_array.byteLength==44){
                window.alert("音声データがありません。\n※英語話者を使用している場合、日本語文字は音声生成されません。")
                able_button(tts_button);
                return;
            }
            //wavファイルの生成
            var url = window.URL || window.webkitURL;
            document.getElementById("download").download = "output.wav";
            var blob = new Blob([response_array], {type:"octet/stream"});
            document.getElementById("download").href = url.createObjectURL(blob);

            //ブラウザ上の再生
            var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            audioCtx.decodeAudioData(response_array).then(function(decodedData){
                console.log(decodedData);
                var source = audioCtx.createBufferSource();
                source.buffer = decodedData;
                source.connect(audioCtx.destination);
                source.start();
                able_button(tts_button);
            });
        }, data, function(){
            able_button(tts_button);
        });
    }
}

//base64→ArrayBuffer
function base64ToArrayBuffer(base64){
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++){
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

//ArrayBuffer結合
function concatenation(segments){
    var sumLength = 0;
    for(var i = 0; i < segments.length; ++i){
        sumLength += segments[i].byteLength;
    }
    var whole = new Uint8Array(sumLength);
    var pos = 0;
    for(var i = 0; i < segments.length; ++i){
        whole.set(new Uint8Array(segments[i]),pos);
        pos += segments[i].byteLength;
    }
    return whole.buffer;
}