module.exports = function(grunt) {
  let path = require("path");
  let cwd = process.cwd();
  let dir = "dist";
  let mode = "dev";

  var environments = {};

  function run(key, path) {
    eval(grunt.file.read(cwd + path));
    environments[key] = environment;
  }

  run("dev", "/environment/environment.dev.js");

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    copy: {
        dev: {
            expand: true,
            flatten: false,
            cwd: './src',
            src: ['*.html'],
            dest: dir,
            filter: 'isFile',
            // options: {
            //     process: function(content, src, dest) {
            //         console.log("copy", src, dest);
            //         return content;
            //     }
            // }
        },
        obelisk: {
            expand: true,
            flatten: true,
            cwd: './node_modules/obelisk.js/build',
            src: ['*.js'],
            dest: dir,
            filter: 'isFile'
        }
    },
    compile: {
        dev: {
            wrap: "codeGame", // this is your global namespace
            filename: "maze-coder",
            build: dir,
            scripts: {
                embedRequire: false,
                ignorePatterns: false,
                inspect: ["src/**/*.html"],
                src: ["src/**/*.js"], // search through all JS file in src src directory
                includes: [
                    // projectDir + '/vendor/axios.min.js',
                    "environment/environment." + mode + ".js",
                    "src/require-lite.js"
                ],
                import: ["app"], // what files should we import and compile
                match: function(searchText) {
                var matches = [];
                searchText.replace(/(^|\s)require\((\"|\')(.*?)\2\)/g, function(m,g1,g2,g3) {
                    matches.push(g3);
                });
                return matches;
                }
            }
        }
    },
    less: {
        dev: {
            options: {
                strictImports: true
            },
            files: {
                [dir + "/maze-coder.css"]: "src/styles/styles.less"
            }
        }
    }
  });

  grunt.loadNpmTasks('hbjs');
  require('load-grunt-tasks')(grunt);

  // Default task(s).
  grunt.registerTask("default", ["copy:dev", "copy:obelisk", "compile:dev", "less:dev"]);
};
