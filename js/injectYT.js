//script that injects into YouTube
var k = setTimeout(realMain, 2000);
isETPaused = true;

RESUME = 1;
PAUSE = 2;

function realMain(){
    //Modify play and pause

    function doWhat(statusNum){
        //console.log(statusNum);
        if(!isETPaused && statusNum == RESUME ){
            rememberToPause();
            isETPaused=true;
        }else if(isETPaused && statusNum == PAUSE){
            rememberToPlay();
            isETPaused=false;
        }else if(!isETPaused && statusNum == 5){
            rememberToPause();
            isETPaused=true;
        }else if(isETPaused && statusNum == 0){
            rememberToPlay();
            isETPaused=false;
        }else if(!isETPaused && statusNum == 3){
            rememberToPause();
            isETPaused=true;
        }else{
        }
    }

    function rememberToPause(){
        chrome.extension.sendRequest({'command':'pauseET'});
    }

    function rememberToPlay(){
        chrome.extension.sendRequest({'command':'resumeET'});
    }

    function addlist(){
        var movie = document.getElementById('movie_player');
        //console.log(movie);
        movie.addEventListener("onStateChange", "youDidSomething");
        rememberToPause();
        //console.log(movie.getDuration());
    }

    function main(){
        window.youDidSomething = function(state){
            if (state == 2){ 
                var resumeET = document.createEvent("Events");
                resumeET.initEvent("resumeET",true,false); 
                document.dispatchEvent(resumeET);
            }
            if (state == 1){
                var pauseET = document.createEvent("Events");
                pauseET.initEvent("pauseET",true,false);
                document.dispatchEvent(pauseET);
            }
        }

        window.onunload = function(){
            var resumeET = document.createEvent("Events");
            resumeET.initEvent("resumeET",true,false); 
            document.dispatchEvent(resumeET);
        }
        
    }

    //this gets the element status (status describes whether the video is playing) within the page
    function getSt(){
        playing = document.getElementById('playing');
        doWhat(parseInt(playing.innerText));
    }

    function inject(main){
        var script = document.createElement('script');
        script.appendChild(document.createTextNode('('+ main +')();'));
        (document.body || document.head || document.documentElement).appendChild(script);
    }

    function listenForChange(){
        window.addEventListener("pauseET", function(){console.log('pausing 8tracks'); rememberToPause();}, false, true);
        window.addEventListener("resumeET", function(){console.log('playing 8tracks'); rememberToPlay();}, false, true);
    }

    addlist();
    listenForChange();
    inject(main);
    console.log('8tube scripts loaded for YouTube.');
}
