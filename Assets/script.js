// question object
let questionArr = [
    {//q-1
        question: "What is RED + BLUE ?",
        choices: ["PURPLE", "GREEN", "ORANGE"],
        answer: "PURPLE"
    },
    {//q-2
        question: "What is RED +  YELLOW ?",
        choices: ["PURPLE", "GREEN", "ORANGE"],
        answer: "ORANGE"
    },
    {//q-3
        question: "What is BLUE +  YELLOW ?",
        choices: ["PURPLE", "GREEN", "ORANGE"],
        answer: "GREEN"
    },
    {//q-4
        question: "What is BLACK +  WHITE ?",
        choices: ["GREY", "BRONZE", "ORANGE"],
        answer: "GREY"
    },
    {//q-5
        question: "What is RED +  WHITE ?",
        choices: ["GREEN", "PINK", "ORANGE"],
        answer: "PINK"
    }
]

var startBtn = document.querySelector(".startBtn"); // grabbing the start button
var timeEl = document.querySelector("#timer");      // grabbing span tag by id and appending timer to it
var secondsLeft = 75;
var mainEl = document.querySelector(`main`);
var footerEl = document.querySelector("#footerEl");
var scoreBtn = document.querySelector(`.scoreBtn`);
var i = 0;

var userScore;

// creating buttons for options which can be appended in the end
var opt_a = document.createElement("button");
opt_a.id = "#opt-a";
var opt_b = document.createElement("button");
opt_b.id = "#opt-b";
var opt_c = document.createElement("button");
opt_c.id = "#opt-c";
var gameEl; // created global variable to create a section for questions and eventListener

// showing timer on the top right
var question = document.createElement(`p`);
timeEl.textContent = "Timer: " + secondsLeft ;

function setTime() {
    // Sets interval in variable
    var timerInterval = setInterval(function() {
      secondsLeft--;
      timeEl.textContent = "Timer: " + secondsLeft ;
  
      if(secondsLeft === 0) {
        // Stops execution of action at set interval
        clearInterval(timerInterval);
        // Calls function to create and append image
        sendMessage();
      }
    }, 1000);
  }

//function to diplay timeUp msg
function sendMessage(){
    mainEl.textContent = "Time is up game over.";
    gameEl.remove();
    displayScore();
}


function startGame(){
    userScore = 0;
    secondsLeft = 75;
    setTime();
    gameEl = document.createElement(`section`);
    displayQuestions();

    mainEl.append(gameEl); //gameEl section was created in displayQuestions()

    gameEl.addEventListener("click",function(event){
        event.preventDefault();
        if(event.target.textContent === questionArr[i].answer){ // if the answer is correct
            footerEl.textContent = "Correct Answer !";
            secondsLeft+=10;
            userScore+=10;  
        }else{ // if the answer is incorrect
            footerEl.textContent = "Wrong Answer !";
            secondsLeft-=5;
            userScore-=5;
        }
        
        if(i<questionArr.length-1){ //made a manual loop to avoid event bubbling
            i++;
        }else{
            if(secondsLeft>0){ //avoid getting negative score
            userScore *=secondsLeft;
            }
            displayScore();
            return;
        }
        displayQuestions();
    })
    // avoid user to quit the game in between
    startBtn.disabled = true;
    scoreBtn.disabled = true;
}

function displayQuestions(){
        question.textContent = questionArr[i].question;
        var optionArr = [opt_a,opt_b,opt_c];
        //for loop feeding options from JQuery object to option buttons
        for (let j = 0; j < questionArr[i].choices.length; j++) {
            optionArr[j].textContent =  questionArr[i].choices[j];
            //adding break elements to make it look clean
            var brEl = document.createElement("br");
            question.append(brEl); // adding break element for spacing 
            var brEl = document.createElement("br");
            question.append(brEl); // adding break element for spacing 
            question.append(optionArr[j]);
            gameEl.append(question);
        }
}

function displayScore(){
    gameEl.remove(); // gets rid of the questions
    footerEl.textContent="";

    var scoreMsg = document.createElement("p");
    scoreMsg.textContent = "Please enter your name : ";
    mainEl.append(scoreMsg);

    userName = document.createElement("input");
    userName.placeholder = "Your Name";
    scoreMsg.append(userName);

    var finishBtn = document.createElement(`button`);
    finishBtn.textContent = "Finish Game";
    mainEl.append(finishBtn);

    finishBtn.addEventListener("click",function(event){
        localStorage.setItem("userName",userName.value); // storing user info in local storage
        localStorage.setItem("score", userScore);
        userScore = 0;
        userName.value = "";
        finishBtn.remove();
        scoreMsg.remove();
        HighScoreDisplay();
    });
}

function HighScoreDisplay(){
    scoreBtn.disabled = true;

    var scoreDiv = document.createElement(`div`);
    var scoreHead = document.createElement("h2");
    scoreHead.textContent = "Scoreboard !";
    scoreDiv.append(scoreHead);

    var pEl = document.createElement(`p`);
    var playerName = localStorage.userName;
    var playerScore = localStorage.score;
    pEl.textContent = playerName + " : " + playerScore;
    scoreDiv.append(pEl);

    var backBtn = document.createElement(`button`);
    backBtn.textContent = "Go Back";
    scoreDiv.append(backBtn);

    
    var clearBtn = document.createElement(`button`);
    clearBtn.textContent = "Clear Score";
    scoreDiv.append(clearBtn);
    mainEl.append(scoreDiv);
    
    backBtn.addEventListener("click",function(e){
        scoreDiv.remove();
        i = 0; // resetting the loop
        startGame();
    });

    clearBtn.addEventListener("click", function(e){
        localStorage.clear();
        pEl.remove();
    });
}

startBtn.addEventListener("click", startGame);

if(localStorage.userName !== undefined){// make sure local storage is not empty
    scoreBtn.addEventListener("click", HighScoreDisplay);
}