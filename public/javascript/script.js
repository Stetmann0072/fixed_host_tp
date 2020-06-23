console.log("Script-3 запущен без ошибок.");

class Ship{
  constructor(startCoord, orientation, size){
    this.startCoord = startCoord;
    this.orientation = orientation;
    this.size = size;
    this.hit = 0;
  }
  setRandomShip(size) {
    this.startCoord = [0,0];
    this.startCoord[0] = Math.floor(Math.random() * (10));
    this.startCoord[1] = Math.floor(Math.random() * (10));

    var orient = Math.floor(Math.random() * (10));
    if (orient > 5)
      this.orientation = [1,0];
    else
      this.orientation = [0,1];

    this.size = size;
  }
  checkCoord(coord){
    var x = this.startCoord[0];
    var y = this.startCoord[1];
   
    if (coord[0] == x && coord[1] == y){
      this.hit++;
      return true;
    }
    for (let i = 2; i <= this.size; i++){
      x += this.orientation[0];
      y += this.orientation[1];
      
      if (coord[0] == x && coord[1] == y){
        this.hit++;
        return true;
      }
    }
    return false;
  }
  get kill(){
    if (this.hit == this.size){
      return true;
    }
    else{
      return false;
    }
  }
}

class HandlerPlacement {
  constructor(shipsPlr, map, method) {
    const randInp = document.getElementById('randomInput');
    const size1 = document.getElementById('shipSize1');
    const size2 = document.getElementById('shipSize2');
    const size3 = document.getElementById('shipSize3');
    const size4 = document.getElementById('shipSize4');
    const restartPlacement = document.getElementById("restartPlacement");

    const value1 = document.getElementById('placement_1size_value');
    const value2 = document.getElementById('placement_2size_value');
    const value3 = document.getElementById('placement_3size_value');
    const value4 = document.getElementById('placement_4size_value');
    
    this.backBtnSize = [];
    this.backBtnSize[0] = document.getElementById('btnshipSize1');
    this.backBtnSize[1] = document.getElementById('btnshipSize2');
    this.backBtnSize[2] = document.getElementById('btnshipSize3');
    this.backBtnSize[3] = document.getElementById('btnshipSize4');
    console.log(this.backBtnSize);

    this.valueShip = [value1,value2,value3,value4];
    this.ships1 = shipsPlr;
    this.ships = [];
    var ship = [];
    this.sizeBtn = [size1, size2, size3, size4];

    this.orientation = [0,1];
    this.setShipSize(3);
    
    this.map = map;

    var plr = this;
   
    if(method == "manual"){ 
      this.map.map.addEventListener("dblclick", this);
      this.map.map.addEventListener("mouseover",this);
      this.map.map.addEventListener("mouseout", this);
      this.map.map.addEventListener("click", this);
     
      randInp.addEventListener("click", this);
      restartPlacement.addEventListener("click", this);
      
      size4.onclick = function(){
        plr.setShipSize(3);
      }
      size3.onclick = function(){
       
        plr.setShipSize(2);
      }
      size2.onclick = function(){
        
        plr.setShipSize(1);
      }
      size1.onclick = function(){
       
        plr.setShipSize(0);
      }
    }
    else{
      this.randomInsert();
    }

    for(let size = 1; size <= 4; size++){
      for (let value = 1; value <= 5 - size; value++){
      ship.push(new Ship([],[],size));
      }
      this.ships.push(ship);
      ship = [];
      this.sizeBtn[size-1].classList = '';
    }
  }
  handleEvent(event) {
    const randInp = document.getElementById('randomInput');
    const restartPlacement = document.getElementById("restartPlacement");

    switch(event.target.tagName){
      case "BUTTON":
        switch(event.target){
          case randInp:
            this.randomInsert();
            break;
          case restartPlacement:
            this.clear();
            break;
          default:
            break;
        }
        break;
      case "TD":
        let coord = event.target.id;
        this.x = Math.floor(coord / 10);
        this.y = coord % 10;

        if (this.ships.length == 0)
          break;
        else if (this.ships[this.numb].length == 0)
          break;
        this.size = this.ships[this.numb][0].size;

        let method = 'on' + event.type[0].toUpperCase() + event.type.slice(1);

        switch(method){
          case "onMouseout":
          case "onMouseover":
            this.showShip(method);
            break;
          case "onClick":
            this.showShip("onMouseout");
            this.setOrient();
            this.showShip("onMouseover");
            break;
          case "onDblclick":
            this.insert();
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  }
  clear(){
    for (let btn of this.backBtnSize){
      btn.classList = "";
    }
    this.map.clear();
    this.ships1 = [[],[],[],[]];
    this.ships = [];
    var ship = [];
    this. setShipSize(3);
    for(let size = 1; size <= 4; size++){
      for (let value = 1; value <= 5 - size; value++){
        ship.push(new Ship([],[],size));
      }
      this.ships.push(ship);
      ship = [];
      this.sizeBtn[size-1].classList = '';
    }
    
    this.valueShip[0].innerHTML = "4 ЕД.";
    this.valueShip[1].innerHTML = "3 ЕД.";
    this.valueShip[2].innerHTML = "2 ЕД.";
    this.valueShip[3].innerHTML = "1 ЕД.";
  }
  randomInsert(){
    this.clear();

    for (var i = 3; i >= 0; i--){
      for (var ship of this.ships[i]){
        ship.setRandomShip(ship.size);
          while (!(this.map.checkInsert(ship))){

            ship.setRandomShip(ship.size);
          }
          this.map.InsertShipOnMap(ship);
          this.ships1[i].push(ship);
      }
      this.backBtnSize[i].classList = "";
    }
    this.ships = [];

    this.valueShip[0].innerHTML = "0 ЕД.";
    this.valueShip[1].innerHTML = "0 ЕД.";
    this.valueShip[2].innerHTML = "0 ЕД.";
    this.valueShip[3].innerHTML = "0 ЕД.";
  }
  showShip(method) {
    //console.log(event.type);
    let x = this.x;
    let y = this.y;
    var style = "insertShip";
    var cell = this.map;

    if (method == "onMouseover"){
      var setStyle = function(cell, style){
        cell.map.rows[x].cells[y].classList.add(style);
      }
    }
    else if (method == "onMouseout"){
      var setStyle = function(cell){
        cell.map.rows[x].cells[y].classList.remove(style);
      }
    }

    var check = this.map.checkInsert(new Ship([x,y],this.orientation, this.size));
      if (!check) {
        style = "insertShipFalse";
      }
    setStyle(cell, style);
    for (let i = 1; i <= this.size-1; i = i + 1) {
      x += this.orientation[0];
      y += this.orientation[1];
      if (x < 0 || x > 9)
        return;
      else if (y < 0 || y > 9)
        return;
      setStyle(cell, style);
    }
   
  }
  setOrient(){
    this.orientation[0] = (this.orientation[0]+1)%2;
    this.orientation[1] = (this.orientation[1]+1)%2;
    
  }
  setShipSize(size){
    for (let btn of this.backBtnSize){
      btn.classList = "";
    }
    this.numb = size;
    this.backBtnSize[size].classList.add("activeSizeBtn");
    
  }
  insert(){
    var plr = this;
    var orientX = plr.orientation[0];
    var orientY = plr.orientation[1];
    var ship = new Ship([plr.x,plr.y], [orientX,orientY], plr.size);
    if (this.map.checkInsert(ship)){
      console.log("insert");
      this.map.InsertShipOnMap(ship);
      this.ships[this.numb].shift();
      this.ships1[this.numb].push(ship);

      var valueStr = this.ships[this.numb].length + " ЕД.";
      this.valueShip[this.numb].innerHTML = valueStr;
    } else{
      //console.log(ship);
    }
    if (this.ships[this.numb].length == 0){
      this.backBtnSize[this.numb].classList = "";
    }
  }
}

class Map{
  constructor(map, visible){
    
    this.mapArr = this.Create2DArray(10);

    this.visible = visible;
    if (this.visible){
      this.map = map;
      this.defaultColor = 'white';
      this.shihColor = '#62B1D0';
    }
  }
  Create2DArray(rows) {
    var arr = [];
    var arr2 = [];
  
    for (var i=0;i<rows;i++) {
      for (var j=0;j<rows;j++) {
        arr2[j] = 0;
      }
       arr[i] = [];
    }
    return arr;
  }
  InsertShipOnMap(ship)
  {
      var mapArr = this.mapArr;
      var rows = 10;
      var x =  ship.startCoord[0];
      var y = ship.startCoord[1];

      for (let i = 1; i <= ship.size; i = i + 1) {
        if (i != 1){
        x += ship.orientation[0];
        y += ship.orientation[1];
        mapArr[x][y] = 1;
        }
        else {
          mapArr[x][y] = 1;
        }
      }
      if (this.visible == true){
        for (var i=0; i<rows; i++) {
          for (var j=0; j<rows; j++) {
            if (mapArr[i][j] == 1){
              var obj = this.map.rows[i].cells[j];
               obj.classList = '';
              obj.className = 'insShip';
            }
          }
        }
     }
  }
  checkInsert(ship){
    var mapArr = this.mapArr;
    var coord  = ship.startCoord;
      var x = coord[0];
      var y = coord[1];
      var orient = ship.orientation;

    for (let i = 1; i <= ship.size; i = i + 1) {
      if (i != 1){
        x += orient[0];
        y += orient[1];
      }

      if (x < 0 || x > 9)
        return false;
      else if (y < 0 || y > 9)
        return false;

      var xk, yn;
      for(let k = -1; k < 2; k++){
        xk = x;
        xk += k;
        if (xk < 0 || xk > 9)
          continue;
        for(let n = -1; n < 2; n++){
          yn = y;
          yn += n;
          if (yn < 0 || yn > 9)
            continue;
          if (mapArr[xk][yn] == 1)
            return false;
        }
      }
    }
    return true;
  }
  clear(){
    if (this.visible){
      this.map.classList = '';
    }
    
    for(let  i  = 0; i < 10;  i++){
      for(let  j  = 0; j < 10;  j++){
        if (this.visible){
          var obj = this.map.rows[i].cells[j];
          obj.classList = '';
        }
        this.mapArr[i][j] = 0;
      }
    }
  }
  clearArr(){
    for(let  i  = 0; i < 10;  i++){
      for(let  j  = 0; j < 10;  j++){
        this.mapArr[i][j] = 0;
      }
    }
  }
}

class Player{
  constructor(){
    this.login = "Гость"
    this.ready = false;
    this.ships = [[],[],[],[]];
    this.healt = 20;
    this.turn = 0;
    this.clientId = null;
    this.gameId = null;
    this.readyToPlay = false;
    this.waitForInvite = false;
    
    const GameWithFriend = document.getElementById("GameWithFriend");
    GameWithFriend.classList.add("buttonDeactive");


    this.startMenuForm();
    
    //FIXED
    const host = location.origin.replace(/^http/, 'ws');//Создаю единый порт для сокета, без разделений на 9091 и 9090

    
    //console.log("host: " + host);
    this.ws = new WebSocket(host, true); //Если соединение сбрасывается, автоматически перезагружается socket
    //FIXED
    this.ws.onopen = function() {
      console.log("Соединение установлено.");
    };
    this.createWS();
  }
  createMap(map, opponentMap, placementMap, visible){
    this.startMap = map;
    this.map  = new Map(map, visible);
    this.opponentMap = new Map(opponentMap, visible);
    this.map.clearArr();
    this.opponentMap.clearArr();
    this.placementMap = new Map(placementMap, visible);
    this.handlerPlacement = new HandlerPlacement(this.ships, this.placementMap, "manual");
  }
  createWS(){
    this.ws.onmessage = message => {
      const response = JSON.parse(message.data);
      switch (response.method){
        case "connect":
          this.clientId = response.clientId;
          console.log("Client id Set successfully " + this.clientId);
          break;
        case "setOpponent":
          var opponentID =  response.opponentID;
          this.gameId = response.gameID;
          this.gameForm(response.opponentLogin, "Сетевая игра");
          this.setOpponent(new  Opponent(this.ws, opponentID,this.gameId , this));
         
          break;
        case "resultRegister":
          this.resultRegister(response);
          break;
        case "resultAuth":
          this.resultAuth(response);
          break;
        case "result_send_invite":
          this.resultInvite(response);
          break;
        case "invite":
          if (this.waitForInvite){
            const payLoad = {
              "method": "result_send_invite",
              "result": "succes",
              "clientID":  this.clientId,
              "opponentID": response.clientID,
              "login": this.login
            }
            console.log(payLoad);
            this.ws.send(JSON.stringify(payLoad));
            this.inviteToGame(response);
          }
          else{
            const payLoad = {
              "method": "result_send_invite",
              "result": "fail",
              "message": "Игрок не готов",
              "clientID":  this.clientId,
              "opponentID": response.clientID,
              "login": this.login
            }
            console.log(payLoad);
            this.ws.send(JSON.stringify(payLoad));
          }
        break;
        case "cancel_send_invite":
          this.cancelInvite();
          break;
        default:
          console.log("Undefined");
          break;
      }
    }
    
  }
  setReady(value){
    this.readyToPlay = value;
    const payLoad = {
      "method": "setReady",
      "clientID":  this.clientId,
      "ready": value
    }
    console.log(payLoad);
    this.ws.send(JSON.stringify(payLoad));
  }
  startMenuForm(){
    var plr = this;
    const startMenu = document.getElementById('startMenu');
    const menu_block = document.getElementById('menu_block');

    const authorization = document.getElementById("authBtn");
    const registration = document.getElementById("registrationBtn");
    const randomOpponent = document.getElementById("randomOpponent");
    const singleGame = document.getElementById("singleGame");
    const GameWithFriend = document.getElementById("GameWithFriend");
    const out_acc = document.getElementById('out_acc');
    
   
    startMenu.style.display = "block";
    menu_block.style.display = "flex";
    
    var handlerMenu = function(event){
      console.log(event.target);
      switch(event.target){
        case authorization:
          menu_block.style.display = "none";
          plr.authorizationForm();
          break;
        case registration:
          menu_block.style.display = "none";
          plr.registrationForm();
          break;
        case randomOpponent:
          startMenu.style.display = "none";
          menu_block.style.display = "none";
          plr.game = plr.randomOpponent;
          plr.placementForm("randomOpponent");
          break;
        case singleGame:
          startMenu.style.display = "none";
          menu_block.style.display = "none";
          plr.game = plr.singleGame;
          plr.placementForm("single");
          break;
        case GameWithFriend:
          if (plr.login != "Гость"){
            startMenu.style.display = "none";
            menu_block.style.display = "none";
            plr.placementForm("gameWithFriend");
            plr.gameFriend();
          }
          break;
        case out_acc:
          const auth_start = document.getElementById("auth_start");
          const auth_succes = document.getElementById("auth_succes");

          plr.login = "Гость";
          GameWithFriend.classList.add("buttonDeactive");
    
          auth_succes.style.display = "none";
          auth_start.style.display = "flex";
          
          const payLoad = {
            "method": "login_out",
            "clientID":  plr.clientId
          }
          console.log(payLoad);
          plr.ws.send(JSON.stringify(payLoad));
          break;
        default:
          break;
      }
    }
    authorization.addEventListener("click", handlerMenu);
    registration.addEventListener("click", handlerMenu);
    randomOpponent.addEventListener("click", handlerMenu);
    singleGame.addEventListener("click", handlerMenu);
    GameWithFriend.addEventListener("click", handlerMenu);
    out_acc.addEventListener("click", handlerMenu);

    const readRulesForm = document.getElementById('readRulesForm');
    const read_rules = document.getElementById('read_rules');
   
    read_rules.onclick = function(){
      startMenu.style.display = "none";
      readRulesForm.style.display = "block";
     
      const ago_read_rules = document.getElementById('ago_read_rules');
      ago_read_rules.onclick = function(){
        readRulesForm.style.display = "none";
        startMenu.style.display = "block";
      }
    }

    const news1Form = document.getElementById('news1Form');
    const news1 = document.getElementById('news1');
    
    news1.onclick = function(){
      startMenu.style.display = "none";
      news1Form.style.display = "block";

      const ago_newsForm = document.getElementById('ago_newsForm');
      ago_newsForm.onclick = function(){
        news1Form.style.display = "none";
        startMenu.style.display = "block";
      }
    }
    
  }
  authorizationForm(){
    var plr = this;
    const login_user = document.getElementById('login_user');
    const GameWithFriend = document.getElementById("GameWithFriend");

    const authentication_block = document.getElementById('authentication_block');
    authentication_block.style.display = "flex";

    const auth_error = document.getElementById('auth_error');

    //Авторизация
    const auth = document.getElementById('auth');
    auth.onclick = function(){
      const auth_login = document.getElementById('auth-login');
      const auth_password = document.getElementById('auth-password');
      
      var log = auth_login.value;
      var pass = auth_password.value;
  
      if (log == ""){
        auth_error.innerHTML = "Введите логин";
        return;
      }
      if (/[^a-zA-Z0-9]/.test(log)) {
        auth_error.innerHTML = "Логин некорректен";
        return;
      }
      if (pass.length == 0){
        auth_error.innerHTML = "Введите пароль";
        return;
      }
      if (/[^a-zA-Z0-9]/.test(pass)) {
        auth_error.innerHTML = "Пароль некорректен";
        return;
      }
      auth_error.innerHTML = "";
      const payLoad = {
        "method": "authorization",
        "clientID":  plr.clientId,
        "login": log,
        "pass": pass,
      }
      console.log(payLoad);
      plr.ws.send(JSON.stringify(payLoad));
    }

    //Вернуться в меню
    const ago_auth = document.getElementById('ago_auth');
    ago_auth.onclick = function(){
      authentication_block.style.display = "none";
      plr.startMenuForm();
    }

    //Результат авторизации
    this.resultAuth = function(response){
      switch (response.res){
        case "success":
          const auth_start = document.getElementById("auth_start");
          const auth_succes = document.getElementById("auth_succes");
          
          login_user.innerHTML = response.login;
          plr.login = response.login;

          GameWithFriend.classList = "";
        
          auth_start.style.display = "none";
          auth_succes.style.display = "flex";
          authentication_block.style.display = "none";
          plr.startMenuForm();
          break;
        case "password_error":
          auth_error.innerHTML = "Неправильный пароль";
          break;
        case "LoginNotFound":
          auth_error.innerHTML = "Такого логина нет";
          break;
        default:
          auth_error.innerHTML = "Неизвестная ошибка";
          break;
      }
    }
  }
  registrationForm(){ 
    var plr = this;
    const login_user = document.getElementById('login_user');
    const GameWithFriend = document.getElementById("GameWithFriend");

    const reg_error = document.getElementById('reg_error');
    const login = document.getElementById('login');
    const password = document.getElementById('password');
    const cpassword = document.getElementById('cpassword');

    const registration_block = document.getElementById('registration_block');
    registration_block.style.display = "flex";

    //Возвращение в меню
    const ago_reg = document.getElementById('ago_reg');
    ago_reg.onclick = function(){
      registration_block.style.display = "none";
      plr.startMenuForm();
    }

    //Регистрация
    const register = document.getElementById('register');
    register.onclick = function(){
      var log = login.value;
      var pass = password.value;
      var cpass = cpassword.value;
  
      if (log == ""){
        reg_error.innerHTML = "Введите логин";
        return;
      }
      if (pass == ""){
        reg_error.innerHTML = "Введите пароль";
        return;
      }
      if (/[^a-zA-Z0-9]/.test(log)) {
        reg_error.innerHTML = "Логин некорректен";
        return;
      }
      if (/[^a-zA-Z0-9]/.test(pass)) {
        reg_error.innerHTML = "Пароль некорректен";
        return;
      }
      if (pass != cpass){
        console.log(pass+ " - " + cpass);
        reg_error.innerHTML = "Пароли не совпадают";
        return;
      }
      
      reg_error.innerHTML = "";
      const payLoad = {
        "method": "register",
        "clientID":  plr.clientId,
        "login": log,
        "pass": pass,
      }
      console.log(payLoad);
      plr.ws.send(JSON.stringify(payLoad));
    }

    //Результат регистрации
    this.resultRegister = function(response){
      const auth_start = document.getElementById("auth_start");
      const auth_succes = document.getElementById("auth_succes");
      switch (response.res){
        case "success":
          login_user.innerHTML = response.login;
          plr.login = response.login;

          GameWithFriend.classList = "";
          
          auth_start.style.display = "none";
          auth_succes.style.display = "flex";
          registration_block.style.display = "none";
          GameWithFriend.classList = "";
          plr.startMenuForm();
          break;
        case "error":
          reg_error.innerHTML = "Логин занят";
          break;
        default:
          reg_error.innerHTML = "Ошибка";
          break;
      }
    }
  }
  placementForm(gameMethod){
    var plr = this;

    this.checkPlacement = function(){
      var a = true;
      for(let size = 1; size <= 4; size++){
          if (plr.handlerPlacement.ships1[size-1].length != (5 - size) ) {
            console.log(plr.handlerPlacement.ships1[size-1].length);
            a = false;
          }
      }
      return a;
    }

    const placement_footer = document.getElementById("placement_footer");
    switch (gameMethod){
      case "randomOpponent":
      case "single":
        placement_footer.classList = "";
        placement_footer.classList.add("footer");
        break;
      case "gameWithFriend":
        placement_footer.classList = "";
        placement_footer.classList.add("footer2");
        break;
    }
    
    placementShip.style.display = "block";

    const ago = document.getElementById('ago');
    ago.onclick = function(){
      plr.handlerPlacement.clear();
      plr.map.clear();
      placementShip.style.display = "none";
      plr.startMenuForm();
    }

    const startGame = document.getElementById('startGame');
    startGame.onclick = function(){
      if (!(plr.checkPlacement())) {
        return;
      }
      plr.ships = plr.handlerPlacement.ships1;
      console.log(plr.handlerPlacement.ships1);
      for (var i = 3; i >= 0; i--){
        for (var ship of plr.ships[i]){
          plr.map.InsertShipOnMap(ship);
          console.log(ship);
        }
      }
      plr.ready = true;
      placementShip.style.display = "none";
      plr.game();
    }

   
  }
  gameFriend(){

    const placementShipBack = document.getElementById('placementShipBack');
    var plr = this;

    //Ожидание приглашения
    const waitInvite = document.getElementById('waitInvite');
    const waitInviteForm = document.getElementById('waitInviteForm');
    waitInvite.onclick = function(){
      if (!(plr.checkPlacement())) {
        return;
      }
      plr.ships = plr.handlerPlacement.ships1;
      for (var i = 3; i >= 0; i--){
        for (var ship of plr.ships[i]){
          plr.map.InsertShipOnMap(ship);
        }
      }
      plr.ready = true;
      placementShipBack.style.display = "none";
      waitInviteForm.style.display = "block";

      plr.waitForInvite = true;
    }
    const cancel_wait_invite = document.getElementById('cancel_wait_invite');
    cancel_wait_invite.onclick = function(){
      plr.setReady(false);
      plr.waitForInvite = false;
      plr.map.clear();

      waitInviteForm.style.display = "none";
      placementShipBack.style.display = "flex";
    }

    //Приглашение в игру
    this.inviteToGame = function(response) {
      const waitInviteForm = document.getElementById('waitInviteForm');
      const inviteForm = document.getElementById('inviteForm');
      const send_game_login = document.getElementById('send_game_login');

      plr.waitForInvite = false;
      waitInviteForm.style.display = "none";
      inviteForm.style.display = "block";

      const invite_login_game = document.getElementById('invite_login_game');
      invite_login_game.innerHTML = response.login;

      //Отклонить приглашение
      const cancelSend = document.getElementById('cancel_send_game');
      cancelSend.onclick = function(){
        plr.setReady(false);
        plr.waitForInvite = true;
        inviteForm.style.display = "none";
        waitInviteForm.style.display = "block";
        
        const payLoad = {
          "method": "result_send_invite",
          "result": "fail",
          "message": "Игрок отклонил приглашение",
          "clientID":  plr.clientId,
          "opponentID": response.clientID,
          "login": plr.login
        }
        console.log(payLoad);
        plr.ws.send(JSON.stringify(payLoad));
      }

      //Принять приглашение
      const accept_invite_btn = document.getElementById('accept_invite_btn');
      accept_invite_btn.onclick = function(){
        plr.setReady(true);
        plr.waitForInvite = false;
        var log = send_game_login.value;
        const payLoad = {
          "method": "createGame",
          "clientID":  plr.clientId,
          "opponentID": response.clientID,
        }
        console.log(payLoad);
        plr.ws.send(JSON.stringify(payLoad));
      }

      //Отмена приглашения
      this.cancelInvite = function(){
        plr.setReady(false);
        plr.waitForInvite = true;
        inviteForm.style.display = "none";
        waitInviteForm.style.display = "block";
      }
    }
    
    //Отправить приглашение
    const sendInvite = document.getElementById('sendInvite');
    const sendInviteForm = document.getElementById('sendInviteForm');
    sendInvite.onclick = function(){
      if (!(plr.checkPlacement())) {
        return;
      }
      plr.ships = plr.handlerPlacement.ships1;
      for (var i = 3; i >= 0; i--){
        for (var ship of plr.ships[i]){
          plr.map.InsertShipOnMap(ship);
        }
      }
      plr.ready = true;
      placementShipBack.style.display = "none";
      sendInviteForm.style.display = "block";
    }
    const ago_send_game = document.getElementById('ago_send_game');
    ago_send_game.onclick = function(){
      const send_game_error = document.getElementById('send_game_error');
      send_game_error.innerHTML = "";
      plr.map.clear();
      sendInviteForm.style.display = "none";
      placementShipBack.style.display = "flex";
    }
    const send_invite_btn = document.getElementById('send_invite_btn');
    send_invite_btn.onclick = function(){
      const send_game_error = document.getElementById('send_game_error');
      const send_game_login = document.getElementById('send_game_login');
      var log = send_game_login.value;
      if (log == ""){
        send_game_error.innerHTML = "Введите логин";
        return;
      }
      if (/[^a-zA-Z0-9]/.test(log)) {
        send_game_error.innerHTML = "Логин некорректен";
        return;
      }
      
      send_game_error.innerHTML = "";
      const payLoad = {
        "method": "send_invite",
        "clientID":  plr.clientId,
        "opponent_login": log,
        "login": plr.login
       
      }
      console.log(payLoad);
      plr.ws.send(JSON.stringify(payLoad));
    }

    //Результат приглашения
    this.resultInvite = function(response){
      const waitConfirm = document.getElementById('waitConfirm');//Ожидание принятия приглашения
      const sendInviteForm = document.getElementById('sendInviteForm');
      switch (response.result){
        case "succes":
          plr.setReady(true);
          const login_game = document.getElementById('login_game');
          sendInviteForm.style.display = "none";
          login_game.innerHTML = response.login;
          waitConfirm.style.display = "block";
          break;
        case "fail":
          waitConfirm.style.display = "none";
          sendInviteForm.style.display = "block";
          const send_game_error = document.getElementById('send_game_error');
          send_game_error.innerHTML = response.message;
          break;
        default:
          break;
      }

      //Отменить приглашение
      const cancelinvite = document.getElementById('cancelSend');
      cancelinvite.onclick = function(){
        plr.setReady(false);
        waitConfirm.style.display = "none";
        sendInviteForm.style.display = "block";

        const payLoad = {
          "method": "cancel_send_invite",
          "clientID":  plr.clientId,
          "opponentID": response.clientID,
          "login": plr.login
        }
        console.log(payLoad);
        plr.ws.send(JSON.stringify(payLoad));
      }
    }

    this.clear = function(){
      console.log("clear game friend");
      const waitConfirm = document.getElementById('waitConfirm');
      const inviteForm = document.getElementById('inviteForm');
      const sendInviteForm = document.getElementById('sendInviteForm');
      const placementShipBack = document.getElementById('placementShipBack');

      inviteForm.style.display = "none";
      waitInviteForm.style.display = "none";
      sendInviteForm.style.display = "none";
      waitConfirm.style.display = "none";
      placementShipBack.style.display = "flex";
      placementShip.style.display = "none";
    }
  }
  singleGame(){
    const placementShip = document.getElementById('placementShip');
    this.clear = function(){
      placementShip.style.display = "none";
    }

    var opponent =  new Computer(this);
    opponent.createMap(this.opponentMap, this.map, 0);
    this.setOpponent(opponent);
    this.gameForm("Компьютер","Одиночная игра");
  }
  randomOpponent(){
    const load_opponent = document.getElementById('load_opponent');
    load_opponent.style.display = "block";
    this.setReady(true);
    const payLoad = {
      "method": "searchOpponent",
      "clientID":  this.clientId,
      "mapArr": this.map.mapArr
    }
    this.ws.send(JSON.stringify(payLoad));
    console.log("Отправлено сообщение");
    console.log(payLoad);

    var plr = this;
    const cancel_load  = document.getElementById('cancel_load');
    cancel_load.onclick = function(){
      plr.setReady(false);
      const payLoad = {
        "method": "cancelSearchOpponent",
        "clientID":  plr.clientId,
      }
      plr.ws.send(JSON.stringify(payLoad));
      console.log("Отправлено сообщение");
      console.log(payLoad);
      plr.restart();

      load_opponent.style.display = "none";
      plr.startMenuForm();
    }
    this.clear = function(){
      console.log("rand clear");
      const load_opponent = document.getElementById('load_opponent');
      load_opponent.style.display = "none";
    }
  }
  gameForm(opp_login, method_game){
    const game = document.getElementById('game');
    const  opp_game_login = document.getElementById('opp_game_login');
    const  you_game_login = document.getElementById('you_game_login');
    const  type_game = document.getElementById('type_game');
   
    you_game_login.innerHTML = this.login;
    opp_game_login.innerHTML = opp_login;
    type_game.innerHTML = method_game;

    this.my_ship_value = [];
    this.my_ship_value[0] = {
      btn: document.getElementById('my_ship1_value'),
      value: 4,
      back: document.getElementById('my_1ship')
    };
    this.my_ship_value[1] = {
      btn: document.getElementById('my_ship2_value'),
      value: 3,
      back: document.getElementById('my_2ship')
    };
    this.my_ship_value[2] = {
      btn: document.getElementById('my_ship3_value'),
      value: 2,
      back: document.getElementById('my_3ship')
    };
    this.my_ship_value[3] = {
      btn: document.getElementById('my_ship4_value'),
      value: 1,
      back: document.getElementById('my_4ship')
    };

    this.opp_ship_value = [];
    this.opp_ship_value[0] = {
      btn: document.getElementById('opp_ship1_value'),
      value: 4,
      back: document.getElementById('opp_1ship')
    };
    this.opp_ship_value[1] = {
      btn: document.getElementById('opp_ship2_value'),
      value: 3,
      back: document.getElementById('opp_2ship')
    };
    this.opp_ship_value[2] = {
      btn: document.getElementById('opp_ship3_value'),
      value: 2,
      back: document.getElementById('opp_3ship')
    };
    this.opp_ship_value[3] = {
      btn: document.getElementById('opp_ship4_value'),
      value: 1,
      back: document.getElementById('opp_4ship')
    };
    
    this.setShipValue( this.opp_ship_value);
    this.setShipValue( this.my_ship_value);
    
   
    this.clear();//Очистка фона
    game.style.display = "block";

    this.gameFormClear = function(){
      game.style.display = "none";
      you_game_login.innerHTML = "";
      opp_game_login.innerHTML = "";
      type_game.innerHTML = "Игра";
    }

    var plr = this;
    const capitulate = document.getElementById('capitulate');
    capitulate.onclick = function(){
      plr.opponent.capitulate();
      plr.restart();
      plr.gameFormClear();
      plr.startMenuForm();
    }
  }
  setShipValue(ship_value){
    for (let ship of ship_value){
      ship.btn.innerHTML = ship.value + " ЕД.";
    }
  }
  setKillStyle(ship){
    ship.back.classList.add("kill_ship");
    setTimeout(()=>{ ship.back.classList.remove("kill_ship")}, 2000);
  }
  setOpponent(opponent){
    var plr = this;
    this.opponent = opponent;
    console.log("setOpponent ",this.opponent);

    this.handlerOpponent = function(event){
      if (event.target.tagName == "TD"){
        if (plr.turn){
          plr.shoot(event);
        }
      }
    }
    this.opponentMap.map.addEventListener("click", this.handlerOpponent);
  }
  setTurn(turn){
    this.turn = turn;
    
    if (this.turn){
      this.map.map.classList  = '';
      this.opponentMap.map.classList =  '';
      this.opponentMap.map.classList.add('turn');
      this.map.map.classList.add('noTurn');
    }
    else{
      this.map.map.classList  = '';
      this.opponentMap.map.classList =  '';
      this.map.map.classList.add('turn');
      this.opponentMap.map.classList.add('noTurn');
    }
  }
  checkShoot([x,y]){
    var opponentMapArr = this.opponentMap.mapArr;
    switch (opponentMapArr[x][y]){
      case 2:
      case 3:
        console.log("Вы уже стреляли сюда!");
        return false;
      default:
        console.log("Ход возможен");
        return true;
        break;
    }
  }
  shoot(event){
    let coord = event.target.id;
    var x = Math.floor(coord / 10);
    var y = coord % 10;
   console.log("shoot");
    if (this.checkShoot(coord)){
      this.opponent.getShoot([x,y]);
      //this.turn = 0;
    }
  }
  getShoot(coord){
    var x = coord[0];
    var y = coord[1];
    var cell =  this.map.mapArr[x][y];
    var result = {
      "cell": cell,
      "ship": null
    }
    this.setResultShoot(this.map, coord, result);
    if (cell == 1){
      for (var i = 3; i >= 0; i--){
        for (var ship of this.ships[i]){
          if (ship.checkCoord(coord)){
            if(ship.kill){
              console.log(ship);
              this.killShip(ship, this.map);
              cell = 5;
              result.ship = ship;
            }
          }
        }
      }
      this.healt--;
      if  (this.healt == 0){
        console.log(this.healt);
        cell = 4;
      }
    }
    result.cell = cell;
    return result;
  }
  setResultShoot(map, coord, result){
    var x = coord[0];
    var y = coord[1];
    var obj  =  map.map.rows[x].cells[y];
    var back;
    var cell = result.cell;
    switch(cell){
      case 0:
        back = 'miss';
        map.mapArr[x][y] = 2;
        break;
      case 1:
        back = 'hit';
        map.mapArr[x][y] = 3;
        break;
      case 2:
       return;
      case 3:
        return;
      case 4:
        map.mapArr[x][y] = 3;
        this.killShip(result.ship, map);
        return;
      case 5:
        map.mapArr[x][y] = 3;
        this.killShip(result.ship, map);
        return;
    }
    if (this.map.visible == true){
      obj.className = back;
    }
  }
  killShip(ship, map){

    if (map == this.map){
      this.my_ship_value[ship.size-1].value--;
      this.setShipValue(this.my_ship_value);
      this.setKillStyle(this.my_ship_value[ship.size-1]);
    }
    else {
      this.opp_ship_value[ship.size-1].value--;
      this.setShipValue(this.opp_ship_value);
      this.setKillStyle(this.opp_ship_value[ship.size-1]);
    }
    
    var coord  = ship.startCoord;
    var x = coord[0];
    var y = coord[1];
    var orient = ship.orientation;

    for (let i = 1; i <= ship.size; i = i + 1) {
      if (i != 1){
        x += orient[0];
        y += orient[1];
      }

      var xk, yn;
      for(let k = -1; k < 2; k++){
        xk = x;
        xk += k;
        if (xk < 0 || xk > 9)
          continue;
        for(let n = -1; n < 2; n++){
          yn = y;
          yn += n;
          if (yn < 0 || yn > 9)
            continue;

          var obj  = map.map.rows[xk].cells[yn];
          map.mapArr[xk][yn] = 2;
          obj.className = 'miss';
        }
      }
      console.log(map);
    }

    var x = ship.startCoord[0];
    var y = ship.startCoord[1];
    var obj  = map.map.rows[x].cells[y];
    console.log("kill");
    obj.className = 'dead';
    for (let i = 2; i <= ship.size; i++){
      x += ship.orientation[0];
      y += ship.orientation[1];
      obj  = map.map.rows[x].cells[y];
      map.mapArr[x][y] = 3;
      obj.className = 'dead';
    }
  }
  viewOpponentMap(opponentMapArr){
    for(let  i  = 0; i < 10;  i++){
      for(let  j  = 0; j < 10;  j++){
        if (opponentMapArr[i][j] == 1 &&  this.opponentMap.mapArr[i][j] == 0){
          var obj = this.opponentMap.map.rows[i].cells[j];
          obj.style.backgroundColor = '#62B1D0';
        }
      }
    }
  }
  disconnect(response){
    const notify = document.getElementById('notify');
    const result_game1 = document.getElementById('result_game1');
    const result_game2 = document.getElementById('result_game2');
    notify.style.display = "block";

    result_game1.innerHTML = "";
    result_game2.innerHTML = "Противник вышел из сети";
    var plr = this;
    const ok = document.getElementById('ok');
    ok.onclick = function(){
      notify.style.display = "none";
      plr.gameFormClear();
      plr.restart();
    
      plr.startMenuForm();
    }

  }
  endGame(response){
    var plr = this;
    this.opponentMap.map.classList = '';
    this.map.map.classList = '';
    switch (response.reason){
      case "defeat":
        if (response.winner == this.clientId){
          var res1 = "Поздравляем!"
          var res2 = "ТЫ ПОБЕДИЛ";
        }
        else{
          var res1 = "Сожалеем";
          var res2 = "ТЫ ПРОИГРАЛ";
        }
        break;
      default:
        break;
    }
    const notify = document.getElementById('notify');
    const result_game1 = document.getElementById('result_game1');
    const result_game2 = document.getElementById('result_game2');
    result_game1.innerHTML = res1;
    result_game2.innerHTML = res2;
    notify.style.display = "block";
    const ok = document.getElementById('ok');
    ok.onclick = function(){
      notify.style.display = "none";
      plr.gameFormClear();
      plr.restart();
    
      plr.startMenuForm();
    }
  }
  endSingleGame(winner){
    this.map.map.classList = '';
    
    if (winner == "client"){
      var res1 = "Поздравляем!"
      var res2 = "ТЫ ПОБЕДИЛ";
    }
    else{
      var res1 = "Сожалеем";
      var res2 = "ТЫ ПРОИГРАЛ";
    }
      
    const notify = document.getElementById('notify');
    const result_game1 = document.getElementById('result_game1');
    const result_game2 = document.getElementById('result_game2');
    result_game1.innerHTML = res1;
    result_game2.innerHTML = res2;
    notify.style.display = "block";
    const ok = document.getElementById('ok');
    var plr = this;
    ok.onclick = function(){
      notify.style.display = "none";
      plr.gameFormClear();
      plr.restart();
    
      plr.startMenuForm();
    }
  }
  capitulate(responce){
    const notify = document.getElementById('notify');
    const result_game1 = document.getElementById('result_game1');
    const result_game2 = document.getElementById('result_game2');
    result_game1.innerHTML = "Игра окончена";
    result_game2.innerHTML = "Противник сдался";
    notify.style.display = "block";
    var plr = this;
    const ok = document.getElementById('ok');
    ok.onclick = function(){
      notify.style.display = "none";
      plr.gameFormClear();
      plr.restart();
    
      plr.startMenuForm();
    }
  
  }
  restart(){
    this.ready = false;
    this.ships = [[],[],[],[]];
    this.healt = 20;
    
    this.turn = 0;
    this.gameId = null;

    this.map.clear();
    this.opponentMap.clear();
    this.placementMap.clear();
    this.handlerPlacement.clear();
    
    this.opponent;
    
    this.createWS();
  }
}

class Opponent{
  constructor(ws, opponentID, gameID, player){
    this.clientId = player.clientId;
    this.gameID = gameID;
    this.opponentID = opponentID;
    this.ws = ws;
    this.player = player;
    this.ws.onmessage = message => {
      const response = JSON.parse(message.data);
      switch (response.method){
        case "resultShoot":
          var result = response.res;
          var coord = response.coord;
          this.player.setResultShoot(this.player.opponentMap, coord, result);
          break;
        case "shoot":
          var coord = response.coord;
          var result = this.player.getShoot(coord);
          const payLoad = {
            "method": "resultShoot",
            "coord" : coord,
            "res": result,
            "clientID":  this.clientId,
            "opponentID": this.opponentID,
            "gameID": this.gameID
          }
          this.ws.send(JSON.stringify(payLoad));
          break;
        case "setTurn":
            if (response.turn == this.clientId){
              this.player.setTurn(1);
            }
            else {
              this.player.setTurn(0);
            }
            break;
        case "resultGame":
          break;
        case "endGame":
          this.player.endGame(response);
          break;
        case "disconnect":
          this.player.disconnect(response);
          break;
        case "capitulate":
          this.player.capitulate(response);
          break;
        default:
          console.log("Получено сообщение");
          console.log(response);
          console.log("Undefined");
          break;
      }
    }
  }
  getShoot(coord){
    this.player.turn = 0;
    const payLoad = {
      "method": "shoot",
      "coord" : coord,
      "clientID":  this.clientId,
      "opponentID": this.opponentID,
      "gameID": this.gameID
    }
    console.log("Отправлено сообщение");
    console.log(payLoad);
    this.ws.send(JSON.stringify(payLoad));
  }
  capitulate(){
    const payLoad = {
      "method": "capitulate",
      "clientID":  this.clientId,
    }
    this.ws.send(JSON.stringify(payLoad));
  }
}

class Computer{
  constructor(player){
    this.name = "SKYNET";
    this.ready = true;
    this.ships = [[],[],[],[]];
    this.healt = 20;
    this.turn = 0;

    this.timer;

    this.opponent = player;
    this.opponent.setTurn(1);

    this.status = "search";
    this.x;
    this.y;
    this.moving2;
    this.mov = Math.floor(Math.random() * (4));
    this.sizeOfHit = 0;
  }
  createMap(map, opponentMap, visible){
    this.map  = new Map(map, visible);
    this.opponentMap = new Map(opponentMap, visible);
    this.map.clearArr();
    this.opponentMap.clearArr();
    this.handlerPlacement = new HandlerPlacement(this.ships, this.map, "random");
   
    console.log(this.map);
    this.ships = this.handlerPlacement.ships1;

  }
  set turn(turn){
    switch(turn){
      case 0:
        break;
      case 1:
        console.log("ход компьютера");
        this.timer = setTimeout(()=>{
          this.shoot();
        }, 1000);
        //
        break;
      default:
        break;
    }
  }
  checkShoot([x,y]){
    var opponentMapArr = this.opponentMap.mapArr;
    if (x < 0 || x > 9){
      return false;
    }
    if (y < 0 || y > 9){
      return false;
    }
    switch (opponentMapArr[x][y]){
      case 2:
      case 3:
        console.log("Вы уже стреляли сюда!");
        return false;
      default:
        console.log("Ход возможен");
        return true;
    }
  }
  shoot(){
    switch(this.status){
      case "search":
        do{
        this.x = Math.floor(Math.random() * (10));
        this.y = Math.floor(Math.random() * (10));
        } while(!this.checkShoot([this.x,this.y]));

        var result = this.opponent.getShoot([this.x,this.y]);

        this.setResultShoot(result);
        break;
      case "killing":
        var check = 0;
        this.moving2 = [this.x, this.y];

        while(!check){
          switch (this.mov){
            case 0:
              this.moving2[0] = this.moving2[0] - 1;
              break;
            case 1:
              this.moving2[1] = this.moving2[1] + 1;
              break;
            case 2:
              this.moving2[0] = this.moving2[0] + 1;
              break;
            case 3:
              this.moving2[1] = this.moving2[1] - 1;
              break;
            default:
              console.log("err");
              break;
            } 
            
            if (this.moving2[0] > 9 || this.moving2[0] < 0){
              check = 0
              this.changeMov();
              this.moving2 = [this.x, this.y];
            }
            else if(this.moving2[1] > 9 || this.moving2[1] < 0){
              check = 0
              this.changeMov();
              this.moving2 = [this.x, this.y];
            }
            else if(this.opponentMap.mapArr[this.moving2[0]][this.moving2[1]] == 2){
              check = 0
              this.changeMov();
              this.moving2 = [this.x, this.y];
            }
            else if(this.opponentMap.mapArr[this.moving2[0]][this.moving2[1]] == 3){
              check = 0;
             
            }
            else{
              check = 1;
              this.x = this.moving2[0];
              this.y = this.moving2[1];
            }

        }
        var result = this.opponent.getShoot([this.x,this.y]);
        this.setResultShoot(result);
        break;
      default:
        console.log("error");
        break;
    }
  }
  setResultShoot(result){
    console.log(result);
    console.log([this.x,this.y]);
    var cell =  result.cell;
    switch(cell){
      case 0: 
        this.opponentMap.mapArr[this.x][this.y] = 2;
        console.log(this.opponentMap.mapArr);
        if (this.status == "killing"){
          if (this.mov == 0){
            this.x = this.x + 1;
          }
          else if(this.mov == 1){
            this.y = this.y - 1;
          }
          else if(this.mov == 2){
            this.x = this.x - 1;
          }
          else{
            this.y = this.y + 1;
          }
        }
        //this.changeMov();
        this.turn = 0;
        this.opponent.setTurn(1);
        break;
      case 1: 
        this.opponentMap.mapArr[this.x][this.y] = 3;
        console.log(this.opponentMap.mapArr);
        this.status = "killing";
        this.sizeOfHit = this.sizeOfHit + 1;
        this.opponent.setTurn(0);
        this.turn = 1;
        break;
      case 2: 
      this.turn = 1;
        break;
      case 3: 
      this.turn = 1;
        break;
      case 4: 
        this.opponentMap.mapArr[this.x][this.y] = 3;
        this.opponent.endSingleGame("comp");
        break;
      case 5:
        this.opponentMap.mapArr[this.x][this.y] = 3;
        this.sizeOfHit = 0;
        
        this.killShip(result.ship, this.opponentMap);
        this.mov = Math.floor(Math.random() * (4));
        this.status = "search";
        this.turn = 1;
        break;
    }
  }
  getShoot(coord){
    this.opponent.turn = 0;
    var x = coord[0];
    var y = coord[1];
    var cell =  this.map.mapArr[x][y];
    var result = {
      "cell": cell,
      "ship": null
    }
    switch(cell){
      case 0:
        this.map.mapArr[x][y] = 2;
        break;
      case 1:
        for (var i = 3; i >= 0; i--){
          for (var ship of this.ships[i]){
            if (ship.checkCoord(coord)){
              if(ship.kill){
                console.log(ship);
                cell = 5;
                result.ship = ship;
                break;
              }
            }
          }
        }
        this.map.mapArr[x][y] = 3;
        break;
      case 2:
       return;
        break;
      case 3:
        return;
        break;
      case 4:
        this.map.mapArr[x][y] = 3;
        break;
    }
    if (cell == 1 || cell == 5 ){
      this.healt--;
      if  (this.healt == 0){
        cell = 4;
        this.opponent.endSingleGame("client");
      }
    }
    result.cell = cell;
    this.opponent.setResultShoot(this.opponent.opponentMap, coord, result);
    
    switch(cell){
      case 0:
        this.opponent.setTurn(0);
        this.turn = 1;
        
        break;
      case 1:
         this.opponent.setTurn(1);
        this.turn = 0;
       
        break;
      case 5:
        this.opponent.setTurn(1);
        this.turn = 0;
        
        break;
      
    }
  }
  changeMov(){
    if (this.sizeOfHit > 1)
    {
      if (this.mov == 1 || this.mov == 3)
      {
        this.mov = Math.abs(this.mov-4);
      }
      else
      {
        this.mov = Math.abs(this.mov-2);
      }
    }
    else
    {
      this.mov = (this.mov+1)%4;
    }
  }
  killShip(ship, map){
    var coord  = ship.startCoord;
    var x = coord[0];
    var y = coord[1];
    var orient = ship.orientation;

    for (let i = 1; i <= ship.size; i = i + 1) {
      if (i != 1){
        x += orient[0];
        y += orient[1];
      }

      var xk, yn;
      for(let k = -1; k < 2; k++){
        xk = x;
        xk += k;
        if (xk < 0 || xk > 9)
          continue;
        for(let n = -1; n < 2; n++){
          yn = y;
          yn += n;
          if (yn < 0 || yn > 9)
            continue;

          map.mapArr[xk][yn] = 2;
        }
      }
      console.log(map);
    }

    
    var x = ship.startCoord[0];
    var y = ship.startCoord[1];
    map.mapArr[x][y] = 3;
    for (let i = 2; i <= ship.size; i++){
      x += ship.orientation[0];
      y += ship.orientation[1];
      map.mapArr[x][y] = 3;
    }
  }
  capitulate(){
    clearTimeout(this.timer);
    console.log("человек сдался");
  }
}

window.onload = function() {
  console.log('Страница загружена');

  const myTable = document.getElementById('my');
  const opponentTable = document.getElementById('opponent');
  const placementMap = document.getElementById('placementMap');

  player1  = new Player();
  player1.createMap(myTable, opponentTable, placementMap, true);

 
};

