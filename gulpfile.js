var babelify = require("babelify");
var browserify = require("browserify");
var gulp = require("gulp");
var less = require("gulp-less");
var source = require("vinyl-source-stream");

gulp.task("js", function () {
  browserify({entries: "./src/jsx/core.jsx", extensions: [".jsx"], debug: true})
    .transform(babelify.configure({presets: ["es2015", "react"]}))
    .bundle()
    .pipe(source("core.js"))
    .pipe(gulp.dest("out/js"));
});

gulp.task("css", function () {
  gulp.src("./src/less/core.less")
    .pipe(less())
    .pipe(gulp.dest("./out/css"));
});

gulp.task("default", function () {
  gulp.watch("./src/less/**/*.less", ["css"]);
  gulp.watch("./src/jsx/**/*.jsx", ["js"]);
});
