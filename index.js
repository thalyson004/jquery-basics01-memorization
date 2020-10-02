var level = 0;
var messages = ['Remember this path.', 'Your turn.', 'Press any key to play again...'];
var classes = ['.item00', '.item01', '.item10', '.item11'];
var sounds = ['cat', 'dog', 'rooster', 'sheep'];
var path = [];
var userPath = [];

const sleep = (delay) => new Promise((resolve)=>setTimeout(resolve,delay));

function playSound(name){
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

function disableButtons(){
  for(let i = 0; i < classes.length; i++){
    $(classes[i]).prop('disabled', true);
    $(classes[i]).off();
  }
}

function enableButtons(){
  for(let i = 0; i < classes.length; i++){
    $(classes[i]).on('click', function (){
        userPath.push( i );
        playSound(sounds[i]);

        let ans = checkAns();
        if(ans==1) nextLevel();
        else if(ans==-1) endGame();
    });

    $(classes[i]).prop('disabled', false);
  }
}

function addNext(){
  let next = Math.floor(Math.random()*4);
  path.push(next);
}

function changeMesage(message){
  $('.message').text(message);
}

async function showPath(){
  await $('.message').text(messages[0]);
  await sleep(2000);

  for(let i = 0; i < path.length; i++){
    let myClass = classes[ path[i] ];
    $(myClass).fadeOut(500).fadeIn(500);
    playSound(sounds[path[i]]);
    await sleep(1000);
  }
  return 0;
}

function checkAns(){
  let len = userPath.length;
  if( path[len-1]!= userPath[len-1] ) return -1; // lose
  else if( path.length==len ) return 1;          // Win
  else return 0;                                 // Hit
}

function nextLevel(){
  level++;
  for(let i = 0; i < classes.length; i++){
    $(classes[i]).off();
    $(classes[i]).prop('disabled', false);
  }
  initTurn();
}

async function endGame(){
  playSound('wrong');
  disableButtons();

  changeMesage('Press any key to play again...');
  await sleep(1000);
  $(document).on('keypress click',  playGame);
}

async function initTurn(){
  disableButtons();
  addNext();
  $('.level').text("Level "+level.toString(10));

  await showPath();

  await sleep(1000);
  changeMesage('Your turn.');
  userPath = [];
  enableButtons();
}

function playGame(){
  $(document).off();

  level = 1;
  path = [];
  changeMesage('Remember this path.');

  $('.message').animate( {padding: '1% auto 1%'} );
  $('.game').css('visibility', 'visible');
  $('.game').animate({opacity:'1.0'});

  initTurn();
}
$(document).on('keypress click',  playGame);
