const paint = {
    canvas: document.getElementById('paint-canvas'),
    active: true,
    speed: 75,
    colors: ['240,240,240', '0,166,255', '115,0,255', '7,235,178', '10,10,10'],
    dripCheck: function() {
        if (paint.proximityIntensity > paint.drops.length) {
          if (Math.random() < 0.02) paint.drip();
        }
    },
    proximityIntensity: 0,
    getProximityIntensity: function() {
        this.proximityIntensity = Math.ceil(window.innerWidth / 200);
    },
    drops: [],
    drip: function() {
        this.drops.push({
          x: Math.floor(Math.random() * 300 + window.innerWidth / 2 - 150 ),
          y: 0,
          c: paint.colors[Math.floor(Math.random() * paint.colors.length)],
          r: 3,
          v: parseFloat((Math.random() + 1).toFixed(1)),
          o: 1
        });
    },
    targetDripCheck: function() {
        const frequency = 0.0037;
        if (Math.random().toFixed(5) < frequency) return true;
    },
    targetDrip: function(x,y,c,r) {
        const xran = (Math.random() < 0.5) ? Math.random() / 2 : Math.random() / -2; 
        this.drops.push({
          x: x + xran,
          y: y,
          c: c,
          r: r,
          v: parseFloat((Math.random() + 1).toFixed(1))
        });
    },
    soakCheck: function(cur) {
        return cur.y > window.innerHeight;
    },
    soakUp: function(arr) {
        let n = 0;
        arr.forEach(function(cur,ind,arr) {
          paint.drops.splice(cur,1-n);
          n++;
        });
    },
    adjust: function() {
        paint.dripCheck();
        const toRemove = [];
        paint.drops.forEach(function(cur,ind,arr) {
            cur.o = 1 - (1/paint.canvas.height) * cur.y; 
            let offset = (Math.random() < 0.5) ? parseFloat(Math.random().toFixed(1)) : Math.random().toFixed(1) * -1;
            cur.y = parseFloat((cur.y + cur.v).toFixed(1));
            cur.x += offset;
            if (cur.r > 1.5 && paint.targetDripCheck()) {
                cur.r /= 2;
                paint.targetDrip(cur.x, cur.y, cur.c, cur.r);
            }
            paint.draw(cur);
            if (paint.soakCheck(cur)) toRemove.push(ind);
        });
        if (toRemove.length) this.soakUp(toRemove);
    },
    clear: function() {
        this.context.clearRect(0,0,canvasP.width, canvasP.height);
    },
    draw: function(cur) {
        this.context.fillStyle = `rgba(${cur.c}, ${cur.o})`;;
        this.context.beginPath();
        this.context.arc(cur.x,cur.y,cur.r,0,Math.PI*2);
        this.context.fill();
    },
    main: function() {
        paint.adjust();
    },
    resize: function() {
        paint.drops = [];
        if (paint.canvas.width < window.innerWidth) paint.canvas.width = window.innerWidth;
        if (paint.canvas.height < window.innerHeight) paint.canvas.height = window.innerHeight;
        paint.getProximityIntensity();
    }
}
paint.context = paint.canvas.getContext('2d');

window.addEventListener('resize', paint.resize);

function load() {
    paint.resize();
    setTimeout(()=> {
        paint.loop = setInterval(paint.main, paint.speed);
        //color.loop = setInterval(color.main,color.speed);
    }, 250);
}
document.addEventListener("DOMContentLoaded", function(event) {load();});
