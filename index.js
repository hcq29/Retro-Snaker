var width = 20; //设置区域的宽高
var random = -1; //糖果的位置
var n = 188;  //蛇开始出现的位置
var time = 250; //蛇的速度/ms 
var t = 3; //蛇长为3个小正方形 
var queue = []; //存放蛇的路径 
var size = 20; //上和下相差的数
var directionN = 2; // 1 向上 2 向右 3向下  0 向左 
var direction = 'rigth';  //改变蛇头样式
var gameOver = false;  //判断是否游戏结束
var flashingTimer = null; //游戏结束后的蛇闪动定时器
var start = document.getElementById('start');
var main = document.getElementById('main');
var select = document.getElementById('select');
var choose = document.getElementById('choose');
var btns = document.getElementById('btns');

// 事件集中器
var EventUtil = {
    addHandler: function (element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    },
    getEvent: function (event) {
        return event ? event : window.event;
    },
    getTarget: function (event) {
        return event.target || event.srcElement;
    },
};

EventUtil.addHandler(btns, "click", function (event) {
    let target = EventUtil.getTarget(event);
    switch (target.id) {
        case "up": if (directionN != 3) { directionN = 1; direction = 'top'; } break;//上 
        case "right": if (directionN != 0) { directionN = 2; direction = 'rigth'; } break;//右 
        case "left": if (directionN != 2) { directionN = 0; direction = 'left'; } break;//下 
        case "down": if (directionN != 1) { directionN = 3; direction = 'bottom'; } break;//左 
    }
})

select.onchange = function (e) {
    switch (select.value) {
        case 'slow': time = 250; break;
        case 'mid': time = 200; break;
        case 'fast': time = 100; break;
    }
}

// 这里监听键盘的上下左右键，让蛇的方向做出相应的改变
document.onkeydown = function (e) {
    var keycode = e.keyCode - 37;
    switch (keycode) {
        case 1: if (directionN != 3) { directionN = 1; direction = 'top'; } break;//上 
        case 2: if (directionN != 0) { directionN = 2; direction = 'rigth'; } break;//右 
        case 3: if (directionN != 1) { directionN = 3; direction = 'bottom'; } break;//下 
        case 0: if (directionN != 2) { directionN = 0; direction = 'left'; } break;//左 
    }
}

// 定时器设置
start.onclick = function () {
    if (flashingTimer) clearInterval(flashingTimer);
    if (main.hasChildNodes()) main.innerHTML = "";
    // 添加width*width个div
    for (var i = 0; i < width * width; i++) {
        var div = document.createElement('div');
        div.setAttribute("class", "frame");
        main.appendChild(div);
    }

    width = 20;
    random = -1; //糖果的位置
    n = 188;
    t = 3; //蛇长为3个小正方形 
    queue = []; //存放蛇的路径 
    size = 20; //上和下相差的数
    directionN = 2; // 1 向上 2 向右 3向下  0 向左 
    direction = 'rigth';  //改变蛇头样式
    gameOver = false;  //判断是否游戏结束
    interval = window.setInterval(snakeClimb, time); // 蛇爬动 
    candy(); // 产生随机糖果
    this.hidden = true;
    choose.hidden = true;
}

var frame = document.getElementsByClassName('frame');

function snakeClimb() {
    // 撞到左边的墙了
    if (queue[queue.length - 1] && queue[queue.length - 1] % 20 == 0 && directionN == 0) {
        clearInterval(interval);
        gameOver = true;
        console.log("游戏结束！你碰壁了");
    }
    // 撞到右边的墙了
    if (queue[queue.length - 1] && (queue[queue.length - 1] + 1) % 20 == 0 && directionN == 2) {
        clearInterval(interval);
        gameOver = true;
        console.log("游戏结束！你碰壁了");
    }

    // 当传进来的方向数字不同时，就会改变n 的值，将蛇递增或者是递减的间隔
    switch (directionN) {
        case 1: n = n - size; break;
        case 2: n = n + 1; break;
        case 3: n = n + size; break;
        case 0: n = n - 1; break;
    }

    // 如果超过墙外 ，说明撞墙了
    // 这里首先判断的是上下的，左右还没有设置
    if (n >= 400 || n < 0) {
        clearInterval(interval);
        gameOver = true;
        console.log("游戏结束！你碰壁了");
    }

    // 遍历队列中所有的元素，如果有元素相同，则是撞到自己了
    for (var i = 0; i < queue.length - 1; i++) {
        if (parseInt(queue[i]) == n) {
            clearInterval(interval);
            gameOver = true;
            console.log("游戏结束！你撞到自己了");
        }
    }

    // 如果游戏未结束，蛇继续爬动
    if (!gameOver) {
        if (queue.length >= t) {
            var clear = queue.shift(); //删除数组第一项，并且返回原元素 
            frame[clear].className = 'frame';  //取消蛇的样式
        };
        queue.push(n); //将数据添加到原数组尾部 
        // 设置蛇的样式
        for (var i = 0; i < queue.length; i++) {
            if (i != 0 && i != queue.length - 1) {
                frame[queue[i]].className = 'frame bodys';
            }
            // 默认添加的样式，这里是颜色
            frame[queue[0]].className = 'frame foot' + ' ';
            var classList = frame[queue[0]].classList;
            // 添加四个不同方向的尾巴样式
            if (queue[0] && queue[1]) {
                if (queue[0] + 1 == queue[1]) classList.add('rightFoot');
                if (queue[0] == queue[1] + 1) classList.add('leftFoot');
                if (queue[0] == queue[1] + size) classList.add('topFoot');
                if (queue[0] + size == queue[1]) classList.add('bottomFoot');
            }
            // 改变转折的样式，表现为弧形
            if (queue[i - 1] && queue[i] && queue[i + 1]) {
                if ((queue[i - 1] + 1 == queue[i] &&
                    queue[i] == queue[i + 1] + size) ||
                    (queue[i] - 1 == queue[i + 1] &&
                        queue[i - 1] + size == queue[i]))
                    frame[queue[i]].classList.add('rturnUp');
                if ((queue[i - 1] - 1 == queue[i] &&
                    queue[i] == queue[i + 1] - size) ||
                    (queue[i] == queue[i + 1] - 1 &&
                        queue[i - 1] == queue[i] + size))
                    frame[queue[i]].classList.add('lturnbottom');
                if ((queue[i - 1] == queue[i] - 1 &&
                    queue[i] + size == queue[i + 1]) ||
                    (queue[i] == queue[i - 1] - size &&
                        queue[i + 1] + 1 == queue[i]))
                    frame[queue[i]].classList.add('rturnbottom');
                if ((queue[i - 1] == queue[i] - size &&
                    queue[i] == queue[i + 1] - 1) ||
                    (queue[i] == queue[i - 1] - 1 &&
                        queue[i + 1] == queue[i] - size))
                    frame[queue[i]].classList.add('lturnUp');
            }
            frame[queue[queue.length - 1]].className = 'frame head' + ' ' + direction + 'Head';
        }

        //蛇吃糖果
        if (queue.indexOf(random) != -1) {
            candy();
            t++;
        }
    } else {
        // 游戏结束，蛇闪烁

        start.hidden = false;
        choose.hidden = false;

        var opacityFlag = 0;
        changeOpacity = function () {
            if (!opacityFlag) {
                opacityFlag = 1;
                for (var i = 0; i < queue.length; i++) {
                    frame[queue[i]].style.opacity = 0;
                }
            } else {
                opacityFlag = 0;
                for (var i = 0; i < queue.length; i++) {
                    frame[queue[i]].style.opacity = 1;
                }
            }
        }
        flashingTimer = window.setInterval(changeOpacity, 200);
    }

}

// 这里产生一个随机数，确定糖果的位置
function candy() {
    var div = document.getElementsByClassName('frame');
    if (random != -1) div[random].style.background = '';
    random = Math.floor(Math.random() * width * width + 1);
    if (div[random] != 'frame') div[random].style.background = 'rgb(219, 103, 103)';
}