try {
/* ------------------------------------------------------ */
/*                      Settings                          */
/* ------------------------------------------------------ */

yourFeeSchedule = 5.00;

timeZoneFormat = "de";
stickyItemChangeNotifications = false;

/* ------------------------------------------------------ */

url = window.location.href;

  if(url.match("bitskins.com")){
   
    /* Global Functions */
      
    function displayPrice(input){
      return parseFloat(Math.round(input * 100) / 100).toFixed(2);
    }
    
    function priceToNumber(input){
      if(typeof input == "number")
        return input;
      else if(input != undefined){
        input = input.replace(/\$|\,/gi,"");
        return parseFloat(Math.round(input * 100) / 100);
      }
    }
    
    function checkNumber(input){
            
      if(typeof input != "number")
        alert("Safety check: Data type mismatch detected! -> " + typeof input);
    }
    
    document.addEventListener('DOMContentLoaded', function(){
      if(!Notification){
        alert('Desktop notifications not available in your browser. Try Chromium.'); 
        return;
      }

      if (Notification.permission !== "granted"){
        Notification.requestPermission();
        console.log("N: requestPermission");  
      }
    });
    function notifyMe(title,message,requireInteraction) {      
      if (Notification.permission !== "granted") {
        Notification.requestPermission();
        console.log("N: requestPermission (B)");  
      }
      else {
        var notification = new Notification(title, {
          icon: "/img/favicon-64x64.png",
          body: message,
          requireInteraction: requireInteraction
        });
        /*
        notification.onclick = function () {
          //window.open("https://bitskins.com/wallet"); 
          notification.close();
        };
        */
      }
    }
   
    function timezoneAll(inputDate){
      return new Date(inputDate).toLocaleString(timeZoneFormat, { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
    }
    
    function timezoneDate(inputDate){
      return new Date(inputDate).toLocaleDateString(timeZoneFormat, { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
    }
    
    function timezoneTime(inputDate){
      return new Date(inputDate).toLocaleTimeString(timeZoneFormat, { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
    }
    
    function timezoneTimeShort(inputDate){
      return new Date(inputDate).toLocaleTimeString(timeZoneFormat, { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, hour: '2-digit', minute:'2-digit' });
    }
    
    /* Checking Balance - Every Page */
    
    balance = $("li#account_balance a").text();
    balance = balance.substring(balance.indexOf("$")+1)
    balance = priceToNumber(balance);
    
    checkNumber(balance);
    
    if(balance > 0){
      if(localStorage.getItem("b") == null){
        localStorage.setItem("b", balance);
      }
      else if(localStorage.getItem("b") != balance){
        
        balanceDiff = balance-localStorage.getItem("b");
        
        if(balanceDiff > 0) diff = "+";
        else diff = "-";
        
        title = diff+" $"+Math.abs(displayPrice(balanceDiff))+"";
        message = "New balance: $"+displayPrice(balance);
        
        notifyMe(title,"",false)
        localStorage.setItem("b", balance);
      }
    }

    /* Pending Inventory Checksum - Every Page */
    
    numberOfItems = $("li#pendingWithdrawalCountNav a span.pendingWithdrawalCount").text();
    numberOfItems = parseFloat(numberOfItems);
    
    checkNumber(numberOfItems);
        
    if(numberOfItems > 0){
      
      if(localStorage.getItem("w") > numberOfItems){
        
        numberOfItemsDiff = numberOfItems-localStorage.getItem("w");
        
        pendigsLog = 
        "==================================================" + "\n" +
        "Cached: \t\t"     + localStorage.getItem("w")         + "\n" +
        "Current: \t\t"    + numberOfItems                     + "\n\n" + 
        
        "Cached: \t\t"     + localStorage.getItem("wDate")     + "\n" +
        "Loaded: \t\t"     + timezoneAll(Date.now())           + "\n\n" + 
        
        "Difference:\t\t" + numberOfItemsDiff + " since " + localStorage.getItem("wTime") +
        " [" + localStorage.getItem("w") + " → " + numberOfItems + "]" + "\n" + 
        "==================================================";
        
        console.log(pendigsLog);
        
        title = "" + numberOfItemsDiff + "   since " + localStorage.getItem("wTime") +
                "   [" + localStorage.getItem("w") + " → " + numberOfItems + "]";
        
        message = "";

        notifyMe(title,message,stickyItemChangeNotifications);     
        
      }
      
      if(localStorage.getItem("w") != numberOfItems){
        localStorage.setItem("w", numberOfItems);
        localStorage.setItem("wDate", timezoneAll(Date.now()));
        localStorage.setItem("wTime", timezoneTimeShort(Date.now()));
      }
      
    }

      /* Item List */

      /* Inventory Checksum */
      
      if(url.match("/inventory")){
  
        inventoryString = $("body > div:nth-child(14) > div > h2 > small").text();
        index0 = inventoryString.indexOf("listed")+7;          
        index1 = inventoryString.indexOf("items")-1;
        index3 = inventoryString.indexOf("$")+1;
        index4 = inventoryString.length-1;

        inventoryItems = inventoryString.substring(index0,index1);
        inventoryValue = inventoryString.substring(index3, index4);
        inventoryTime = timezoneTimeShort(Date.now());
        inventoryDate = timezoneAll(Date.now());

        inventoryItems = priceToNumber(inventoryItems);
        inventoryValue = priceToNumber(inventoryValue);      
        
        checkNumber(inventoryItems);
        checkNumber(inventoryValue);        
        
        currentLog =
        "==================================================" + "\n" +
        "Items: \t\t\t\t" + inventoryItems + "\n" + 
        "Listed at: \t\t\t$" + displayPrice(inventoryValue) + "\n" + 
        "Loaded at: \t\t\t" + inventoryDate + "\n" + 
        "==================================================";
        
        console.log(currentLog);
        
        if(localStorage.getItem("inventoryItems") != inventoryItems){
          
          INVdiffItems = inventoryItems-localStorage.getItem("inventoryItems");
          INVdiffValue = inventoryValue-localStorage.getItem("inventoryValue");
          INVdiffBalance = (balance-localStorage.getItem("inventoryBalance"))*(100/(100-yourFeeSchedule));

          if(INVdiffItems > 0) INVdiffItems = "+" + INVdiffItems;
          if(INVdiffValue > 0) INVdiffValue = "+" + displayPrice(INVdiffValue);
          else INVdiffValue = displayPrice(INVdiffValue);
          if(INVdiffBalance > 0) INVdiffBalance = "+" + displayPrice(INVdiffBalance);
          else INVdiffBalance = displayPrice(INVdiffBalance)
          
          cachedLog =
          "==================================================" + "\n" +
          "CACHED Items: \t\t" + localStorage.getItem("inventoryItems") + "\n" + 
          "CACHED Listed at: \t$" + displayPrice(localStorage.getItem("inventoryValue")) + "\n" + 
          "CACHED Cached at: \t" + localStorage.getItem("inventoryDate") + "\n\n" + 
          "Difference: \t\t" + INVdiffItems + " [∆$v " + INVdiffValue + " | ∆$b " + INVdiffBalance + "]" + "\n" +
          "==================================================";
          
          console.log(cachedLog);

          INVtitle = INVdiffItems + "   since " + localStorage.getItem("inventoryTime") +
                     "   [∆$v " + INVdiffValue + " | ∆$b " + INVdiffBalance + "]"

          INVmessage = "";
                    
          notifyMe(INVtitle,INVmessage,stickyItemChangeNotifications);
          
        }
        
        if(localStorage.getItem("inventoryItems") != inventoryItems
        || localStorage.getItem("inventoryDate") != inventoryDate){
   
          localStorage.setItem("inventoryItems", inventoryItems);
          localStorage.setItem("inventoryValue", inventoryValue);
          localStorage.setItem("inventoryTime", inventoryTime);
          localStorage.setItem("inventoryDate", inventoryDate);
          localStorage.setItem("inventoryBalance", balance);

        }

      }
    
    }
  }
catch(err) {
  alert("Sorry fellas, something broke in the extension.");
}
