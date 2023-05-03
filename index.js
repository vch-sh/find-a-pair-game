// 1. DOM 
const header 									= document.querySelector('.header');
const headerTitle 						= document.querySelector('.header__title');
const headerRules 						= document.querySelector('.header__rules');
const headerComplexity				= document.querySelector('.header__complexity');
const headerComplexityOption	= document.querySelectorAll('.header__complexity-option');
const headerButton						= document.querySelector('.header__btn');
const cards 									= document.querySelector('.cards');
const card 										= document.querySelectorAll('.card');
const footer 									= document.querySelector('.footer');
const footerMovesCount 				= document.querySelector('.footer__moves-count');
const minutes									= document.querySelector('.footer__time-minutes');
const seconds									= document.querySelector('.footer__time-seconds');
const restart									= document.querySelector('.restart');
const restartButton						= document.querySelector('.restart__btn');
const footerWin								= document.querySelector('.footer__win');

// 2. Variables 
let smiles = [
	[
		'🚩', '🚩', '😀', '😀', '😜', '😜', '😉', '😉', '⚔️', '⚔️', 
		'🔮', '🔮', '🧐', '🧐', '🎧', '🎧', '💾', '💾', '🌿', '🌿', 
		'🍀', '🍀', '🐬', '🐬', '🍆', '🍆', '🥦', '🥦', '🥳', '🥳', 
	],
	[
		'🎨', '🎨', '🎹', '🎹', '🤭', '🤭', '🍦', '🍦', '😋', '😋', 
		'🌴', '🌴', '🤩', '🤩', '🍒', '🍒', '🍏', '🍏', '🥕', '🥕',
		'🍓', '🍓', '🍇', '🍇', '🍉', '🍉', '🌷', '🌷', '🍅', '🍅'
	],
	[
		'💎', '💎', '🎯', '🎯', '☁️', '☁️', '🎈', '🎈', '☂️', '☂️',
		'🧨', '🧨', '🥪', '🥪', '🚀', '🚀', '☕️', '☕️', '🎼', '🎼',
		'🎲', '🎲', '🎁', '🎁', '🍹', '🍹', '🍭', '🍭', '🎶', '🎶'
	],
	[
		'📘', '📘', '✏️', '✏️', '🎉', '🎉', '🧧', '🧧', '🔍', '🔍',
		'📗', '📗', '📺', '📺', '🪁', '🪁', '📡', '📡', '📚', '📚',
		'📙', '📙', '✔️', '✔️', '💬', '💬', '🎵', '🎵', '❄️', '❄️'
	],
	[
		'🎅', '🎅', '🐟', '🐟', '😎', '😎', '👻', '👻', '🙊', '🙊',
		'🤖', '🤖', '😺', '😺', '👾', '👾', '🦝', '🦝', '🙉', '🙉',
		'🦄', '🦄', '🦔', '🦔', '🌼', '🌼', '🌳', '🌳', '🙈', '🙈'
	],
	[
		'🌸', '🌸', '🗻', '🗻', '⛩️', '⛩️', '🎋', '🎋', '🍣', '🍣',
		'🍡', '🍡', '🍧', '🍧', '🏮', '🏮', '🎴', '🎴', '💮', '💮',
		'㊗️', '㊗️', '🈳', '🈳', '🈶', '🈶', '🈯', '🈯', '🈁', '🈁'
	],
	[
		'👓', '👓', '🌲', '🌲', '🌻', '🌻', '💧', '💧', '🍕', '🍕',
		'🎓', '🎓', '☘️', '☘️', '⭐️', '⭐️', '🦜', '🦜', '🍋', '🍋',
		'👑', '👑', '🌎', '🌎', '⛅️', '⛅️', '🥝', '🥝', '🧁', '🧁'
	]
];

let smileArr = smiles[Math.floor(Math.random() * 7)];

let app = {
	'compare': null,
	'indexArr': [],
	'compareCards': [],
	'complexity': {
		'checked': null
	},
	'moveCounter': 0,
	'correctPairsCounter': 0,
	'winState': false
};

// 3. Default settings
headerRules.classList.add	('hide');
footerWin.classList.add		('hide');
footer.classList.add			('hide');
restart.classList.add			('hide');
if (location.reload) headerComplexityOption.forEach(elem => elem.checked = false);

// 4. Events
headerButton.addEventListener('mousedown', startGame);

card.forEach(card => {
	card.addEventListener('mousedown', rotateCard);
	card.addEventListener('mousedown', compareCardsTextContent);
})

restartButton.addEventListener( 'mousedown', () => setTimeout(() => location.reload(), 500) );

// 4. Main functions
function startGame() {
	headerComplexityOption.forEach(elem => {
		if (elem.checked) app.complexity.checked = +elem.value; 
	})

	if (app.complexity.checked) {
		setTimeout(() => {
			headerTitle.style.marginTop = -30 + 'px';
			headerRules.classList.remove('hide');
			footer.classList.remove('hide');
			setTextContent(app.complexity.checked);
		}, 500)

		setTimeout(() => startTime(), 500)
	}
}

function setTextContent(chosenComplexityNumber) {
	switch(chosenComplexityNumber) {
		case 1:
			smileArr.length = 10;
			shuffle(smileArr);
			card.forEach(elem => showOptions(elem, 10, 540));
			break;
		case 2:
			smileArr.length = 20;
			shuffle(smileArr);
			card.forEach(elem => showOptions(elem, 20, 640));
			break;
		case 3:
			shuffle(smileArr);
			cards.classList.add('cards--active');
			headerComplexity.classList.add('hide');
			headerButton.classList.add('hide');
			break;
	}
}

function rotateCard() {
	this.classList.add('card-rotation');
	this.lastElementChild.textContent = smileArr[this.dataset.position];
	app.indexArr.push(this.dataset.position);
	this.classList.add('disabled');
}

function compareCardsTextContent(e) {
	app.compareCards.push(e.currentTarget.lastElementChild);

	if (checkLength(app.indexArr)) {
		app.compare = compareTextContent(app.compareCards);
		footerMovesCount.textContent = ++app.moveCounter;
	}

	if (!app.compare && checkLength(app.indexArr)) {
		setTimeout( () => {
			app.compareCards[0].parentElement.classList.remove('card-rotation');
			app.compareCards[1].parentElement.classList.remove('card-rotation');
			app.compareCards[0].parentElement.classList.remove('disabled');
			app.compareCards[1].parentElement.classList.remove('disabled');
			cleanArrs(app.indexArr, app.compareCards);
		}, 450)
	} else {
		if (checkLength(app.indexArr)) {
			++app.correctPairsCounter;
			setTimeout( () => {
				new Audio('/sounds/correct-pair.mp3').play();
				app.compareCards[0].parentElement.classList.add('succesfullyCompared');
				app.compareCards[1].parentElement.classList.add('succesfullyCompared');
				cleanArrs(app.indexArr, app.compareCards);
			}, 200)
		}
	}
	isWin(app.complexity.checked, app.correctPairsCounter)
}

function isWin(complexityNumber, correctPairsCounter) {
	if (complexityNumber === 1 && correctPairsCounter === 5) implementWinState();
	if (complexityNumber === 2 && correctPairsCounter === 10) implementWinState();
	if (complexityNumber === 3 && correctPairsCounter === 15) implementWinState();
}

// 5. Additional functions
function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
	  let j = Math.floor(Math.random() * (i + 1));
	  [array[i], array[j]] = [array[j], array[i]];
	}
}
 
function checkLength(arr) {
	return arr.length === 2;
}

function compareTextContent(arr) {
	return arr[0].textContent === arr[1].textContent;
}

function cleanArrs(arr1, arr2) {
	return arr1.length = 0, arr2.length = 0;
}

function startTime() {
	let timerId = setInterval(() => {
		seconds.textContent++;
		if (seconds.textContent < 10) seconds.textContent = '0' + seconds.textContent;
		if (seconds.textContent >= 60) {
			seconds.textContent = '0' + 0;
			minutes.textContent++;
			if (minutes.textContent < 10) minutes.textContent = '0' + minutes.textContent;
		}
		if (app.winState) clearInterval(timerId);
	}, 1000)
}

function showOptions(cardElement, positionNumber, width) {
	if (cardElement.dataset.position >= positionNumber) {
		cardElement.classList.add('hide');
		headerComplexity.classList.add('hide');
		headerButton.classList.add('hide');
		cards.style.width = width + 'px';
		cards.classList.add('cards--active');
	}
}

function implementWinState() {
	app.winState = true;
	if (app.winState) {
		setTimeout(() => {
			cards.classList.add('hide');
			headerRules.classList.add('hide');
			footerWin.classList.remove('hide');
			footer.classList.add('footer-end-game');

			setTimeout(() => {
				new Audio('/sounds/win.mp3').play();
				headerTitle.style.marginTop = -75 + 'px';
			}, 500)

			restart.classList.remove('hide');
		}, 500)
	}
}