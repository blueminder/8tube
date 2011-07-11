console.log("8tube starting...");
tabs = 1;
etUrl = "8tracks.com";
etTab = 0;
isETPaused = true;
currentTab = 0;


function releaseTheShark(){
    chrome.tabs.executeScript(etTab, {'file':'js/injectET.js'});
}
function findId(){
    chrome.tabs.getAllInWindow(this.tab, function(tabso){console.log(tabso);tabs=tabso;});

    for(i in tabs){
        if(tabs[i].url.indexOf(etUrl)!=-1){
            console.log('the 8tracks tab is ' + tabs[i].id);
            etTab=tabs[i].id;
            //this.etTab=tabs[i].id;
            }
        }

        if(etTab!=0) console.log('8tracks has been found');
        else console.log('8tracks instance not found');

        if(etTab!=0) clearInterval(intervalId);
}


chrome.extension.onRequest.addListener(
		  function(request, sender, sendResponse) {
		      console.log(sender.tab ?
			                      "from a content script:" + sender.tab.url + ' and the tab info is ' + sender.tab :
					                      "from the extension");
              console.log('sender tab id is ', sender.tab.id);
              
              chrome.tabs.getSelected(null, function(tab) { currentTab=tab.id; });

				if (request.etTab == 'findMePlz'){
					console.log('finding 8tracks, please wait')
					intervalId=setInterval(findId, 100);
						//findId();
				}

				if (request.etTab == 'findActive'){
                    etTab = sender.tab.id;
                    //clear the isETPaused boolean
                    if(currentTab == etTab){
                        isETPaused = false;
                    }
                    console.log('Active ET is ', etTab);
                }

				if (etTab==0){
				   console.log('8tracks has not been opened');
				}
                if (request.etTab == 'isETPaused'){
                    //if the sender of the request and the
                    if(currentTab == etTab){
                        isETPaused = true;
                    }
                }
				if (request.command == "resumeET"){
                    chrome.tabs.sendRequest(etTab, {command: "resumeET"});
                    sendResponse({});
		        }else if ( request.command == "pauseET"){
                    chrome.tabs.sendRequest(etTab, {command: "pauseET"});
                    sendResponse({});
				}else{
                    sendResponse({}); // snub them.
                    console.log(request);
				}
		});
