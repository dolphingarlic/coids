const H = 200, W = 200, R_DIV = 5;

let grass = [];
for (i = 0; i < H; i++) {
    grass.push(new Array(W));
    for (j = 0; j < W; j++) grass[i][j] = 0.5;
}

let cows = [[50, 50], [150, 150]];

let canvas = document.getElementById("canvas");
canvas.width = H;
canvas.height = W;

let ctx = canvas.getContext("2d");

function draw() {
    let r = Math.tanh(Math.log(cows.length + 1)) / R_DIV;

    for (i = 0; i < H; i++) {
        for (j = 0; j < W; j++) {
            // Colour the grass
            ctx.fillStyle = `rgb(${255 * (1 - grass[i][j])}, 255, ${255 * (1 - grass[i][j])})`;
            ctx.fillRect(i, j, 1, 1);

            // Logistic growth
            grass[i][j] = (grass[i][j] + grass[i][j] * r * (1 - grass[i][j]));

            // Shrink based on cows and distances
            let shrink = 1;
            for (k = 0; k < cows.length; k++) {
                let dist = Math.hypot(i - cows[k][0], j - cows[k][1]);
                shrink *= Math.min(1, (dist + 1) / R_DIV / R_DIV);
            }
            grass[i][j] *= shrink;

            if (grass[i][j] == 0) grass[i][j] = 0.001;
        }
    }
    

    for (k = 0; k < cows.length; k++) {
        let best_dir = [-1, -1];
        let best_weight = -1;

        for (i = 0; i < H; i++) {
            for (j = 0; j < H; j++) {
                let weight = grass[i][j];
                let dist = Math.hypot(i - cows[k][0], j - cows[k][1]);
                weight *= 1 / (dist + 1);

                if (weight > best_weight) {
                    best_weight = weight;
                    best_dir = [(i - cows[k][0]) / dist, (j - cows[k][1]) / dist];
                }
            }
        }

        cows[k][0] += best_dir[0];
        cows[k][1] += best_dir[1];

        ctx.beginPath();
        ctx.arc(cows[k][0], cows[k][1], 3, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'black';
        ctx.fill();
    }
}

setInterval(draw, 50);
