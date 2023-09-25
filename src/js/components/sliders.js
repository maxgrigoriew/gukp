import Swiper, { Navigation, Pagination } from 'swiper';

Swiper.use([Navigation, Pagination]);

const bodyStyles = window.getComputedStyle(document.body);
const gap = parseInt(bodyStyles.getPropertyValue('--grid-gap'));

export const initializationSliders = () => {
	const portfolioSlider = new Swiper('.portfolio-slider', {
		slidesPerView: '3',
		spaceBetween: gap,
		loop: true,
		navigation: {
			nextEl: '.portfolio__slider-next',
			prevEl: '.portfolio__slider-prev',
		},
	});
};

// 	const goodsSlider = new Swiper('.goods__slider', {
// 		slidesPerView: 3,
// 		spaceBetween: 5,
// 		navigation: {
// 			nextEl: '.goods__slider-next',
// 			prevEl: '.goods__slider-prev',
// 		},
// 		pagination: {
// 			clickable: true,
// 			el: '.swiper-pagination',
// 			clickable: true,
// 		},
// 		breakpoints: {
// 			940: {
// 				slidesPerView: 4,
// 			},
// 			764: {
// 				slidesPerView: 3,
// 			},
// 			600: {
// 				slidesPerView: 2,
// 			},
// 			0: {
// 				slidesPerView: 1,
// 			},
// 		},
// 	});
