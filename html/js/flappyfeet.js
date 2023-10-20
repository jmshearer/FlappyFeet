
curJoyY = 0.0;

window.addEventListener("gamepadconnected", function(e) {
    console.log("Gamepad connected!", e.gamepad);
    // Start checking the joystick position
    requestAnimationFrame(updateJoystick);
});

window.addEventListener("gamepaddisconnected", function(e) {
    console.log("Gamepad disconnected!", e.gamepad);
});

function updateJoystick() {
    var gamepadList = navigator.getGamepads();

    if (gamepadList[0]) {
        // Assuming the first gamepad is the one you're interested in.
        // Axis 1 is typically the y-position of the left thumbstick
        var yPosition = gamepadList[0].axes[1];
        curJoyY = yPosition;
        const canvas = document.getElementById('flappyCanvas');
        //bird.y = canvas.height * yPosition + .5;
        //document.getElementById("out").innerHTML = yPosition.toFixed(0);
        console.log("Joystick Y Position:", yPosition.toFixed(0));

        // If yPosition is 0, the joystick is centered. 
        // Negative values indicate up, positive values indicate down.
    }

    // Keep updating as long as the gamepad is connected
    requestAnimationFrame(updateJoystick);
}

    const canvas = document.getElementById('flappyCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    let bird = {
        x: canvas.width / 5,
        y: canvas.height / 2,
        size: 20,
        dx: 0,
        dy: 0,
        speed: 4
    };

    let pipes = [];
    let score = 0;
    const pipeWidth = 50;
    const gapHeight = 300;
    let pipeGap = 280;  // You can adjust this value for the desired gap between pipes.
		
		const sprite = new Image();
		sprite.src = "assets/sprites.png";

    function drawBird() {
        //ctx.fillStyle = 'yellow';
        //ctx.beginPath();
        //ctx.arc(bird.x, bird.y, bird.size, 0, Math.PI * 2);
        //ctx.closePath();
        //ctx.fill();
				ctx.drawImage(sprite, 2, 490, 19, 14, bird.x,bird.y,60, 60);
    }

		var parallax = 0;
    function drawPipes() {
			var sScale = 256 / canvas.height;
			console.log(parallax);
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
												           						
						ctx.drawImage(sprite, 55, 323, 28, 160, pipe.x, 0, pipeWidth, pipe.top);            						
						ctx.drawImage(sprite, 84, 323, 27, 160, pipe.x, pipe.top + gapHeight, pipeWidth,  canvas.height - pipe.top - gapHeight);					
					

        });
    }

    function movePipes() {
        pipes.forEach(pipe => {
            pipe.x -= 2;
        });
        
        if (pipes[0] && pipes[0].x < bird.x && !pipes[0].counted) {
            pipes[0].counted=true;
            score++;
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
                flashScreen();																
                resetGame();
            }
        }

        if (bird.y + bird.size >= canvas.height || bird.y - bird.size <= 0 || bird.x - bird.size <= 0 || bird.x + bird.size >= canvas.width) {				
            flashScreen();						
            resetGame();
        }
    }

    function flashScreen() {
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function resetGame() {
        bird.x = canvas.width / 5;
        bird.y = canvas.height / 2;
        pipes = [];
        score = 0;
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        bird.x += bird.dx;
        bird.y += bird.dy;
        bird.y = canvas.height * (curJoyY + 0.5);
        
        if(bird.y<50){
            bird.y = 50;
        }
        if(bird.y>canvas.height-50){
            bird.y = canvas.height-50;
        }

        drawPipes();
        movePipes();
        drawBird();
        checkCollisions();

        ctx.fillStyle = 'black';
        ctx.font = '24px Arial';
        ctx.fillText('Score: ' + score, 10, 30);

        requestAnimationFrame(update);
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowUp' || e.keyCode === 38) {
            bird.dy = -bird.speed;
        }
        if (e.key === 'ArrowDown' || e.keyCode === 40) {
            bird.dy = bird.speed;
        }
        if (e.key === 'ArrowLeft' || e.keyCode === 37) {
            bird.dx = -bird.speed;
        }
        if (e.key === 'ArrowRight' || e.keyCode === 39) {
            bird.dx = bird.speed;
        }
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
