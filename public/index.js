let mainDiv = document.querySelector(".main")
let quote = document.querySelector(".text2")
let quoteImg = document.querySelector("#img")

gsap.registerPlugin(EaselPlugin) 

const socket = io('http://localhost:3000');

gsap.to(".main", { duration: 1, x:-2000, ease: "power2.in"});

socket.on('message', (data) => {
    let randomQuote = data["randomQuote"]
    let quoteImage = data["quoteImage"]
    let timeToWait = data["timeToWait"]


    gsap.to(".main", { duration: 1, x:0, ease: "power2.in"});
    quote.innerHTML = randomQuote
    quoteImg.src = quoteImage
    setTimeout(() => {
        gsap.to(".main", { duration: 1, x:-2000, ease: "power2.in"});
    }, timeToWait * 1000);
});

