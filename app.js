
// defining variables for setting the sell and buy price and time
let buyPrice = [];
let sellPrice = [];

let buyCrypto = document.getElementById('buy-crypto-price');
let sellCrypto = document.getElementById('sell-crypto-price');
let time = document.getElementById('time')


let wSocket = new WebSocket('wss://ws-feed.pro.coinbase.com');

//   if handshake is open then making the request 
const requestSend = (query) => {
    buyPrice = [];
    sellPrice = [];
    wSocket.send(JSON.stringify({
        type:"subscribe",
        product_ids:[query],
        channels:["full"]
    }))
}

// fire function for select tag option for BTC-USD and LTC-USD
const fire = () => {
    let query =  document.querySelector("#inp").value
   
    requestSend(query)
  }

wSocket.onopen = function () {
    requestSend()
}

wSocket.onmessage = (event) => {

    // getting the data in json object form and converting it in js object to access the information
    event = JSON.parse(event.data)
    
    time.innerText = event.time.replace("T" , " ").replace("."," ").split(" ").slice(0,2).join(" ")

    // checking conditions with type of "side" ("buy" or "sell")
    if(event.side == "buy") buyPrice.push(+event.price);
    
    if(event.side == "sell") sellPrice.push(+event.price);

    childrenFun()
    
}

// throttle function to get the data after 5 seconds
const throttle = () => {
    let current = Date.now()

    return () => {
        // checking for every 5 seconds delay 
        if(Date.now() - current >= 5000) {

            // sending the buy and sell price data and rendering on UI 

            buyCrypto.innerText = parseFloat(buyPrice[0] && (buyPrice.reduce((ac, av) => ac + av,0)) / buyPrice.length).toFixed(2);

            sellCrypto.innerText = parseFloat(sellPrice[0] && (sellPrice.reduce((ac, av) => ac + av,0)) / sellPrice.length).toFixed(2)

            
            // clearing both buy and sell price data to store again after 5  sec 
            buyPrice = [];
            sellPrice = [];
            current = Date.now();
        }
    }
}

const childrenFun = throttle()


