
curJoyY = 0.0;

speed = 2;

window.addEventListener("gamepadconnected", function(e) {
    console.log("Gamepad connected!", e.gamepad);
    // Start checking the joystick position
    requestAnimationFrame(updateJoystick);
});

window.addEventListener("gamepaddisconnected", function(e) {
    console.log("Gamepad disconnected!", e.gamepad);
});

gamepadPresent=false;
inhibitUpdates=false;

var curDifficulty=1;

function changeDifficulty(harder){
    if(harder){
        curDifficulty++;
    }else {
        curDifficulty--;
    }
    if(curDifficulty<1)
        curDifficulty=1;
    if(curDifficulty>5)
        curDifficulty=5;
    difficulty(curDifficulty);
}

function difficulty(requestedDifficulty){
    curDifficulty=requestedDifficulty;     
    gapHeight=300;  
    speed=2;
    pipeGap=640;
     
    switch(curDifficulty){
        case 1:
            break;
        case 2:
            pipeGap=320;
            break;
        case 3:
            speed=4;
            pipeGap=320;
            break;
        case 4:
            speed=6;
            pipeGap=320;
            break;
        case 5:
            speed=6;
            pipeGap=320;
            gapHeight=200;
            break;
        
    }
    
    updateInfo();
}



function updateJoystick() {
    var gamepadList = navigator.getGamepads();

    if (gamepadList[0]) {			
        // Assuming the first gamepad is the one you're interested in.
        // Axis 1 is typically the y-position of the left thumbstick
        var yPosition = gamepadList[0].axes[1];
        
        curJoyY = yPosition;
        const canvas = document.getElementById('flappyCanvas');
				gamepadPresent=true;
        //bird.y = canvas.height * yPosition + .5;
        //document.getElementById("out").innerHTML = yPosition.toFixed(0);
        //console.log("Joystick Y Position:", yPosition.toFixed(0));

        // If yPosition is 0, the joystick is centered. 
        // Negative values indicate up, positive values indicate down.
    } else {
			gamepadPresent=false;
		}

    // Keep updating as long as the gamepad is connected
    requestAnimationFrame(updateJoystick);
}

    const canvas = document.getElementById('flappyCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
		
		const rect = flappyCanvas.getBoundingClientRect();

		// Create a new transparent canvas
		const overlayCanvas = document.createElement('canvas');
		overlayCanvas.width = flappyCanvas.width;
		overlayCanvas.height = flappyCanvas.height;

		// Set styles to position the new canvas directly on top of the existing one
		overlayCanvas.style.position = 'absolute';
		overlayCanvas.style.top = rect.top + 'px';
		overlayCanvas.style.left = rect.left + 'px';
		overlayCanvas.style.pointerEvents = 'none';  // To allow clicks to pass through to the underlying canvas		
		overlayCanvas.style.background="transparent";

		// Append the new canvas to the body
		document.body.appendChild(overlayCanvas);

		// Get the context and optionally draw or cl
		
						
		var myConfetti = confetti.create(overlayCanvas, {
		  resize: true,			
		  useWorker: true
		});

    let bird = {
        x: canvas.width / 5,
        y: canvas.height / 2,
        size: 40,
        dx: 0,
        dy: 0,
        speed: 4
    };

    let pipes = [];
    let score = 0;
    let pipesPassed=0;
    const pipeWidth = 75;
    let gapHeight = 300;
    let pipeGap = 640;  // You can adjust this value for the desired gap between pipes.
		
		const sprite = new Image();
		sprite.src = "assets/sprites.png";

		spriteSeq=0;

    function drawBird() {
		
	        /*ctx.fillStyle = 'yellow';
      ctx.beginPath();
      ctx.arc(bird.x, bird.y, bird.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();*/
			
			drawSize = bird.size * 1.25;
				
			spriteSeq+=20;
			//spriteSeq=310;
			if(spriteSeq<100){
				ctx.drawImage(sprite, 218, 299, 78, 78, bird.x-drawSize,bird.y-drawSize,drawSize*2, drawSize*2);
			}else if(spriteSeq<200){
				ctx.drawImage(sprite, 220, 435, 78, 78, bird.x-drawSize,bird.y-drawSize,drawSize*2, drawSize*2);
			}else if(spriteSeq<300){
				ctx.drawImage(sprite, 220, 369, 78, 78, bird.x-drawSize,bird.y-drawSize,drawSize*2, drawSize*2);
			}else if(spriteSeq<400){
				ctx.drawImage(sprite, 220, 435, 78, 78, bird.x-drawSize,bird.y-drawSize,drawSize*2, drawSize*2);	
			}else{
				ctx.drawImage(sprite, 218, 299, 78, 78, bird.x-drawSize,bird.y-drawSize,drawSize*2, drawSize*2);
				spriteSeq=0;				
			}
			//ctx.drawImage(sprite, 220, 369, 78, 78, bird.x-bird.size,bird.y-bird.size,bird.size*2, bird.size*2);
				

				//ctx.drawImage(sprite, 2, 490, 19, 14, bird.x-bird.size,bird.y-bird.size,bird.size*2, bird.size*2);
    }

		var parallax = 0;
    function drawPipes() {
			var sScale = 256 / canvas.height;			
			parallax-=1;
			if(parallax<=-Math.round(143/sScale)){
				parallax=0;
			}
			var x=parallax;			
			while(x < canvas.width){
				ctx.drawImage(sprite, 0, 0, 143, 256, x,0,Math.round(143/sScale), canvas.height);
				x+= Math.round(143/sScale);
			}
			 
        pipes.forEach(pipe => {
            //ctx.fillStyle = 'green';
						//ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
						//ctx.fillRect(pipe.x, pipe.top + gapHeight, pipeWidth, canvas.height - pipe.top - gapHeight);
						var sScale = 27 / pipeWidth;
												           						
						ctx.drawImage(sprite, 55, 323, 28, 140, pipe.x, 0, pipeWidth, pipe.top);
						ctx.drawImage(sprite, 55, 463, 28, 20, pipe.x, pipe.top-20, pipeWidth, 20/sScale);											
						//ctx.drawImage(sprite, 55, 323, 28, 160, pipe.x, 0, pipeWidth, pipe.top);
						            						
						//ctx.drawImage(sprite, 84, 323, 27, 160, pipe.x, pipe.top + gapHeight, pipeWidth,  canvas.height - pipe.top - gapHeight);
						 						
						ctx.drawImage(sprite, 84, 343, 27, 120, pipe.x, pipe.top + gapHeight, pipeWidth,  canvas.height - pipe.top - gapHeight);
						ctx.drawImage(sprite, 84, 323, 27, 20, pipe.x, pipe.top + gapHeight, pipeWidth,  20 / sScale);					
					

        });
    }
    
    function updateInfo(){
        document.getElementById("info").innerHTML ="Difficulty: " + curDifficulty + "<br />FlappyFeet<br />github.com/jmshearer/FlappyFeet";
    }
    
    updateInfo();

    function movePipes() {
        pipes.forEach(pipe => {
            pipe.x -= speed;
        });
        
        if (pipes[0] && pipes[0].x < bird.x && !pipes[0].counted) {
            pipes[0].counted=true;
					
                    pipesPassed++;
					score += curDifficulty;
					
					document.getElementById("score").classList.add("pop-animation");
					setTimeout(() => {
						document.getElementById("score").classList.remove("pop-animation");	
					}, 400);
					
					if(pipesPassed % 5 == 0){																
						myConfetti({
						  particleCount: 100,
						  spread: 160,						
							colors: ['#ff0000', '#ffffff', '#000000'], //, 'white', 'black'],																  
						});
					}
					
          
        }

        if (pipes[0] && pipes[0].x <= -pipeWidth) {
            pipes.shift();
        }

        if (pipes.length === 0 || pipes[pipes.length - 1].x <= canvas.width - pipeGap) {
            const top = Math.random() * (canvas.height - gapHeight - 40) + 20;
            pipes.push({ x: canvas.width, top, counted: false });
        }
    }

    function checkCollisions() {
        for (let pipe of pipes) {
            if (
                bird.x + bird.size > pipe.x && bird.x - bird.size < pipe.x + pipeWidth &&
                (bird.y - bird.size < pipe.top || bird.y + bird.size > pipe.top + gapHeight)
            ) {						
                gameOver();
            }
        }

        if (bird.y + bird.size >= canvas.height || bird.y - bird.size <= 0 || bird.x - bird.size <= 0 || bird.x + bird.size >= canvas.width) {				
            gameOver();
        }
    }
		
		function gameOver(){
			flashScreen();
			inhibitUpdates=true;
			setTimeout(function(){
				inhibitUpdates=false;			
      	resetGame();
			},2000);
		}

    function flashScreen() {
        ctx.fillStyle = "rgba(255,0,0,.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(sprite, 391, 58, 101, 26, canvas.width/2-200, canvas.height/2-50, 400, 100);
    }

    function resetGame() {
        bird.x = canvas.width / 5;
        bird.y = canvas.height / 2;
        pipes = [];
        score = 0;
        difficulty(1);
    }

    function update() {
			if(!inhibitUpdates){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
                
				if(gamepadPresent){
        	bird.y = canvas.height * (curJoyY + 0.5);					
				} else {
					bird.x += bird.dx;
	        bird.y += bird.dy;
				}
        
        if(bird.y<bird.size*1.1){
            bird.y = bird.size*1.1;
        }
        if(bird.y>canvas.height-bird.size*1.1){
            bird.y = canvas.height-bird.size*1.1;
        }
				
        drawPipes();
        movePipes();
        drawBird();
        checkCollisions();

        //ctx.fillStyle = 'black';
        //ctx.font = '24px Arial';
        //ctx.fillText('Score: ' + score, 10, 30);
				
				const scoreDiv = document.getElementById('score');
				scoreDiv.innerHTML = score;
					
			}
			
    	requestAnimationFrame(update);
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowUp' || e.keyCode === 38) {
            bird.dy = -bird.speed;
        }
        if (e.key === 'ArrowDown' || e.keyCode === 40) {
            bird.dy = bird.speed;
        }
        /*if (e.key === 'ArrowLeft' || e.keyCode === 37) {
            bird.dx = -bird.speed;
        }
        if (e.key === 'ArrowRight' || e.keyCode === 39) {
            bird.dx = bird.speed;
        }*/
    });

    document.addEventListener('keyup', function(e) {
        if (e.key === 'ArrowUp' || e.keyCode === 38) {
            bird.dy = 0;
        }
        if (e.key === 'ArrowDown' || e.keyCode === 40) {
            bird.dy = 0;
        }
        if (e.key === 'ArrowLeft' || e.keyCode === 37) {
            bird.dx = 0;
        }
        if (e.key === 'ArrowRight' || e.keyCode === 39) {
            bird.dx = 0;
        }
    });

    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    update();
