function gotoPayback(){
  var newURL = "https://www.payback.de/coupons";
  chrome.tabs.create({ url: newURL });
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



function getPointsCount(){

  let points = document.querySelector("#member a > strong").innerText;

  if(points != null){

    let text = "" + points;
    
    if(text.includes("P")  && text.includes(".")){

      text = text.replace(".","");
      text = text.replace("P","");
      text = text.replace(" ","");
      text = text.slice(0,-1);
      int = parseInt(text);

	  if(isNaN(int)){
		return 0;
	  } else {
		return int;
	  }
  

    } else {

      return 0;

    }

  } else {
      return 0;
  }

}


function activatePaybackCoupons(){

  console.log("Starting activation manually");

  var count = 0;
  var limit = 500;
  const AllowedButtons = ["Jetzt aktivieren"];
  const CouponItems = document.querySelector("#coupon-center").shadowRoot.querySelectorAll(".coupon-center__container-published-coupons > pbc-coupon");
  
  CouponItems.forEach((thisCouponItem) => {
  
      console.log("");
      console.log("Found not activated coupon. Searching for activation button...");
  
      var ActivateButton = thisCouponItem.shadowRoot.querySelector("pbc-coupon-call-to-action").shadowRoot.querySelector('.coupon-call-to-action__button.coupon__activate-button.not-activated');
  
      if (ActivateButton) {
  
          var ButtonText = ActivateButton.innerText;
  
          console.log("Found new activation button with text: " + ButtonText);
  
          if (AllowedButtons.includes(ButtonText) && count <= limit) {
              console.log("Button Text OK. Clicking Button.");
              ActivateButton.click();
              count = count + 1;
          } else {
              console.log("Button Text NOT OK or limit reached. Skipping Button.");
          }
  
      }
  
  });

  return count;

}

function main() {


  window.addEventListener("DOMContentLoaded", (event) => {
    
    const linkToPaybackElement = document.getElementById('linkToPayback');
    
    if (linkToPaybackElement) {
      linkToPaybackElement.addEventListener('click', gotoPayback) ;
    }

  });


  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    let url = tabs[0].url;
    if(url.startsWith("https://www.payback.de/coupons")){


    const manualActivationElement = document.getElementById('manualActivation');
    const buttonTextActivationElement = document.getElementById('manualActivationText');
    const countElement = document.getElementById("couponCount");
    const pointElement = document.getElementById("pointsCount");
    const contentElement = document.getElementById("content");
    const errorElement =   document.getElementById("error");
    contentElement.style.display = 'block';
    errorElement.style.display = 'none';



      chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: getCouponCount
      }, (results) => {

          countElement.innerText = results[0].result;

      });


      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: getPointsCount
        }, (results) => {

          if(results[0].result != null && results[0].result){
            
            pointElement.innerText = "Available Payback Points: " + results[0].result;

          }
            

        });



      manualActivationElement.addEventListener('click', async () => {

        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: activatePaybackCoupons
        }).then((result) => { 

          if(result[0].result != null){

            buttonTextActivationElement.innerText = "Done! Activated " + result[0].result + " coupons.";
            manualActivationElement.disabled = true;
            manualActivationElement.style.backgroundColor = '#52ae32';

          }

        });
   
      });


    }

  });

}



main();