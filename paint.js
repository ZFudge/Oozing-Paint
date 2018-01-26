const paint = {
    canvas: document.getElementById('paint-canvas'),
    active: true,
    speed: 75,
    colors: ['lightBlue', 'darkBlue', 'purple', 'green', 'pink', 'cherry', 'orange'],
    //hex: ['#0BF', '#00F', '#90F', '#3F1', '#F0C', '#F05', '#F80', '#666', '#999', '#CCC'],
    hex: ['240,240,240', '0,166,255', '115,0,255', '7,235,178', '10,10,10'],
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
          c: paint.hex[Math.floor(Math.random() * paint.hex.length)],
          r: 3,  // Math.ceil(Math.random() * 3 + 4),
          v: parseFloat((Math.random() + 1).toFixed(1)),
          o: 1
        });
    },
    targetDripCheck: function() {
        //const frequency = 0.0007;
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
            //(Math.random() < 0.5) ? cur.x += offset : cur.x += offset * 2;
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

const color = {
    speed: 50,
    canvas: document.getElementById('color-canvas'),
    drops: [],
    hex: ['240,240,240', '0,166,255', '115,0,255', '7,235,178', '10,10,10'],
    drip: function() {
        this.drops.push({
            x: Math.floor(Math.random() * color.canvas.width*0.8 + color.canvas.width*0.1),
            y: color.canvas.height,
            r: Math.ceil(1 + Math.random() * 1.5),
            v:  Math.random() * -1,
            c: color.hex[Math.floor(Math.random() * color.hex.length)],
            o: 1
        });
    },
    dripCheck: function() {
        if (Math.random() < 0.025 && this.drops.length < 20) color.drip();
    },
    draw: function(cur) {
        //console.log(`rgba(${cur.c}, ${cur.o})`);
        this.context.fillStyle = `rgba(${cur.c}, ${cur.o})`;
        this.context.beginPath();
        this.context.arc(cur.x,cur.y,cur.r,0,Math.PI*2);
        this.context.fill();
    },
    adjust: function() {
        const toRemove = [];
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.drops.forEach(function(cur,ind,arr) {
            cur.o = (1/color.canvas.height) * cur.y; 
            cur.y += cur.v;
            color.draw(cur);
            if (color.removeCheck(cur)) toRemove.push(ind);
        });
        if (toRemove.length) this.remove(toRemove);
    },
    removeCheck: function(cur) {
        return (cur.v < 0) ? cur.y < 0 : cur.y > color.canvas.height;
    },
    remove: function(arr) {
        let n = 0;
        arr.forEach(function(cur,ind,arr) {
          color.drops.splice(cur,1-n);
          n++;
        });
    },
    main: function() {
        color.adjust();
        color.dripCheck();
    }
}
color.context = color.canvas.getContext('2d');
