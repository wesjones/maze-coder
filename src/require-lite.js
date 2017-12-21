var define, require;
(function () {
    var requireWorker = function () {
        var _get, defined, pending, definitions, timer = 0, raw;
        var CACHE_TOKEN = '~', DEFINITIONS_TOKEN = '.', REQUIRE = 'require', EXPORTS = 'exports', DEFAULT = 'default', CACHED = 'c', DEFINED = 'd', PENDING = 'p', RAW = 'r';
        /**
         * Sets and Gets cache, defined, and pending items in a private internal cache
         */
        function init() {
            _get = Function[CACHE_TOKEN] = Function[CACHE_TOKEN] || function (name) {
                    if (!_get[name]) {
                        _get[name] = {};
                    }
                    return _get[name];
                };
            raw = _get(RAW);
            definitions = _get(CACHED); // these are items that have been initialized and permanently cached
            defined = _get(DEFINED); // these are items that have been defined but have not been initialized
            pending = _get(PENDING); // these are items that have been initialized but have deps that need initialized before done
        }
        function clear() {
            delete Function[CACHE_TOKEN];
            delete definitions;
            delete defined;
            delete pending;
            init();
        }
        /**
         * Initializes
         */
        function initDefinition(name) {
            if (!defined[name]) {
                var args = arguments;
                var val = args[1];
                if (typeof val === 'function') {
                    // ex. define('myFunc', function(){...});
                    defined[name] = val.apply({ name: name }); // invoke immediately and assign to defined
                }
                else {
                    // store in a temporary definitions until all definitions have been processed
                    // ex. define('myFunc', ['toBoolean'], function(toBoolean){...})
                    definitions[name] = args[2]; // skip array and assign funtion to cached name
                    definitions[name][DEFINITIONS_TOKEN] = val; // assign dependencies to definitions on function itself
                }
            }
        }
        function resolveModule(name, initHandler) {
            pending[name] = true; // mark this definition as pending
            var deps = initHandler[DEFINITIONS_TOKEN]; // get any dependencies required by definition
            var args = [];
            var i, len;
            var dependencyName;
            if (deps) {
                len = deps.length;
                for (i = 0; i < len; i++) {
                    dependencyName = deps[i];
                    // if (definitions[dependencyName]) {
                    if (pending[dependencyName]) {
                        if (!require.ignoreWarnings) {
                            console.warn('Recursive dependency between "' + name + '" and "' + dependencyName);
                        }
                    }
                    else if (definitions[dependencyName]) {
                        resolveModule(dependencyName, definitions[dependencyName]);
                    }
                    delete definitions[dependencyName];
                }
            }
            if (!defined.hasOwnProperty(name)) {
                var exports = void 0;
                var module = void 0;
                for (i = 0; i < len; i++) {
                    dependencyName = deps[i]; // get the dependency name
                    if (dependencyName === REQUIRE) {
                        args.push(require);
                    }
                    else if (dependencyName === EXPORTS) {
                        exports = {};
                        args.push(exports);
                    }
                    else if (defined.hasOwnProperty(dependencyName)) {
                        args.push(defined[dependencyName]); // this will push an item even if it is undefined
                    }
                    else if (!require.ignoreWarnings) {
                        args.push(undefined);
                        console.warn('Module "' + name + '" requires "' + dependencyName + '", but is undefined');
                    }
                }
                var returnVal = initHandler.apply({ name: name }, args); // call the function and assign return value onto defined list
                if (exports) {
                    if (exports.hasOwnProperty(DEFAULT)) {
                        defined[name] = exports[DEFAULT];
                    }
                    else {
                        defined[name] = exports;
                    }
                }
                else {
                    defined[name] = returnVal;
                }
            }
            delete pending[name]; // permanently remove pending item
        }
        function resolve() {
            for (var name_1 in definitions) {
                if (definitions.hasOwnProperty(name_1)) {
                    var fn = definitions[name_1];
                    delete definitions[name_1];
                    try {
                        resolveModule(name_1, fn);
                    }
                    catch (e) {
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
        define = function (name, deps, initHandler) {
            if (deps === void 0) { deps = []; }
            if (typeof name !== 'string') {
                throw new Error('Property "name" requires type string');
            }
            try {
                raw[name] = { name: name, deps: deps, fn: initHandler };
                initDefinition.apply({ name: name }, arguments);
            }
            catch (e) {
                throw new Error('ModuleError in "' + name + '": ' + e.message);
            }
            clearInterval(timer);
            setTimeout(resolve);
        };
        require = function (modules, handler) {
            clearTimeout(timer);
            resolve();
            if (!handler) {
                if (typeof modules !== 'string' && modules.length > 1) {
                    throw new Error('Callback function required');
                }
                var name_2 = modules.toString();
                return defined[name_2];
            }
            var args = [];
            if (typeof modules === 'string') {
                modules = [modules];
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
        require.workerTemplate = function (fn) {
            var fnStr = fn.toString();
            var deps = [];
            fnStr.replace(/\W+require\(("|')(.*?)\1\)/g, function (m, g1, g2) {
                deps.push(g2);
            });
            var str = 'function(e) {\nvar define, require;\n(' + requireWorker + ')();\n', i, j, dep, used = {};
            deps = deps || [];
            for (i = 0; i < deps.length; i += 1) {
                dep = raw[deps[i]];
                str += '    define("' + dep.name + '", ' + (dep.deps.join ? '["' + dep.deps.join('","') + '"], ' + dep.fn : dep.deps) + ');\n';
                for (j = 0; j < dep.deps.length; j += 1) {
                    if (!used[dep.deps[j]]) {
                        used[dep.deps[j]] = true;
                        deps.push(dep.deps[j]);
                    }
                }
            }
            return fnStr.replace(/^.*?\{/, str);
        };
        require.ready = function (readyHandler, errorHandler) {
            defined[CACHE_TOKEN] = readyHandler;
            defined[DEFINITIONS_TOKEN] = errorHandler;
        };
        init();
    };
    return requireWorker();
})();
