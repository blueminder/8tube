//script that injects into 8tracks

function play(){
    window.currentSID = soundManager.soundIDs[soundManager.soundIDs.length-1];
    window.currentSong = soundManager.getSoundById(currentSID);
    console.log("8tracks resuming!");
    soundManager.resume(currentSID);
}
function pause(){
    window.currentSID = soundManager.soundIDs[soundManager.soundIDs.length-1];
    window.currentSong = soundManager.getSoundById(currentSID);
    console.log("8tracks pausing!");
    soundManager.pause(currentSID);
}

function inject(main){
    var script = document.createElement('script');
    script.appendChild(document.createTextNode('('+ main +')();'));
    (document.body || document.head || document.documentElement).appendChild(script);
}

function main(){
	//this is here so that the background page can find 8tracks when it has loaded
	chrome.extension.sendRequest({'etTab':'findMePlz'});
    inject(addETListener);
	
}

function recRequest(request, sender, sendResponse){
	console.log(request.command);
	if(request.command == "resumeET"){
		inject(play);
	}
	if(request.command == "pauseET"){
		inject(pause);
	}
}

function addETListener(){
    if(soundManager.soundIDs.length>0){
      window.currentSID = soundManager.soundIDs[soundManager.soundIDs.length-1];
      window.currentSong = soundManager.getSoundById(currentSID);
      playStatus = !window.currentSong.paused;
    } else {
      playStatus = false;
    }
    
    var playingEv = document.createEvent("Events");
    var pausingEv = document.createEvent("Events");
    pausingEv.initEvent("paused",true,false); 
    playingEv.initEvent("playing",true,false); 
    $.subscribe("currentSong.paused", function(){ 
        if (!currentSong.paused != playStatus) {
            playStatus = !currentSong.paused;
            playStatus ? document.dispatchEvent(playingEv) : document.dispatchEvent(pausingEv);
        }
    });
}

//This function finds the active ET window
function findActiveET(){
    chrome.extension.sendRequest({'etTab':'findActive'});
}

function tellbgETPaused(){
    chrome.extension.sendRequest({'etTab':'isETPaused'});
}

window.addEventListener("playing", function(){console.log('playing'); findActiveET();}, false, true);
window.addEventListener("paused", function(){console.log('paused'); tellbgETPaused();}, false, true);

chrome.extension.onRequest.addListener(recRequest);

console.log('8tube scripts loaded for 8tracks.');
var t = setTimeout(main, 4000);
