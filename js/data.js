//-------------------------------------TOWERS-----------------------------------
var towers =
{
  $tower1:
  {
    name: 'Machine Gun',
    hTml: $('#1'),
    value: 50,
    range: 5,
    class: 'tower1',
    speed: 100,
    dmg: 10
  },
  $tower2:
  {
    name: 'Sniper',
    hTml: $('#2'),
    value: 100,
    range: 10,
    class: 'tower2',
    speed: 1000,
    dmg: 10
  },
  $tower3:
  {
    name: '50 Cal',
    hTml: $('#3'),
    value: 150,
    range: 5,
    class: 'tower3',
    speed: 1000,
    dmg: 10
  }
};
  //----------------------Map blueprint & Controls------------------------------
var gameBoard =[
  [0,0,1,1,1,1,1,1,1,2],
  [0,0,1,0,0,0,0,0,0,0],
  [0,1,1,0,1,1,1,0,0,0],
  [0,1,0,0,1,0,1,1,1,0],
  [0,1,1,1,1,0,0,0,1,0],
  [0,0,0,0,0,0,1,1,1,0],
  [0,1,1,1,1,1,1,0,0,0],
  [0,1,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,0],
  [0,0,0,0,0,0,0,0,3,0]
];
//---------------------------------Minnions-------------------------------------
var minions = [{
  name: 'Minions',
  nextCell: [],
  pathHistory: [],
  MaxHealth: 50,
  speed: 500,
  class: 'mobs',
  id: 'mobA'
}];
