class AudioController{
	constructor() {
	  this.bgMusic = new Audio('music/bg-2.mp3');
	  this.flipSound = new Audio('music/flip.wav');
	  this.matchSound = new Audio('music/match.wav');
	  this.victorySound = new Audio('music/victory.wav');
	  this.gameOverSound = new Audio('music/gameover.wav');
	  this.bgMusic.volume = 0.2;
	  this.bgMusic.loop = true;
	}
	startMusic() {
		this.bgMusic.play();
	}
	stopMusic() {
		this.bgMusic.pause();
		this.bgMusic.currentTime = 0;
	}
	flip() {
		this.flipSound.play();
	}
	match() {
		this.matchSound.play();
	}
	victory() {
		this.stopMusic();
		this.victorySound.play();
	}
	gameOver() {
		this.stopMusic();
		this.gameOverSound.play();
	}
}

class FlipNMatch {
	constructor(totalTime, cards) {
	  this.cardsArray = cards;
	  this.totalTime = totalTime;
	  this.timeRemaining = totalTime;
	  this.timer = document.getElementById('timeCount');
	  this.ticker = document.getElementById('flipCount');
	  this.audioController = new AudioController();
	}
	startGame() {
		this.cardToCheck = null;
		this.totalClicks = 24;
		this.timeRemaining = this.totalTime;
		this.matchedCards = [];
		this.busy = true;
		
		setTimeout(() => {
			this.audioController.startMusic();
			this.shuffleCards();
			this.countdown = this.startCountdown();
       		this.busy = false;
		}, 1000);
		this.hideCards();
		this.timer.innerText = this.timeRemaining;
		this.ticker.innerText = this.totalClicks;
	}
	hideCards() {
		this.cardsArray.forEach(card => {
			card.classList.remove('visible');
			card.classList.remove('matched');
		});
	}
	flipCard(card) {
		if(this.canFlipCard(card)) {
			this.totalClicks--;
			this.audioController.flip();
			this.ticker.innerHTML = this.totalClicks;
			if(this.totalClicks === 0) {
				this.gameOver();
			}
			card.classList.add('visible');
			if(this.cardToCheck) {
				this.checkForCardMatch(card);
			} else {
				this.cardToCheck = card;
			}
			
		}
	}
	checkForCardMatch(card) {
		if(this.getCardType(card) === this.getCardType(this.cardToCheck)) {
			this.cardMatch(card, this.cardToCheck);
		} else {
			this.cardMismatch(card, this.cardToCheck);
		}
		this.cardToCheck = null;
	}
	cardMatch(card1, card2) {
		this.matchedCards.push(card1);
		this.matchedCards.push(card2);
		card1.classList.add('matched');
		card2.classList.add('matched');
		this.audioController.match();
		if(this.matchedCards.length === this.cardsArray.length) {
			this.victory();
		}
	}
	cardMismatch(card1, card2) {
		this.busy = true;
		setTimeout(() => {
			card1.classList.remove('visible');
			card2.classList.remove('visible');
			this.busy = false;
		}, 1000);
	}
	getCardType(card) {
		return card.getElementsByClassName('front')[0].src;
	}
	startCountdown() {
		return setInterval(() => {
			this.timeRemaining--;
			this.timer.innerText = this.timeRemaining;
			if(this.timeRemaining === 0) {
				this.gameOver();
			}
		}, 1000);
	}
	victory() {
		setInterval(this.countdown);
		this.audioController.victory();
		document.getElementById('victory').classList.add('visible');
		hideCards();
	}
	gameOver() {
		clearInterval(this.countdown);
		this.audioController.gameOver();
		document.getElementById('game-over').classList.add('visible');
		hideCards();
	}
	shuffleCards() {
		for(let i = this.cardsArray.length-1; i > 0; i--) {
			let randIndex = Math.floor(Math.random() * (i+1));
			this.cardsArray[randIndex].style.order = i;
			this.cardsArray[i].style.order = randIndex;
		}
	}
	canFlipCard(card) {
		
		return(!this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck);
	}
}

function ready() {
	let overlays = Array.from(document.getElementsByClassName('overlay'));
	let cards = Array.from(document.getElementsByClassName('card'));
	let game = new FlipNMatch(60, cards);

	overlays.forEach(overlay => {
		overlay.addEventListener('click', () => {
			overlay.classList.remove('visible');
			game.startGame();
			
		});
	}); 
	cards.forEach(card => {
		card.addEventListener('click', () => {
			game.flipCard(card);		
		});
	});
}

if(document.readyState === "loading") {
	document.addEventListener('DOMContentLoaded', ready());
} else {
	ready();
}
