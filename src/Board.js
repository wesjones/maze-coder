define('Board', ['Tile', 'Pyramid', 'Cube'], function(Tile, Pyramid, Cube) {
    console.log('board');
    function Board(dms, rows) {
        var items = [];
        var cols = rows;
        var board = document.querySelector('code-game');
        var canvas = document.createElement('canvas');
        var width = board.offsetWidth;
        var height = board.offsetHeight;
        var maze;
        var player;
        var onReady;
        var readyPromise = new Promise(function(resolve, reject) {
            onReady = resolve;
        });
        var running;
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        var ctx = canvas.getContext('2d');
        board.appendChild(canvas);

        // create pixel view container in point
        var point = new obelisk.Point(width * 0.5, height * 0.25);
        var pixelView = new obelisk.PixelView(canvas, point);

        function add(item) {
            items.push(item);
        }

        function render() {
            if (player && player.dirty) {
               ctx.clearRect(0, 0, width, height);
                pixelView.clear();
                // console.log('items', items.length);
                for(var i = 0; i < items.length; i += 1) {
                    items[i].render(pixelView);
                }
            }
        }

        function generate() {
            var startPoints = 1;
            var endPoint = {x: cols * 0.5, y: rows * 0.5};
            maze = mazegen.generate({
                rows: rows,
                cols: cols
            });
            var availablePoints = maze.getPointsFromEdge(0, [maze.types.PATH], startPoints);
            maze.forcePath(availablePoints, endPoint, [maze.types.WALL], function() {
                console.log(maze.asString());// output to the console the rendered board.
                var start = maze.starts[0];
                var end = maze.end;
                for (var r = 0; r < rows; r++) {
                    for (var c = 0; c < cols; c++) {
                        var clr = '';
                        var val = parseInt(maze[c][r], 10);
                        if (val === 1) {
                            clr = obelisk.ColorPattern.GRAY;
                        } else if (val === 4) {
                            clr = obelisk.ColorPattern.GRASS_GREEN;
                        } else if (val === 3) {
                            clr = obelisk.ColorPattern.PURPLE;
                        }
                        if (clr) {
                            add(new Tile(dms, {x:r, y:c, z:0}, clr));
                        }
                    }
                }
                // player = new Panda(dms, {x:start.x, y:start.y, z:0});//, 0xFF9900);//obelisk.ColorPattern.BLUE);
                player = new Cube(dms, {x:start.x, y:start.y, z:0}, 0xFF9900);
                add(player);
                onReady();
            });
            return readyPromise;
        }

        function move(x, y) {
            if (typeof x === 'object') {
                y = x.y;
                x = x.x;
            }
            return player.moveBy(x, y);
        }

        function getPos() {
            return {x:player.x, y:player.y};
        }

        function start() {
            running = setInterval(render, 20);
        }

        function stop() {
            clearInterval(running);
        }

        function findPath() {
            return new Promise(function(resolve, reject) {
                maze.findPath(maze.starts[0], maze.end, [maze.types.WALL], resolve);
            });
        }

        this.add = add;
        this.render = render;
        this.generate = generate;
        this.move = move;
        this.start = start;
        this.stop = stop;
        this.findPath = findPath;
        this.getPos = getPos;

        //TODO: these items should be added based on the generated data.
        // add(new Pyramid(dms, {x:1, y:0, z:0}, obelisk.ColorPattern.YELLOW, true));
        // add(new Pyramid(dms, {x:2, y:1, z:0}, obelisk.ColorPattern.GRASS_GREEN));
        // add(new Cube(dms, {x:2, y:2, z:0}, obelisk.ColorPattern.BLUE, true));
    }
    return Board;
});