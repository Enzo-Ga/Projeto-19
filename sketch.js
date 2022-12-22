// Criando as variáveis
var canvas;
var player, monster, ghost, background1, gameOver, reset, solo;
//Variáveis das imagens
var playerImg,
  background1Img,
  monsterImg,
  ghostImg,
  gameOverImg,
  resetImg,
  playerCollided;
//Variavel do grupo dos montros
var monsterGroup;
//Estado do jogo
var Play = 0;
var End = 1;
var gameState = Play;
//Contandor de pontos
var score = 0;

// Carregando as animações e as imagens
function preload() {
  playerImg = loadAnimation(
    "link-01.png",
    "link-02.png",
    "link-03.png",
    "link-04.png",
    "link-05.png",
    "link-06.png",
    "link-07.png",
    "link-08.png",
    "link-09.png",
    "link-10.png"
  );
  playerCollided = loadAnimation("link-morte.png");
  background1Img = loadImage("background.png");
  gameOverImg = loadImage("gameOver.png");
  resetImg = loadImage("reset.png");
  monsterImg = loadAnimation(
    "monster_01.png",
    "monster_02.png",
    "monster_03.png",
    "monster_04.png",
    "monster_05.png"
  );
  ghostImg = loadAnimation(
    "ghost01.png",
    "ghost02.png",
    "ghost03.png",
    "ghost04.png",
    "ghost05.png",
    "ghost06.png",
    "ghost07.png",
    "ghost08.png"
  );
}

function setup() {
  //Criando o canvas
  canvas = createCanvas(1250, 700);

  //Colocando a Imagem do solo
  background1 = createSprite(500, 500);
  background1.addImage(background1Img);
  background1.x = background1.width / 2;
  background1.scale = 4;
  //windowWidth / 2, -100

  //Movimentando o plano de fundo
  background1.velocityX = -6;

  //Criando o solo invisível
  solo = createSprite(windowWidth / 2, height - 40, windowWidth, 10);
  solo.visible = false;

  //Criando o texto de game over
  gameOver = createSprite(width / 2, height / 2);
  gameOver.addImage(gameOverImg);
  gameOver.visible = false;

  //Criando o botão de reset
  reset = createSprite(width / 2, height / 2 + 70);
  reset.addImage(resetImg);
  reset.scale = 0.15;
  reset.visible = false;

  //Chamando o objeto dos monstros
  monsterGroup = new Group();

  //criando o player
  player = createSprite(windowWidth / 5, windowHeight - 100, 50, 50);
  player.addAnimation("link", playerImg);
  player.addAnimation("morte", playerCollided);
  player.scale = 2;
  player.debug = false;
  player.setCollider("rectangle", 0, 0, 40, 50);
}

function draw() {
  //Criando o background
  background("black");

  //Verificando se o estado de jogo é Play
  if (gameState == Play) {
    if (background1.x <= 0) {
      background1.x = windowWidth / 2;
    }

    //Aumentando a velocidade conforme a os pontos
    background1.velocityX = -(6 + (3 * score) / 300);

    //Verificando se o player esta colidindo com o solo
    if (player.collide(solo)) {
      if (keyDown("SPACE")) {
        player.velocityY = -17;
      }
    }

    player.velocityY = player.velocityY + 0.65;

    //Chamando função de criar monstros
    spawnMonster();

    //Verificando se o player esta colindo com o monstro
    if (player.isTouching(monsterGroup)) {
      gameState = End;
    }

    //Calculando os pontos
    score = score + Math.round(frameRate() / 60);

    //Estado do game End
  } else if (gameState == End) {
    background1.velocityX = 0;
    player.velocityY = 0;
    player.changeAnimation("morte", playerCollided);

    monsterGroup.setVelocityXEach(0);
    monsterGroup.destroyEach();

    gameOver.visible = true;
    reset.visible = true;

    if (mousePressedOver(reset)) {
      restart();
    }
  }
  fill("white");
  drawSprites();
  //Colocando os pontos na tela
  textSize(30);
  text("Pontuação: " + score, width - 1100, height - 500);
}

function spawnMonster() {
  //Calculando quando o monstro vai spawnar
  if (frameCount % 100 == 0) {
    //Criando o sprite do monstro
    var monster = createSprite(width + 20, height - 100, 50, 50);
    monster.velocityX = -6;
    monster.lifetime = 300;
    monster.debug = false;
    //Escolher um monstro aleatório
    var num = Math.round(random(1, 2));
    switch (num) {
      case 1:
        monster.addAnimation("monster", monsterImg);
        monster.setCollider("rectangle", 0, 0, 70, 100);
        break;
      case 2:
        monster.addAnimation("ghost", ghostImg);
        monster.setCollider("rectangle", 0, 0, 80, 140);
        break;
      default:
        break;
    }
    monsterGroup.add(monster);
  }
}

function restart() {
  gameState = Play;

  player.changeAnimation("link", playerImg);

  monsterGroup.destroyEach();

  gameOver.visible = false;
  reset.visible = false;

  score = 0;
}
