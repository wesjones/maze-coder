(function(exports, global) {
    global["codeGame"] = exports;
    //! src/require-lite.js
    var define, require;
    (function() {
        var requireWorker = function() {
            var _get, defined, pending, definitions, timer = 0, raw;
            var CACHE_TOKEN = "~", DEFINITIONS_TOKEN = ".", REQUIRE = "require", EXPORTS = "exports", DEFAULT = "default", CACHED = "c", DEFINED = "d", PENDING = "p", RAW = "r";
            function init() {
                _get = Function[CACHE_TOKEN] = Function[CACHE_TOKEN] || function(name) {
                    if (!_get[name]) {
                        _get[name] = {};
                    }
                    return _get[name];
                };
                raw = _get(RAW);
                definitions = _get(CACHED);
                defined = _get(DEFINED);
                pending = _get(PENDING);
            }
            function clear() {
                delete Function[CACHE_TOKEN];
                delete definitions;
                delete defined;
                delete pending;
                init();
            }
            function initDefinition(name) {
                if (!defined[name]) {
                    var args = arguments;
                    var val = args[1];
                    if (typeof val === "function") {
                        defined[name] = val.apply({
                            name: name
                        });
                    } else {
                        definitions[name] = args[2];
                        definitions[name][DEFINITIONS_TOKEN] = val;
                    }
                }
            }
            function resolveModule(name, initHandler) {
                pending[name] = true;
                var deps = initHandler[DEFINITIONS_TOKEN];
                var args = [];
                var i, len;
                var dependencyName;
                if (deps) {
                    len = deps.length;
                    for (i = 0; i < len; i++) {
                        dependencyName = deps[i];
                        if (pending[dependencyName]) {
                            if (!require.ignoreWarnings) {
                                console.warn('Recursive dependency between "' + name + '" and "' + dependencyName);
                            }
                        } else if (definitions[dependencyName]) {
                            resolveModule(dependencyName, definitions[dependencyName]);
                        }
                        delete definitions[dependencyName];
                    }
                }
                if (!defined.hasOwnProperty(name)) {
                    var exports = void 0;
                    var module = void 0;
                    for (i = 0; i < len; i++) {
                        dependencyName = deps[i];
                        if (dependencyName === REQUIRE) {
                            args.push(require);
                        } else if (dependencyName === EXPORTS) {
                            exports = {};
                            args.push(exports);
                        } else if (defined.hasOwnProperty(dependencyName)) {
                            args.push(defined[dependencyName]);
                        } else if (!require.ignoreWarnings) {
                            args.push(undefined);
                            console.warn('Module "' + name + '" requires "' + dependencyName + '", but is undefined');
                        }
                    }
                    var returnVal = initHandler.apply({
                        name: name
                    }, args);
                    if (exports) {
                        if (exports.hasOwnProperty(DEFAULT)) {
                            defined[name] = exports[DEFAULT];
                        } else {
                            defined[name] = exports;
                        }
                    } else {
                        defined[name] = returnVal;
                    }
                }
                delete pending[name];
            }
            function resolve() {
                for (var name_1 in definitions) {
                    if (definitions.hasOwnProperty(name_1)) {
                        var fn = definitions[name_1];
                        delete definitions[name_1];
                        try {
                            resolveModule(name_1, fn);
                        } catch (e) {
                            throw e;
                        }
                    }
                }
                var callback = defined[CACHE_TOKEN];
                if (callback) {
                    delete defined[CACHE_TOKEN];
                    callback();
                }
            }
            define = function(name, deps, initHandler) {
                if (deps === void 0) {
                    deps = [];
                }
                if (typeof name !== "string") {
                    throw new Error('Property "name" requires type string');
                }
                try {
                    raw[name] = {
                        name: name,
                        deps: deps,
                        fn: initHandler
                    };
                    initDefinition.apply({
                        name: name
                    }, arguments);
                } catch (e) {
                    throw new Error('ModuleError in "' + name + '": ' + e.message);
                }
                clearInterval(timer);
                setTimeout(resolve);
            };
            require = function(modules, handler) {
                clearTimeout(timer);
                resolve();
                if (!handler) {
                    if (typeof modules !== "string" && modules.length > 1) {
                        throw new Error("Callback function required");
                    }
                    var name_2 = modules.toString();
                    return defined[name_2];
                }
                var args = [];
                if (typeof modules === "string") {
                    modules = [ modules ];
                }
                var len = modules.length;
                for (var i = 0; i < len; i++) {
                    args.push(defined[modules[i]]);
                }
                handler.apply(null, args);
            };
            require.clear = clear;
            require.ignoreWarnings = false;
            require.resolve = resolve;
            require.workerTemplate = function(fn) {
                var fnStr = fn.toString();
                var deps = [];
                fnStr.replace(/\W+require\(("|')(.*?)\1\)/g, function(m, g1, g2) {
                    deps.push(g2);
                });
                var str = "function(e) {\nvar define, require;\n(" + requireWorker + ")();\n", i, j, dep, used = {};
                deps = deps || [];
                for (i = 0; i < deps.length; i += 1) {
                    dep = raw[deps[i]];
                    str += '    define("' + dep.name + '", ' + (dep.deps.join ? '["' + dep.deps.join('","') + '"], ' + dep.fn : dep.deps) + ");\n";
                    for (j = 0; j < dep.deps.length; j += 1) {
                        if (!used[dep.deps[j]]) {
                            used[dep.deps[j]] = true;
                            deps.push(dep.deps[j]);
                        }
                    }
                }
                return fnStr.replace(/^.*?\{/, str);
            };
            require.ready = function(readyHandler, errorHandler) {
                defined[CACHE_TOKEN] = readyHandler;
                defined[DEFINITIONS_TOKEN] = errorHandler;
            };
            init();
        };
        return requireWorker();
    })();
    //! environment/environment.dev.js
    var environment = {};
    environment.mode = "dev";
    //! src/app.js
    define("app", [ "Board" ], function(Board) {
        setTimeout(function() {
            var board = new Board(30, 11);
            board.generate().then(function() {
                board.start();
                function pointToDelta(source, target) {
                    return {
                        x: target.x - source.x,
                        y: target.y - source.y
                    };
                }
                board.findPath().then(function(path) {
                    var index = 0;
                    var pos = board.getPos();
                    console.log("path found", path);
                    function next() {
                        console.log("next");
                        if (index < path.length) {
                            board.move(pointToDelta(pos, path[index])).then(next);
                            pos = path[index];
                            index += 1;
                        } else {
                            setTimeout(board.stop, 20);
                        }
                    }
                    next();
                });
            });
        });
    });
    //! src/Board.js
    define("Board", [ "Tile", "Pyramid", "Cube" ], function(Tile, Pyramid, Cube) {
        console.log("board");
        function Board(dms, rows) {
            var items = [];
            var cols = rows;
            var board = document.querySelector("code-game");
            var canvas = document.createElement("canvas");
            var width = board.offsetWidth;
            var height = board.offsetHeight;
            var maze;
            var player;
            var onReady;
            var readyPromise = new Promise(function(resolve, reject) {
                onReady = resolve;
            });
            var running;
            canvas.setAttribute("width", width);
            canvas.setAttribute("height", height);
            var ctx = canvas.getContext("2d");
            board.appendChild(canvas);
            var point = new obelisk.Point(width * .5, height * .25);
            var pixelView = new obelisk.PixelView(canvas, point);
            function add(item) {
                items.push(item);
            }
            function render() {
                if (player && player.dirty) {
                    ctx.clearRect(0, 0, width, height);
                    pixelView.clear();
                    for (var i = 0; i < items.length; i += 1) {
                        items[i].render(pixelView);
                    }
                }
            }
            function generate() {
                var startPoints = 1;
                var endPoint = {
                    x: cols * .5,
                    y: rows * .5
                };
                maze = mazegen.generate({
                    rows: rows,
                    cols: cols
                });
                var availablePoints = maze.getPointsFromEdge(0, [ maze.types.PATH ], startPoints);
                maze.forcePath(availablePoints, endPoint, [ maze.types.WALL ], function() {
                    console.log(maze.asString());
                    var start = maze.starts[0];
                    var end = maze.end;
                    for (var r = 0; r < rows; r++) {
                        for (var c = 0; c < cols; c++) {
                            var clr = "";
                            var val = parseInt(maze[c][r], 10);
                            if (val === 1) {
                                clr = obelisk.ColorPattern.GRAY;
                            } else if (val === 4) {
                                clr = obelisk.ColorPattern.GRASS_GREEN;
                            } else if (val === 3) {
                                clr = obelisk.ColorPattern.PURPLE;
                            }
                            if (clr) {
                                add(new Tile(dms, {
                                    x: r,
                                    y: c,
                                    z: 0
                                }, clr));
                            }
                        }
                    }
                    player = new Cube(dms, {
                        x: start.x,
                        y: start.y,
                        z: 0
                    }, 16750848);
                    add(player);
                    onReady();
                });
                return readyPromise;
            }
            function move(x, y) {
                if (typeof x === "object") {
                    y = x.y;
                    x = x.x;
                }
                return player.moveBy(x, y);
            }
            function getPos() {
                return {
                    x: player.x,
                    y: player.y
                };
            }
            function start() {
                running = setInterval(render, 20);
            }
            function stop() {
                clearInterval(running);
            }
            function findPath() {
                return new Promise(function(resolve, reject) {
                    maze.findPath(maze.starts[0], maze.end, [ maze.types.WALL ], resolve);
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
        }
        return Board;
    });
    //! src/shapes/Tile.js
    define("Tile", [ "Piece" ], function(Piece) {
        function Tile(dms, point, color) {
            var tColor = new obelisk.SideColor().getByInnerColor(color);
            var tDms = new obelisk.BrickDimension(dms, dms);
            var brick = new obelisk.Brick(tDms, tColor);
            var brickPt = new obelisk.Point3D((dms - 2) * point.x, (dms - 2) * point.y, (dms - 2) * point.z);
            Piece.call(this, "tile", dms, point, brick, tDms, brickPt, tColor);
        }
        Tile.prototype = Piece.prototype;
        return Tile;
    });
    //! src/shapes/Piece.js
    define("Piece", function() {
        function Piece(type, dms, point, shape, shapeDms, shapePt, shapeClr) {
            this.type = type;
            this.dms = dms;
            this.x = point.x || 0;
            this.y = point.y || 0;
            this.z = point.z || 0;
            this.shape = shape;
            this.shameDms = shapeDms;
            this.shapePt = shapePt;
            this.shapeClr = shapeClr;
            this.actionTime = 500;
        }
        Piece.prototype.moveBy = function(deltaX, deltaY, deltaZ) {
            var props = [ "x", "y", "z" ];
            var dest = {
                x: this.x + (deltaX || 0),
                y: this.y + (deltaY || 0),
                z: this.z + (deltaZ || 0)
            };
            var self = this;
            self.dirty = 1;
            return new Promise(function(resolve, reject) {
                var count = 0;
                var total = 0;
                function done() {
                    count += 1;
                    if (count >= total) {
                        self.dirty = 2;
                        resolve(self);
                    }
                }
                for (var i = 0; i < props.length; i += 1) {
                    var prop = props[i];
                    if (self[prop] !== dest[prop]) {
                        console.log("change", prop, self[prop], dest[prop]);
                        total += 1;
                        var target = {};
                        target[prop] = dest[prop];
                        createjs.Tween.get(self).to(target, self.actionTime, createjs.Ease.getPowInOut(4)).call(done);
                    }
                }
                total += 1;
                createjs.Tween.get(self).to({
                    z: 1
                }, self.actionTime * .5, createjs.Ease.getPowIn(1)).to({
                    z: 0
                }, self.actionTime * .5, createjs.Ease.getPowOut(1)).call(done);
            });
        };
        Piece.prototype.render = function(view) {
            var dms = this.dms - 2;
            this.shapePt.x = dms * this.x;
            this.shapePt.y = dms * this.y;
            this.shapePt.z = dms * this.z;
            view.renderObject(this.shape, this.shapePt);
            if (this.dirty === 2) {
                this.dirty = 0;
            }
        };
        return Piece;
    });
    //! src/shapes/Pyramid.js
    define("Pyramid", [ "Piece" ], function(Piece) {
        function Pyramid(dms, point, color, tall) {
            var pyColor = new obelisk.PyramidColor().getByRightColor(color);
            var pyDms = new obelisk.PyramidDimension(dms, tall);
            var py = new obelisk.Pyramid(pyDms, pyColor);
            var p3dPy = new obelisk.Point3D((dms - 2) * point.x, (dms - 2) * point.y, (dms - 2) * point.z);
            Piece.call(this, "pyramid", dms, point, py, pyDms, p3dPy, pyColor);
        }
        Pyramid.prototype = Piece.prototype;
        return Pyramid;
    });
    //! src/shapes/Cube.js
    define("Cube", [ "Piece" ], function(Piece) {
        function Cube(dms, point, color, tall) {
            var cubeDms = new obelisk.CubeDimension(dms, dms, tall ? dms * 2 : dms);
            var cbColor = new obelisk.CubeColor().getByHorizontalColor(color);
            var cube = new obelisk.Cube(cubeDms, cbColor);
            var cubePt = new obelisk.Point3D((dms - 2) * point.x, (dms - 2) * point.y, (dms - 2) * point.z);
            Piece.call(this, "cube", dms, point, cube, cubeDms, cubePt, cbColor);
        }
        Cube.prototype = Piece.prototype;
        return Cube;
    });
})(this["codeGame"] || {}, function() {
    return this;
}());