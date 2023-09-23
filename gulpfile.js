const { src, dest, series, watch } = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('sass');
const gulpSass = require('gulp-sass');
const fileInclude = require('gulp-file-include');
const rev = require('gulp-rev');
const revRewrite = require('gulp-rev-rewrite');
const htmlmin = require('gulp-htmlmin');
const gulpif = require('gulp-if');
const notify = require('gulp-notify');
const { readFileSync } = require('fs');
const typograf = require('gulp-typograf');
const mainSass = gulpSass(sass);
const webpackStream = require('webpack-stream');
const plumber = require('gulp-plumber');
const path = require('path');
const rootFolder = path.basename(path.resolve());

// paths
const srcFolder = './src';
const buildFolder = './app';
const paths = {
	srcSvg: `${srcFolder}/img/svg/**.svg`,
	srcImgFolder: `${srcFolder}/img`,
	buildImgFolder: `${buildFolder}/img`,
	srcScss: `${srcFolder}/scss/**/*.scss`,
	buildCssFolder: `${buildFolder}/css`,
	srcFullJs: `${srcFolder}/js/**/*.js`,
	srcMainJs: `${srcFolder}/js/main.js`,
	buildJsFolder: `${buildFolder}/js`,
	srcPartialsFolder: `${srcFolder}/partials`,
	fontsFolder: `${srcFolder}/fonts`,
	videosFolder: `${srcFolder}/videos`,
};

let isProd = false; // dev by default

const clean = () => {
	return del([buildFolder]);
};

// scss styles
const styles = () => {
	console.log('styles');

	return src(paths.srcScss, { sourcemaps: !isProd })
		.pipe(
			plumber(
				notify.onError({
					title: 'SCSS',
					message: 'Error: <%= error.message %>',
				})
			)
		)
		.pipe(mainSass())
		.pipe(
			autoprefixer({
				cascade: false,
				grid: true,
				overrideBrowserslist: ['last 5 versions'],
			})
		)
		.pipe(
			gulpif(
				isProd,
				cleanCSS({
					level: 2,
				})
			)
		)
		.pipe(dest(paths.buildCssFolder, { sourcemaps: '.' }))
		.pipe(browserSync.stream());
};

// scripts
const scripts = () => {
	return src(paths.srcMainJs)
		.pipe(
			plumber(
				notify.onError({
					title: 'JS',
					message: 'Error: <%= error.message %>',
				})
			)
		)
		.pipe(
			webpackStream({
				mode: isProd ? 'production' : 'development',
				output: {
					filename: 'main.js',
				},
				module: {
					rules: [
						{
							test: /\.m?js$/,
							exclude: /node_modules/,
							use: {
								loader: 'babel-loader',
								options: {
									presets: [
										[
											'@babel/preset-env',
											{
												targets: 'defaults',
											},
										],
									],
								},
							},
						},
					],
				},
				devtool: !isProd ? 'source-map' : false,
			})
		)
		.on('error', function (err) {
			console.error('WEBPACK ERROR', err);
			this.emit('end');
		})
		.pipe(dest(paths.buildJsFolder))
		.pipe(browserSync.stream());
};

// scripts backend
const scriptsBackend = () => {
	return src(paths.srcMainJs)
		.pipe(
			plumber(
				notify.onError({
					title: 'JS',
					message: 'Error: <%= error.message %>',
				})
			)
		)
		.pipe(
			webpackStream({
				mode: 'development',
				output: {
					filename: 'main.js',
				},
				module: {
					rules: [
						{
							test: /\.m?js$/,
							exclude: /node_modules/,
							use: {
								loader: 'babel-loader',
								options: {
									presets: [
										[
											'@babel/preset-env',
											{
												targets: 'defaults',
											},
										],
									],
								},
							},
						},
					],
				},
				devtool: false,
			})
		)
		.on('error', function (err) {
			console.error('WEBPACK ERROR', err);
			this.emit('end');
		})
		.pipe(dest(paths.buildJsFolder))
		.pipe(browserSync.stream());
};

const fonts = () =>
	src(`${paths.fontsFolder}/**`).pipe(dest(`${buildFolder}/fonts`));

const videos = () =>
	src(`${paths.videosFolder}/**`).pipe(dest(`${buildFolder}/videos`));

const images = () =>
	src([`${paths.srcImgFolder}/**/**.{jpg,jpeg,png,svg,webp}`]).pipe(
		dest(paths.buildImgFolder)
	);

const htmlInclude = () => {
	return src([`${srcFolder}/*.html`])
		.pipe(
			fileInclude({
				prefix: '@',
				basepath: '@file',
			})
		)
		.pipe(
			typograf({
				locale: ['ru', 'en-US'],
			})
		)
		.pipe(dest(buildFolder))
		.pipe(browserSync.stream());
};

const watchFiles = () => {
	browserSync.init({
		server: {
			baseDir: `${buildFolder}`,
		},
	});

	watch(paths.srcScss, styles);
	watch(paths.srcFullJs, scripts);
	watch(`${paths.srcPartialsFolder}/*.html`, htmlInclude);
	watch(`${srcFolder}/*.html`, htmlInclude);
	watch(`${paths.fontsFolder}/**`, fonts);
	watch(`${paths.videosFolder}/**`, videos);
	watch(`${paths.srcImgFolder}/**/**.{jpg,jpeg,png,svg}`, images);
};

const rewrite = () => {
	const manifest = readFileSync('app/rev.json');
	src(`${paths.buildCssFolder}/*.css`)
		.pipe(
			revRewrite({
				manifest,
			})
		)
		.pipe(dest(paths.buildCssFolder));
	return src(`${buildFolder}/**/*.html`)
		.pipe(
			revRewrite({
				manifest,
			})
		)
		.pipe(dest(buildFolder));
};

const htmlMinify = () => {
	return src(`${buildFolder}/**/*.html`)
		.pipe(
			htmlmin({
				collapseWhitespace: true,
			})
		)
		.pipe(dest(buildFolder));
};

const toProd = (done) => {
	isProd = true;
	done();
};

exports.default = series(
	clean,
	htmlInclude,
	scripts,
	styles,
	fonts,
	images,
	videos,
	watchFiles
);

exports.build = series(
	toProd,
	clean,
	htmlInclude,
	scripts,
	styles,
	fonts,
	images,
	videos,
	htmlMinify
);
