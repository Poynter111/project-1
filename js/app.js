$(function(){

  //---------------------------Global Variables---------------------------------
  var $mapWrap = $('.map-wrap');
  var $controls = $('.controls');
  let $bullet = $('<div class=bullet/>');
  let $mob = $('<div class="mobs"/>');
  const cellClasses = ['grass', 'path', 'entrance', 'exit'];
  const DEV = false;
  let width = 35;
  let health = minions[0].MaxHealth;
  const $audio = new Audio('./audio/gun.mp3');
  const $audio2 = new Audio('./audio/music.wav');
  var $modal = $('#myModal');
  var $span = $('.close');
  //------------------------Game Over and Restart-------------------------------
  function restart(){
    window.location.reload();
    console.log('restart');
  }
  function closeModal() {
    $modal.css({
      display: 'none'
    });
    restart();
  }
  $span.on('click', function(){
    closeModal();
  })
  //---------------------------Map Generation-----------------------------------
  function mapBuilder(){
    $.each(gameBoard, function(i, line){
      $.each(line, (j, cell) => buildCell(cell, i, j));
    });
  }
  function buildCell(cell, i, j){
    var $elem = $(`<div class="basetile cell_${i}_${j} " data-i='${i}' data-j='${j}'/>`);
    $mapWrap.append($elem.addClass(cellClasses[cell]));
  }
  //------------------------Tower managment and construction--------------------
  $controls.on('click', 'button', function(){
    var btnClicked = $(this).html();
    $(this).text(btnClicked);
    $.each(gameBoard, function(i, line){
      $.each(line, (j, cell) => {
        if (cell === 0){
          $(`.cell_${i}_${j}`).addClass('availableTile');
        }if (btnClicked === 'Reset'){
          findEntrance();
        }
      });
    });
    event(btnClicked);
  });
  //-Listens for turrets clicked on and declares which tiles can be places on---
  function event(btnClicked){
    $mapWrap.children('.availableTile').on('click', function(event){
      for(key in towers){
        if (towers[key].name === btnClicked){
          var selectedT  = towers[key].class;
          $(this).addClass(selectedT).append('<div class="fire-range" />');
          $mapWrap.children('.availableTile').off('click');
          $mapWrap.children().removeClass('availableTile');
          const turrentLocationTop = $(this).offset().top + 25;
          const turrentLocationLeft = $(this).offset().left + 25;
          shoot(turrentLocationTop, turrentLocationLeft);
        }
      }
    });
  }
  //------Checks the cells around the minion to decide where to go next --------
  function nextCell(minion){
    const x = minion.nextCell[0];
    const y = minion.nextCell[1];
    const oldPosX = (minion.pathHistory[minion.pathHistory.length-2] || [])[0];
    const oldPosY = (minion.pathHistory[minion.pathHistory.length-2] || [])[1];
    const newLeftCell = gameBoard[x][y-1];
    const newRightCell = gameBoard[x][y+1];
    const newTopCell = (gameBoard[x - 1] || [])[y];
    const newBottomCell = gameBoard[x + 1][y];
    if(newLeftCell === 1 && y-1 !== oldPosY){ // left
      return [x, y-1];
    } else if(newRightCell === 1 && y+1 !== oldPosY){ // right
      return [x, y+1];
    } else if(newTopCell === 1 && x - 1 !== oldPosX ){ // top
      return [x - 1, y];
    } else if(newBottomCell === 1 && x + 1 !== oldPosX ){ // bottom
      return [x+ 1, y];
    }
  }
  //------------------Mininon needs to find where to start----------------------
  function findEntrance(){
    let entrance = []
    $.each(gameBoard, function(i, line){
      $.each(line, (j, cell) => {
        if (cell === 2){
          entrance = [i,j];
        }
      });
    });
    return entrance;
  }
  //------------------------This code spawns the minion-------------------------
  let spawnINT = null;

  var minionSpawm = {
    spawm: function(){
      spawnINT = setInterval( function(){
        $.each(minions, function(i, minion){
          if(minion.nextCell.length === 0){
            minion.nextCell  = findEntrance();
          }else{
            minion.nextCell = nextCell(minion);
            if (minion.nextCell === undefined){
              // minion.nextCell  = findEntrance();
              displayModalN();
              clearInterval(spawnINT);
              clearInterval(shootingINT);
            }
          }
          const prevCell = minion.pathHistory[minion.pathHistory.length-1];
          if(prevCell){
            $(`.cell_${prevCell[0]}_${prevCell[1]}`).empty();
          }
          $cell = $(`.cell_${minion.nextCell[0]}_${minion.nextCell[1]}`);
          $mob = $('<div class="mobs"/>');
          $mob.append('<div class="life-bar">');
          $mob.append(`<div class="health-bar" style=width:${width}px>`);
          $cell.append($mob);
          minion.pathHistory.push(minion.nextCell);
          minions[i] = minion;
        });
      }, minions[0].speed); //MINION SPEED
    }
  };

  //------------------------------Bullet manegment -----------------------------
  let shootingINT = null;
  function shoot(top, left){
    shootingINT = setInterval(function(){
      $audio.play();
      $bullet.css({
        left: left ,
        top: top
      });
      $bullet.appendTo($('.map-wrap')).animate({
        left: $mob.offset().left + 20,
        top: $mob.offset().top + 10
      },{
        complete: function(){
          $bullet.stop().remove();
        }
      });
    }, towers.$tower1.speed);
  }
  //------------------------Collision detection---------------------------------
  setInterval(collisions,10);//checking location of Mob and Bullets every 0.01s

  function boundaries(element){ // return element boundaries [top, right, bottom, left]
    const offset = element.offset();
    return [offset.top, offset.left+element.width(),offset.top+ element.height(), offset.left];
  }
  function collisions(){
    [ot, or, ob, ol] = boundaries($mob);
    [lt, lr, lb, ll] = boundaries($bullet);

    if ((lr > ol && lr < or && lt > ot && lb < ob) ||
        (ll > or && ll < ol && lt > ot && lb < ob) ){
      $bullet.stop().remove();
      console.log('BOOM');
      minionHit();
      healthBar(health);
    }
  }
  //--------------------On collision this code is executed----------------------
  function minionHit(){
    let damage = towers.$tower1.dmg;
    health -= damage;
    minions[0].MaxHealth = health;
    if(health <= 0){ // Minion KILLED
      clearInterval(spawnINT);
      $mob.remove();
      clearInterval(shootingINT);
      displayModalW();
    }
  }
  function displayModalW() {
    $('#msg').append('You win.');
    $modal.css({
      display: 'block'
    });
  }
  function displayModalN() {
    $('#msg').append('You Lose.');
    $modal.css({
      display: 'block'
    });
  }
  //------------------------Health Bar-------------------------------------------
  function healthBar(health){
    if (health <= 41){
      width = 28;
    }if (health <= 31){
      width = 21;
    }if (health <= 21){
      width = 14;
    }if (health <= 11){
      width = 7;
    }if (health <= 0){
      width = 0;
    }
  }
  //------------------------Build Map-------------------------------------------
  function setup(){
    for(key in towers){
      $(`<button class='cntrBtn'>${towers[key].name}</button>`).appendTo('.controls');
    }
    mapBuilder();
  }
  setup();
  minionSpawm.spawm();
  $audio2.play();
});
