var gulp = require("gulp");
var babel = require("gulp-babel");
var babelify = require("babelify");
var browserify = require("browserify");
var source = require("vinyl-source-stream");

gulp.task("default", function () {
  browserify({entries: "./src/core.jsx", extensions: [".jsx"], debug: true})
    .transform(babelify.configure({presets: ["es2015", "react"]}))
    .bundle()
    .pipe(source("out.js"))
    .pipe(gulp.dest("out"));
});
