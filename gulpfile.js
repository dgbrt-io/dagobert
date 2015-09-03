var gulp    = require('gulp')
  , inject  = require('gulp-inject')
  , bowerFiles = require('main-bower-files');
 
gulp.task('inject', function () {
  var target = gulp.src('./static/index.html');
  var sources = gulp.src(['./static/lib/**/*.js', './static/css/**/*.css'], {read: false});

  // TODO: Better way
  
 
  return target.pipe(inject(sources))
  	.pipe(inject(gulp.src(bowerFiles(), {read: false}), {name: 'bower'}))
    .pipe(gulp.dest('./static'));
});