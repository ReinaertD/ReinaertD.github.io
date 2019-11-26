let play = document.getElementById("playButton");	
let male = document.getElementById("male");
let female = document.getElementById("female");
let unsullied = document.getElementById("unsullied");
// 
female.addEventListener("click", function(){
	female.parentNode.setAttribute("class", "btn btn-info active");	
	male.parentNode.classList.remove("active");
	unsullied.parentNode.classList.remove("active");
	female.checked = true;
	male.checked = false;
	unsullied.checked = false;
})

male.addEventListener("click", function(){
	male.parentNode.setAttribute("class", "btn btn-info active");
	female.parentNode.classList.remove("active");
	unsullied.parentNode.classList.remove("active");
	male.checked = true;
	female.checked = false;
	unsullied.checked = false;
})

unsullied.addEventListener("click", function(){
	unsullied.parentNode.setAttribute("class", "btn btn-info active");
	female.parentNode.classList.remove("active");
	male.parentNode.classList.remove("active");
	female.checked = false;
	male.checked = false;
	unsullied.checked = true;
})

function playerData(){
	// TAKES INPUT FROM FORM
	let Login = document.getElementById("playerLogin").value;
	let gender = document.querySelector('input[name="genderOptions"]:checked').value;
	console.log(gender);
	// STORES THE SETTINGS LOCALLY! Should be sessionstorage instead?
	localStorage.setItem("playerLogin", Login);
	localStorage.setItem("playerGender", gender);
}

play.addEventListener("click", function(){
	if(document.querySelector('input[name="genderOptions"]:checked') === null || document.getElementById("playerLogin").value === ""){
		console.log(document.querySelector('input[name="genderOptions"]:checked').value)
		if(document.getElementById("playerLogin").value === ""){
			console.log("empty Login")
			document.getElementById("playerLogin").classLogin += " " + "border-danger";
		} else if(document.querySelector('input[name="genderOptions"]:checked') === null){
			console.log("empty gender")
		} else { console.log("error at verification")}
	} else{
	playerData();	
	window.location.href = "game.html";
	}
	
	
})

