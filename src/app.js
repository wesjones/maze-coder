define('app', ['Board'], function(Board) {
    var board;
    // setTimeout(function() {
    //     var board = new Board(30, 11);
    //     board.generate().then(function() {
    //         board.start();

    //         function pointToDelta(source, target) {
    //             return {x:target.x - source.x, y:target.y - source.y};
    //         }

    //         board.findPath().then(function(path) {
    //             var index = 0;
    //             var pos = board.getPos();
    //             console.log('path found', path);
    //             function next() {
    //                 console.log('next');
    //                 if(index < path.length) {
    //                     board.move(pointToDelta(pos, path[index])).then(next);
    //                     pos = path[index];
    //                     index += 1;
    //                 } else {
    //                     setTimeout(board.stop, 20);// wait till after the render.
    //                 }
    //             }
    //             next();
    //         });
    //     });
    // });

    function start() {
        board = new Board(30, 11);
        return board.generate().then(function() {
            board.start();

            // function pointToDelta(source, target) {
            //     return {x:target.x - source.x, y:target.y - source.y};
            // }

            // board.findPath().then(function(path) {
            //     var index = 0;
            //     var pos = board.getPos();
            //     console.log('path found', path);
            //     function next() {
            //         console.log('next');
            //         if(index < path.length) {
            //             board.move(pointToDelta(pos, path[index])).then(next);
            //             pos = path[index];
            //             index += 1;
            //         } else {
            //             setTimeout(board.stop, 20);// wait till after the render.
            //         }
            //     }
            //     next();
            // });
            return board;
        });
    }

    function move(x, y) {
        if (board) {
            board.move(x, y);
        }
    }

    exports.start = start;
    exports.move = move;
});