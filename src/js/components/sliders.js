import Swiper, { Navigation, Pagination } from 'swiper';

Swiper.use([Navigation, Pagination]);

export const initializationSliders = () => {
	const recomendationsSlider = new Swiper('.recomendations__slider', {
		slidesPerView: '1',
		navigation: {
			nextEl: '.recomendations__slider-navigation-next',
			prevEl: '.recomendations__slider-navigation-prev',
		},
	});

	const goodsSlider = new Swiper('.goods__slider', {
		slidesPerView: 3,
		spaceBetween: 5,
		navigation: {
			nextEl: '.goods__slider-next',
			prevEl: '.goods__slider-prev',
		},
		pagination: {
			clickable: true,
			el: '.swiper-pagination',
			clickable: true,
		},
		breakpoints: {
			940: {
				slidesPerView: 4,
			},
			764: {
				slidesPerView: 3,
			},
			600: {
				slidesPerView: 2,
			},
			0: {
				slidesPerView: 1,
			},
		},
	});
};
