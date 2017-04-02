const modhash = window.reddit.modhash;
const p = r.place;

const imageLeft = 173;
const imageTop = 360;

const flagColors =
[[3, 3, 3, 3, 3],
[3, 3, 3, 3, 3],
[3, 3, 3, 3, 3],
[3, 3, 3, 3, 3],
[3, 3, 3, 3, 3],
[3, 3, 3, 3, 3],
[3, 3, 3, 3, 3],
[3, 3, 3, 3, 3],
[3, 3, 3, 3, 3],
[3, 3, 3, 3, 3],
[3, 3, 3, 3, 3]];

const width = flagColors[0].length;
const height = flagColors.length;

var timer = 0;

setInterval(() => {
    timer -= 1e3;
    console.log("Waiting for " + Math.max(0, Math.floor(timer / 1000)) + " seconds");
}, 1e3);

r.placeModule("placeBot", loader => {
    const api = loader("api");
    console.log("module defined");
    const doIt = () => {
        let timeRemaining = p.getCooldownTimeRemaining();
        console.log("Setting timer to " + Math.floor(timeRemaining / 1000));
        timer = timeRemaining;
        setTimeout(() => {
            api.getCanvasBitmapState()
            .then((a, previousColors) => {
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        const color = flagColors[y][x];
                        const ax = x + imageLeft;
                        const ay = y + imageTop;
                        const previousColor = previousColors[ax + (ay * 1000)];
                        if (color !== null && color !== previousColor) {
                            p.setColor(color);
                            p.drawTile(ax, ay);
                            console.log("Drawing at " + ax + ", " + ay + " (https://www.reddit.com/r/place/#x=" + ax + "&y=" + ay + ")");

                            setTimeout(() => doIt(), 10e3);
                            return;
                        }
                    }
                }
                console.log("Nothing to fix");
                setTimeout(() => doIt(), 5e3);
            });
        }, timeRemaining);
    }
    console.log("Running script");
    doIt();
});