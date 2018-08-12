const RED   = 'rgb(177, 81, 59)'  , //'#B1543C',
      GREEN = 'rgb(111, 160, 54)' , //'#6FA036',
      BLUE  = 'rgb(41, 89, 112)'  , //'#295970',
      WHITE = 'rgb(234, 234, 234)', //'#EAEAEA',
      GREY  = 'rgb(25, 25, 25)';    //'#191919';

const $ = document.querySelector.bind(document);
const grid = $('table');
const resize = (s) => {
    size = s;
    grid.innerHTML = ''
    //while (grid.firstChild) grid.removeChild(grid.firstChild);
    for(let i = 0; i < size; i++){
        const r = grid.insertRow(i);
        for(let i = 0; i < size; i++){
            let cell = r.insertCell(i);
            cell.innerHTML = '<button onclick="modify(this)"></button>';
            cell.firstChild.style.backgroundColor = RED;
            // the css is just a fallback; we need to do this 
            // since js returns button.style.backgroundColor as 
            // an empty string if the bgcolor is from a stylesheet 
        }
    }
}

const modify = (el) => {
    el.style.backgroundColor = el.style.backgroundColor===GREEN?RED:GREEN;
}

const solve = async () => {
    $('a').classList.add('disabled');
    const status = $('#status');
    status.innerHTML = 'solving...';
    let g = [];
    const SIZE = grid.firstChild.children.length;
    const within = (x,y) => !!(x>=0 && y>=0 && x < SIZE && y < SIZE);
    let visited = [];
    for(const tr of grid.firstChild.children){
        let chldrn = Array.from(tr.children).map(el => el.firstChild.style);
        for(const el of chldrn){
            if(el.backgroundColor === BLUE || el.backgroundColor === GREY) el.backgroundColor = GREEN;
        }
        g.push(chldrn)
        visited.push(new Array(SIZE).fill(0))
    }
    g.reverse();
    console.log(visited);

    let queue = [[0,0]];
    visited[0][0] = 1;
    //left = 0
    //up = 90
    //right = 180
    //down = 270
    let facing = 0;
    while(queue.length){
        let [x,y] = queue.shift();
        g[y][x].backgroundColor = GREY;

        const p = await (new Promise(res => {
            if(x === SIZE-1 && y === SIZE-1) return res('SOLVED')
            const move = (iter) => {
                console.log(`(${x+1}, ${y+1}) Facing ${['left', 'up', 'right', 'down'][facing/90]}`);
                if(iter>4) return false;
                if(facing === 0){
                    if(iter+1&&within(x, y-1) && g[y-1][x].backgroundColor !== RED){
                        facing = 270;
                        return move(-1);
                    }else if(!within(x-1, y) || (x&&g[y][x-1].backgroundColor === RED)){
                        facing = 90;
                        return move(iter+1);
                    }else{
                        visited[y][x-1]++;
        
                        if(visited[y][x-1] > 4) setTimeout(() => res('UNSOLVABLE'), 300);
                        else queue.push([x-1, y]);
                        return true;
                    }
                }
                if(facing === 90){
                    if(iter+1&&within(x-1, y) && g[y][x-1].backgroundColor !== RED){
                        facing = 0;
                        return move(-1);
                    }else if(!within(x, y+1) || (y<SIZE-1&&g[y+1][x].backgroundColor === RED)){
                        facing = 180;
                        return move(iter+1);
                    }else{
                        visited[y+1][x]++;
        
                        if(visited[y+1][x] > 4) setTimeout(() => res('UNSOLVABLE'), 300);
                        else queue.push([x, y+1]);
                        return true;
                    }
                }
                if(facing === 180){
                    if(iter+1&&within(x, y+1) && g[y+1][x].backgroundColor !== RED){
                        facing = 90;
                        return move(-1);
                    }else if(!within(x+1, y) || (x<SIZE-1&&g[y][x+1].backgroundColor === RED)){
                        facing = 270;
                        return move(iter+1);
                    }else{
                        visited[y][x+1]++;
        
                        if(visited[y][x+1] > 4) setTimeout(() => res('UNSOLVABLE'), 300);
                        else queue.push([x+1, y]);
                        return true;
                    }
                }
                if(facing === 270){
                    //console.log(`(${x+2}, ${y+1})`, within(x+1, y), g[y][x+1].backgroundColor !== RED)
                    if(iter+1&&within(x+1, y) && g[y][x+1].backgroundColor !== RED){
                        facing = 180;
                        return move(-1);
                    }else if(!within(x, y-1) || (y&&g[y-1][x].backgroundColor === RED)){
                        facing = 0;
                        return move(iter+1);
                    }else{
                        visited[y-1][x]++;
        
                        if(visited[y-1][x] > 4) setTimeout(() => res('UNSOLVABLE'), 300);
                        else queue.push([x, y-1]);
                        return true;
                    }
                }
            }
            let mm = move(0);
            if(!mm) setTimeout(() => res('NO MOVES AVAILABLE'), 300);
            
            setTimeout(() => res(), 200);
        }));
        g[y][x].backgroundColor = BLUE;
        if(p) console.log(p); //p&&console.log(p)
        if(p === 'SOLVED'){
            g[y][x].backgroundColor = WHITE;
            status.innerHTML = 'solved';
            break;
        }else if(p === 'UNSOLVABLE')
            status.innerHTML = 'unsolvable';
        else if(p === 'NO MOVES AVAILABLE')
            status.innerHTML = 'cannot move';
        
    }
    $('a').classList.remove('disabled');
}

window.onload = resize(8);

/*
const printGrid = (g) => console.log(g.map(r=>r.map(c=>+c)).join('\n'));
const SIZE = 8;

let grid = new Array(SIZE).fill('1'.repeat(SIZE));
let queue = [{x:0,y:0}];
let visited = [];
for(let i = 0; i < SIZE; i++){
    visited.push(new Array(SIZE).fill(false));
}
visited[0][0] = true;
while(queue.length){
    let {x,y} = queue.shift();
    let adj = [];
    let p_m = false; //path made?

    //left
    if(within(x-1, y) && !visited[y][x-1]){
        visited[y][x-1] = true;
        if(Math.random() > 0.8){
            queue.push({x:x-1,y});
            p_m = true;
        }
    }
    
    //right
    if(within(x+1, y) && !visited[y][x+1]){
        visited[y][x+1] = true;
        if(Math.random() > 0.8){
            queue.push({x:x+1,y});
            p_m = true;
        }
    }
    
    //up
    if(within(x, y-1) && !visited[y-1][x]){
        visited[y-1][x] = true;
        if(Math.random() > 0.8){
            queue.push({x,y:y-1});
            p_m = true;
        }
    }
    
    //down (failsafe)
    if(within(x, y+1) && !visited[y+1][x]){
        visited[y+1][x] = true;
        if(p_m?Math.random() > 0.8:true)
            queue.push({x,y:y+1});
    }
}

printGrid(visited);
*/