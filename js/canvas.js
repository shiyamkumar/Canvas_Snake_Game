$(function(){
    var elem=document.getElementById("my-canvas");
    var ctx=elem.getContext("2d");
    var leftPos;
    var topPos;
    var preyLeftPos;
    var preyTopPos;
    var hitCount;
    var canvasWidth = 300;
    var canvasHeight = 150;
    var isKeyPressed = false;
    var timerCount;
    var snakeHeadColor = "#0000FF";
    var snakeTailColor = "#FF0000";
    var preyColor = "#ffffff";
    var bgColor = "#000000";
    var timer;
    var snakeTailArr = [];
    var recentTailPos;
    var moveSnakeTimer;
    var moveSnakeTime = 200;
    var lastPressedKey = 39;
    gameInit();
    function gameInit(){
        timerCount = 300;
        $(".timeCount").text("00:"+timerCount);
        hitCount = 0;
        leftPos = topPos = 10;
        preyLeftPos = preyTopPos = 40;
        ctx.clearRect(0,0,canvasWidth,canvasHeight);
        ctx.fillStyle = snakeHeadColor;
        ctx.fillRect(leftPos,topPos,10,10);
        createPrey();
    }
    function createPrey(){
        ctx.fillStyle = preyColor;
        ctx.fillRect(preyLeftPos,preyTopPos,10,10);
    }

    $("#my-canvas").bind({
        keydown: function(e) {
            if( !isKeyPressed ){
                isKeyPressed = true;
                startGame();
            }
            if( !(e.keyCode == 37 && lastPressedKey == 39) &&
                !(e.keyCode == 39 && lastPressedKey == 37) &&
                !(e.keyCode == 38 && lastPressedKey == 40) &&
                !(e.keyCode == 40 && lastPressedKey == 38)
            ){
                lastPressedKey = e.keyCode;
                clearInterval(moveSnakeTimer);
                moveSnake();
                moveSnakeTimer = setInterval(function(){
                    moveSnake();
                },moveSnakeTime);
            }
            e.preventDefault();
        },
        focusin: function(e) {
            isKeyPressed = false;
        },
        focusout: function(e) {
            clearInterval(timer);
            clearInterval(moveSnakeTimer);
        }
    }).focus();

    function moveSnake() {
        var key = lastPressedKey;
        recentTailPos = {"leftPos": leftPos, "topPos": topPos};
        switch( key ){
            case 37:
                leftPos = (leftPos-10) < 0 ? canvasWidth-10 : leftPos-10;
                break;
            case 38:
                topPos =  (topPos-10) < 0 ? canvasHeight-10 : topPos-10;
                break;
            case 39:
                leftPos = (leftPos+10) > (canvasWidth-10) ? 0 : leftPos+10;
                break;
            case 40:
                topPos = (topPos+10) > (canvasHeight-10) ? 0 : topPos+10;
                break;
        }
        ctx.fillStyle = snakeHeadColor;
        ctx.fillRect(leftPos,topPos,10,10);
        if( leftPos == preyLeftPos && topPos == preyTopPos  ){
            scoreGame();
        }
        else if( !(recentTailPos.leftPos == leftPos && recentTailPos.topPos == topPos) ){ // stop clearing if no change in position (happens when other key pressed)
            ctx.clearRect(recentTailPos.leftPos, recentTailPos.topPos,10,10);
        }
        //move tail starts
        if( !(recentTailPos.leftPos == leftPos && recentTailPos.topPos == topPos) ){ // stop clearing if no change in position (happens when other key pressed)
            var tailLength = snakeTailArr.length;
            if( tailLength ){
                ctx.clearRect(snakeTailArr[tailLength-1].leftPos,snakeTailArr[tailLength-1].topPos,10,10); // clear last tail position
                ctx.fillStyle = snakeTailColor;
                ctx.fillRect(recentTailPos.leftPos, recentTailPos.topPos,10,10); // draw tail in recent head position
                // Update snakeTailArr Array
                // Insert recent head position in first of array
                // Delete Last array (First - IN / Last - OUT)
                var prevTailVal;
                snakeTailArr.forEach(function(val, index){
                    snakeTailArr[index] = prevTailVal || recentTailPos;
                    prevTailVal = val;
                });
            }
        }
        //move tail ends
        //IF head colloid with the Tail
        if( snakeTailArr.filter(isCollisionPos).length ){
            endGame();
        }
    }

    function getRandomInt(min, max) {
        var randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        var remainderNum = randomNum % 10;
        return randomNum-remainderNum;
    }
    function startGame() {
        timer = setInterval(function(){
            timerCount--;
            var timeVal = String(timerCount).length == 1 ? "0"+timerCount : timerCount ;
            if( timerCount === 0 ){
                $(".timeCount").text("00:00");
                endGame();
            }else{
                $(".timeCount").text("00:"+timeVal);
            }
        },1000);
    }
    function endGame() {
        clearInterval(timer);
        alert("Your score is "+hitCount+" !!! Ready for another round");
        resetGame();
    }
    function resetGame() {
        $(".hitCount").text("0");
        $(".timeCount").text("00:30");
        isKeyPressed = false;
        snakeTailArr = [];
        gameInit();
    }
    function scoreGame() {
        snakeTailArr.push( recentTailPos );
        //restrict prey to come in place of tail
        getRandomPos();
        var i = 0;
        while( snakeTailArr.filter(isTailPos).length || i == 30){
            getRandomPos();
            i++
        }
        createPrey();
        hitCount++;
        $(".hitCount").text(hitCount);
    }
    function getRandomPos() {
        preyLeftPos = getRandomInt(0, canvasWidth-10);
        preyTopPos = getRandomInt(0, canvasHeight-10);
    }
    function isTailPos(value) {
        return ( value.leftPos == preyLeftPos && value.topPos == preyTopPos );
    }
    function isCollisionPos(value) {
        return ( value.leftPos == leftPos && value.topPos == topPos );
    }
});