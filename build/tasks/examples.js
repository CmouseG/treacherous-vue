var gulp = require('gulp');
var webpack = require('webpack-stream');
var examplesDir = "examples";

gulp.task('examples:basic', function() {
  return gulp.src(`${examplesDir}/basic/app.js`)
    .pipe(webpack({
        module: {
            rules: [
                { test: /\.html$/, use: [ "raw-loader" ] }
            ]
        },
        output: {
            filename: "compiled.js"
        }
    }))
    .pipe(gulp.dest(`${examplesDir}/basic`));
});

gulp.task('examples', ["examples:basic"]);