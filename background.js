console.log("Hey! PCA - Payback Coupon Activator loaded!");


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

        if(changeInfo.status != null && changeInfo.status == "complete"){
            if (tab.url != null && tab.url.startsWith("https://www.payback.de/coupons")) {
                updateBadge(tabId);
            };
        }

});

function updateBadge(updateTabId) {

    chrome.scripting.executeScript({
        target: { tabId: updateTabId },
        func: getCouponCount
    }, (results) => {

        if(results[0].result != null && results[0].result >= 1){

            chrome.action.setBadgeText({ tabId: updateTabId, text: results[0].result.toString()});
            chrome.action.setBadgeBackgroundColor(
                {color: "#52ae32"}
            );

        }

    });    
    
}



function getCouponCount(){


        let count = document.querySelector("#coupon-center").shadowRoot.querySelector("div.coupon-center__header-published > div").innerText;
        var countExtract = count.substring(
        count.indexOf("(") + 1, 
        count.lastIndexOf(")")
        );
    
        let number = parseInt(countExtract);
    
        if(isNaN(number)){
        return 0;
        } else {
        return number;
        }
  
  }

