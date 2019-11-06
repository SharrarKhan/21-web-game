let currentAmount = 0;
let maxAmount = 21;
let opponentCardsAmount = 0;
let deckID;
document.addEventListener("DOMContentLoaded", async () => {
    let startGameButton = document.querySelector("#startGameButton");
    let wonOrLostPTag = document.querySelector("#wonOrLostPTag");
    let leftDiv = document.querySelector("#leftDiv");
    let rightDiv = document.querySelector("#rightDiv");
    let bottomDiv = document.querySelector("#bottomDiv");
    let hitButton = document.querySelector("#hitButton");
    let stayButton = document.querySelector("#stayButton");
    let points1 = document.querySelector("#points1");
    let points2 = document.querySelector("#points2");

    let shuffleCards = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";
    let drawCard;
    let hit;
    let opponentCards;
    startGameButton.addEventListener("click", async () => {
        bodyDiv.removeChild(startButtonDiv);
        hitButton.disabled = false;
        stayButton.disabled = false;
        await shuffle(shuffleCards);
        drawCard = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=2`;
        hit = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`;
        opponentCards = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=3`;
        await draw(drawCard); 
    });
    hitButton.addEventListener("click", async () => {
        await hitFunction(hit);
    });
    stayButton.addEventListener("click", async () => {
        await stayFunction(opponentCards);
    })
})

const shuffle = async (url) => {
    console.log("shuffle started");
    let response = await axios.get(url)
    .catch(error => {
        console.log("error:", error)
    })
    deckID = response.data.deck_id;
    console.log("deckID:", deckID);
    console.log("response.data:", response.data);
}

const draw = async (url) => {
    console.log("draw started");
    let response = await axios.get(url)
    .catch(error => {
        console.log("error:", error);
    })
    console.log("response.data.cards:", response.data.cards);

    let leftDiv = document.querySelector("#leftDiv");
    let newimg1 = document.createElement("img");
    newimg1.src = response.data.cards[0].image;

    let newimg2 = document.createElement("img");
    newimg2.src = response.data.cards[1].image;

    //if both are aces
    if(response.data.cards[0].value === "ACE" && response.data.cards[1].value === "ACE") {
        currentAmount += 2;
        leftDiv.appendChild(newimg1)
        leftDiv.appendChild(newimg2);
        console.log("currentAmount:", currentAmount);
        points1.innerText = currentAmount;
    
    //if first is an ace
    } else if(response.data.cards[0].value === "ACE" && parseInt(response.data.cards[1].value)) {
        currentAmount += 1;
        currentAmount += Number(response.data.cards[1].value);
        leftDiv.appendChild(newimg1)
        leftDiv.appendChild(newimg2);
        console.log("currentAmount:", currentAmount);
        points1.innerText = currentAmount;

    //if second in an ace    
    } else if(response.data.cards[1].value === "ACE" && parseInt(response.data.cards[0].value)) {
        currentAmount += 1;
        currentAmount += Number(response.data.cards[0].value);
        leftDiv.appendChild(newimg1)
        leftDiv.appendChild(newimg2);
        console.log("currentAmount:", currentAmount);
        points1.innerText = currentAmount;
    
    //if both are numbers
    } else if( (parseInt(response.data.cards[0].value)) && (parseInt(response.data.cards[1].value)) ) {
        currentAmount += Number(response.data.cards[0].value);
        leftDiv.appendChild(newimg1)
        currentAmount += Number(response.data.cards[1].value);
        leftDiv.appendChild(newimg2);
        console.log("currentAmount:", currentAmount);
        points1.innerText = currentAmount;

    //if both are not numbers    
    } else if(!(parseInt(response.data.cards[0].value)) && !(parseInt(response.data.cards[1].value))) {
        currentAmount += 20;
        leftDiv.appendChild(newimg1)
        leftDiv.appendChild(newimg2);
        console.log("currentAmount:", currentAmount);
        points1.innerText = currentAmount;
        
    //if first is not a number    
    } else if (!(parseInt(response.data.cards[0].value)) && parseInt(response.data.cards[1].value)) {
        currentAmount += 10;
        currentAmount += parseInt(response.data.cards[1].value);
        leftDiv.appendChild(newimg1)
        leftDiv.appendChild(newimg2);
        console.log("currentAmount:", currentAmount);
        points1.innerText = currentAmount;
       
    //if second is not a number     
    } else if (!(parseInt(response.data.cards[1].value)) && parseInt(response.data.cards[0].value)) {
        currentAmount += 10;
        currentAmount += parseInt(response.data.cards[0].value);
        leftDiv.appendChild(newimg1)
        leftDiv.appendChild(newimg2);
        console.log("currentAmount:", currentAmount);
        points1.innerText = currentAmount;

    //else (IDK)
    } else {
        currentAmount += Number(response.data.cards[0].value)
        currentAmount += Number(response.data.cards[1].value);
        leftDiv.appendChild(newimg1)
        leftDiv.appendChild(newimg2);
        console.log("currentAmount:", currentAmount);
        points1.innerText = currentAmount;
    }
}

const hitFunction = async (url) => {
    console.log("hitFunction started");
    let response = await axios.get(url)
    .catch(error => {
        console.log("error:", error);
    })
    console.log("response:", response.data);
    let newElement = document.createElement("img");
    newElement.src = response.data.cards[0].image;
    leftDiv.appendChild(newElement);
    if(response.data.cards[0].value === "ACE") { //if ace
        currentAmount += 1;
        points1.innerText = currentAmount;
    } else if(!(parseInt(response.data.cards[0].value))) { //if k, q, or j
        currentAmount += 10;
        points1.innerText = currentAmount;
    } else { //if number
        currentAmount += parseInt(response.data.cards[0].value);
        points1.innerText = currentAmount;
    }
    console.log("currentAmount:", currentAmount);
    if(currentAmount > 21) {
        wonOrLostPTag.innerHTML = "<h1><strong>BUSTED! You lose</strong></h1>";
        points1.innerText = currentAmount;
        bottomDiv.removeChild(hitButton);
        bottomDiv.removeChild(stayButton);
    }
}

const stayFunction = async (url) => {
    console.log("stayFunction started");
    let response = await axios.get(url)
    .catch(error => {
        console.log("error:", error);
    })
    console.log("response.data:", response.data.cards);

    let img1 = document.createElement("img");
    let img2 = document.createElement("img");
    let img3 = document.createElement("img");
    img1.src = response.data.cards[0].image;
    img2.src = response.data.cards[1].image;
    img3.src = response.data.cards[2].image;

    //CODE FOR THE FIRST TWO CARDS
    if(response.data.cards[0].value === "ACE" && response.data.cards[1].value === "ACE") {
        opponentCardsAmount += 2;
        rightDiv.appendChild(img1)
        rightDiv.appendChild(img2);
        console.log("opponentCardsAmount:", opponentCardsAmount);
        points2.innerText = opponentCardsAmount
    
    //if first is an ace
    } else if(response.data.cards[0].value === "ACE" && parseInt(response.data.cards[1].value)) {
        opponentCardsAmount += 1;
        opponentCardsAmount += Number(response.data.cards[1].value);
        rightDiv.appendChild(img1)
        rightDiv.appendChild(img2);
        console.log("opponentCardsAmount:", opponentCardsAmount);
        points2.innerText = opponentCardsAmount

    //if second in an ace    
    } else if(response.data.cards[1].value === "ACE" && parseInt(response.data.cards[0].value)) {
        opponentCardsAmount += 1;
        opponentCardsAmount += Number(response.data.cards[0].value);
        rightDiv.appendChild(img1)
        rightDiv.appendChild(img2);
        console.log("opponentCardsAmount:", opponentCardsAmount);
        points2.innerText = opponentCardsAmount
    
    //if both are numbers
    } else if( (parseInt(response.data.cards[0].value)) && (parseInt(response.data.cards[1].value)) ) {
        opponentCardsAmount += Number(response.data.cards[0].value);
        rightDiv.appendChild(img1)
        opponentCardsAmount += Number(response.data.cards[1].value);
        rightDiv.appendChild(img2);
        console.log("opponentCardsAmount:", opponentCardsAmount);
        points2.innerText = opponentCardsAmount

    //if both are not numbers    
    } else if(!(parseInt(response.data.cards[0].value)) && !(parseInt(response.data.cards[1].value))) {
        opponentCardsAmount += 20;
        rightDiv.appendChild(img1)
        rightDiv.appendChild(img2);
        console.log("opponentCardsAmount:", opponentCardsAmount);
        points2.innerText = opponentCardsAmount
        
    //if first is not a number    
    } else if (!(parseInt(response.data.cards[0].value)) && parseInt(response.data.cards[1].value)) {
        opponentCardsAmount += 10;
        opponentCardsAmount += parseInt(response.data.cards[1].value);
        rightDiv.appendChild(img1)
        rightDiv.appendChild(img2);
        console.log("opponentCardsAmount:", opponentCardsAmount);
        points2.innerText = opponentCardsAmount
       
    //if second is not a number     
    } else if (!(parseInt(response.data.cards[1].value)) && parseInt(response.data.cards[0].value)) {
        opponentCardsAmount += 10;
        opponentCardsAmount += parseInt(response.data.cards[0].value);
        rightDiv.appendChild(img1)
        rightDiv.appendChild(img2);
        console.log("opponentCardsAmount:", opponentCardsAmount);
        points2.innerText = opponentCardsAmount

    //else (IDK)
    } else {
        opponentCardsAmount += Number(response.data.cards[0].value)
        opponentCardsAmount += Number(response.data.cards[1].value);
        rightDiv.appendChild(img1)
        rightDiv.appendChild(img2);
        console.log("opponentCardsAmount:", opponentCardsAmount);
        points2.innerText = opponentCardsAmount;
    }

    //CODE FOR THE THIRD CARD
    if(response.data.cards[2].value === "ACE") {
        opponentCardsAmount += 1;
        rightDiv.appendChild(img3);
        points2.innerText = opponentCardsAmount
    } else if(!parseInt(response.data.cards[2].value)) {
        opponentCardsAmount += 10;
        rightDiv.appendChild(img3);
        points2.innerText = opponentCardsAmount
    } else {
        opponentCardsAmount += parseInt(response.data.cards[2].value);
        rightDiv.appendChild(img3);
        points2.innerText = opponentCardsAmount;
    }
    if(currentAmount > 21 && opponentCardsAmount > 21) {
        wonOrLostPTag.innerHTML = "<h1><strong>Tie game. Neither player won</strong></h1>";
        bottomDiv.removeChild(hitButton);
        bottomDiv.removeChild(stayButton);
    } else if(currentAmount > 21) {
        wonOrLostPTag.innerHTML = "<h1><strong>You lost</strong></h1>";
        bottomDiv.removeChild(hitButton);
        bottomDiv.removeChild(stayButton);
    } else if(opponentCardsAmount > 21) {
        wonOrLostPTag.innerHTML = "<h1><strong>You won!</strong></h1>";
        bottomDiv.removeChild(hitButton);
        bottomDiv.removeChild(stayButton);
    } else if(currentAmount > opponentCardsAmount) {
        wonOrLostPTag.innerHTML = "<h1><strong>You win!</strong></h1>";
        bottomDiv.removeChild(hitButton);
        bottomDiv.removeChild(stayButton);
    } else if(currentAmount < opponentCardsAmount) {
        wonOrLostPTag.innerHTML = "<h1><strong>You lose</strong></h1>";
        bottomDiv.removeChild(hitButton);
        bottomDiv.removeChild(stayButton);
    } else if(currentAmount === opponentCardsAmount) {
        wonOrLostPTag.innerHTML = "<h1><strong>Tie game. Neither player won</strong></h1>";
        bottomDiv.removeChild(hitButton);
        bottomDiv.removeChild(stayButton);
    }
}