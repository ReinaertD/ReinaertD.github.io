/////////////////////
//GLOBAL VARIABLES///
/////////////////////
const test = document.getElementById("test");
const attackBtn = document.getElementById("attackAction");
const defendBtn = document.getElementById("defendAction");
const playerHP = document.getElementById("playerHP");
const opponentHP = document.getElementById("opponentHP");
const battleLog = document.getElementById("battleLog");
const playerAvatar = document.getElementById("playerAvatar");
const playerTitle = document.getElementById("playerTitle");
const opponentAvatar = document.getElementById("opponentAvatar");
const duelWins = document.getElementById("duelsWon");
const duelLosses = document.getElementById("duelsLost");
let player;
let npcPlayer;


/////////////
///CLASSES///
/////////////
class playerCharacter{
	constructor(name, gender){
		this.name = name;
		this.gender = gender;
		if(name == "Lisa"){
			this.title = "Pheasant";
		} else this.title= "Peasant";
		this.hp = Number("5");
		this.hpMax = Number("5");
		this.avatar = `https://avatars.dicebear.com/v2/${gender}/${name}.svg`;
		this.duelsWon = Number("0");
		this.duelsLost = Number("0");
	}
}

class nonCharacter{
	constructor(name,gender,alias,title,allegiance,avatar){
		let randomHP = numChoice(15) + 1;
		this.name = name;
		this.title = title;
		this.alias = alias;
		this.allegiance = allegiance;
		this.avatar = avatar;
		this.hp = randomHP;
		this.hpMax = randomHP;
	}
	// COMPILES WHOLE NAME
	fullName(){
		let completeName ="";
		let seperatedName=[];
		if(this.name != ""){
			seperatedName = this.name.split(' ');
		}
		if(this.alias != ""){
			seperatedName.splice(1,0,`\'${this.alias}\'`);	
		}
		if(this.title != ""){
			seperatedName.unshift(this.title);
		}	
		completeName = seperatedName.join(' ');
		return completeName;	
	}
}

//////////////
//FUNCTIONS///
//////////////
async function gotPersonGenerator(){
	let allegiance, alias, title;
	// REQUEST A RANDOM CHARACTER
	let randomPerson = numChoice(700)+1;
	let persRequest = await fetch(`https://anapioficeandfire.com/api/characters/${randomPerson} `);
		let gotCharacter = await persRequest.json();
		// GETS ALLEGIANCE
		allegiance = Math.floor(Math.random() * Math.floor(gotCharacter.allegiances.length-1));
		let allRequest = await fetch(`${gotCharacter.allegiances[allegiance]}`);
		let gotAllegiance = await allRequest.json();
		allegiance = gotAllegiance.name;
		// GETS ALIAS
		alias = Math.floor(Math.random() * Math.floor(gotCharacter.aliases.length-1));
		alias = gotCharacter.aliases[alias];
		// GETS TITLE
		title = Math.floor(Math.random() * Math.floor(gotCharacter.titles.length-1));
		title = gotCharacter.titles[title];	
		// GETS AVATAR
		let avatar =  `https://avatars.dicebear.com/v2/${(gotCharacter.gender).toLowerCase()}/${randomPerson}.svg`;
		return new nonCharacter(gotCharacter.name, gotCharacter.gender, alias, title, allegiance,avatar);
	}
// FUNCTION THAT CREATES PLAYER BY RETRIEVING FROM LOCALSTORAGE
function createPlayerCharacter(){
	let playerName = localStorage.getItem("playerLogin");
	let playerGender = localStorage.getItem("playerGender");
	return player = new playerCharacter(playerName, playerGender);	
}



// DISPLAYS PLAYER STATS AND CONTROLS HP BAR
function displayPlayerCombat(player){
	document.getElementById("playerName").textContent = player.name;
	playerHP.textContent = player.hp;
	playerTitle.innerText = player.title;
	playerHP.setAttribute("aria-valuemax", player.hpMax);
	playerHP.setAttribute("aria-valuenow", player.hp);
	playerHP.setAttribute("style", `width: ${(player.hp/player.hpMax)*100}% `);
	duelLosses.innerText = player.duelsLost + " times resurrected by R'hllor";
	duelWins.innerText = player.duelsWon + " duels won";
	playerAvatar.src = player.avatar;

}

// DISPLAYS NPC STATS AND CONTROLS HP BAR
function displayNPCCombat(opponent){
	document.getElementById("opponentName").textContent = opponent.fullName();
	document.getElementById("opponentAllegiance").textContent = opponent.allegiance;
	opponentHP.textContent = opponent.hp;
	opponentHP.setAttribute("aria-valuemax", opponent.hpMax);
	opponentHP.setAttribute("aria-valuenow", opponent.hp);
	opponentHP.setAttribute("style", `width: ${(opponent.hp/opponent.hpMax)*100}% `);
	opponentAvatar.src = opponent.avatar;

}
// DISABLES COMBAT BUTTONS
function disableControls(input){
	if(input === "on"){
		attackBtn.disabled = true;
		defendBtn.disabled = true;
		attackBtn.setAttribute("style", "width:5rem; background-color:#A0A0A0;");
		defendBtn.setAttribute("style", "width:5rem; background-color:#A0A0A0;");
	} else if(input === "off"){
		attackBtn.disabled = false;
		defendBtn.disabled = false;
		attackBtn.setAttribute("style", "width:5rem;");
		defendBtn.setAttribute("style", "width:5rem;");
	} else console.log("disableControls function error");
}

//ATTACK ACTION, DAMAGES TARGET && OPPONENTMOVE
function attackAction(target){
	//First if attacks against NPCs
	if(target === npcCharacter){
		if(target.hp===1 || target.hp<1){
			//console.log(target.name + " died.");
			player.duelsWon++;
			duelWins.innerText = player.duelsWon + " duels won";
			console.log(duelsWon);
			target.hp = "DEAD";
			displayNPCCombat(target);
			disableControls("on");
		}else {
			target.hp--;
			displayNPCCombat(target);
		}
		//SECOND IF ATTACK AGAINST PC
	} else if (target === player){

		if(target.hp===1 || target.hp<1){
			console.log(target.name + " died.");
			target.hp = "DEAD";
			player.duelsLost++;
			target.hp = Number("10");
			duelLosses.innerText = player.duelsLost + " times resurrected by R'hllor";
			console.log(player.duelsLost);
			displayPlayerCombat(target);
			disableControls("on");
			battleLog.textContent += " " + player.name + " died and was resurrected by a priest of R'hllor!";
		}else {
			target.hp--;
			displayPlayerCombat(target);
		}
	} else (console.log("function attackAction failed!"));
}

//DEFEND ACTION, DEFENDS SELF && OPPONENTMOVE
function defendAction(self){

}

// RETURNS A RANDOM NUMBER
function numChoice(maxNumber){
	let x = Math.floor(Math.random()* Math.floor(maxNumber));
	return x;
}

// BATTLE LOGIC
// RESULTS OF PLAYER ACTIONS AND OPPONENT ACTIONS
function gameLogic(playerAction){
	// enemyAction | if 0 ATTACK if 1 DEFEND
	let enemyAction = numChoice(2);	
	if( playerAction === "attack" && enemyAction === 1){
		let result = numChoice(2);
		if(result === 0){
			attackAction(npcCharacter);
			opponentAvatar.src += "?options[mood][]=sad";
			battleLog.textContent += " " + npcCharacter.name + " failed to parry!" + "\r\n";
			battleLog.scrollTop = battleLog.scrollHeight;
		} else {
			battleLog.textContent += " " + npcCharacter.name + " blocked!" + "\r\n";
			battleLog.scrollTop = battleLog.scrollHeight;
		}
	} else if ( playerAction === "defend" && enemyAction === 1){
		battleLog.textContent += " You both angrily stare at eachother!" + "\r\n";
	} else if ( playerAction === "defend" && enemyAction === 0){
		let result = numChoice(2);
		if(result === 0){
			attackAction(player);
			playerAvatar.src += "?options[mood][]=sad";
			battleLog.textContent += " You failed to parry!" + "\r\n";
			battleLog.scrollTop = battleLog.scrollHeight;
		} else {
			battleLog.textContent += " You blocked the attack!" + "\r\n";
			battleLog.scrollTop = battleLog.scrollHeight;
		};
	} else if (playerAction === "attack" && enemyAction === 0){
		battleLog.textContent += " You both attack simultaneously" + "\r\n";
		battleLog.scrollTop = battleLog.scrollHeight;
		attackAction(npcCharacter);
		attackAction(player);
		opponentAvatar.src += "?options[mood][]=surprised";
		playerAvatar.src += "?options[mood][]=surprised";
	}
}

//////////////////
//CODE EXECUTION//
//////////////////

(async() => {
	// CREATES PLAYER BY RETRIEVING DATA FROM LOCALSTORAGE 
	player = createPlayerCharacter();
	// INSTANTIATE GOT CHARACTER
	npcCharacter = await gotPersonGenerator();
	// DISPLAYS CHARACTERS
	displayNPCCombat(npcCharacter);
	displayPlayerCombat(player);

	test.addEventListener("click",async()=>{
		npcCharacter = await gotPersonGenerator();
		displayNPCCombat(npcCharacter);
		disableControls("off");
		console.log(npcCharacter.fullName());
	});

	attackBtn.addEventListener("click", function(){
		gameLogic("attack");
	});
	defendBtn.addEventListener("click", function(){
		gameLogic("defend");
	});
  let insultRequest = await fetch(`https://insult.mattbas.org/api/insult`);
                let insult = await insultRequest.json();
                console.log(insult);



})();

