const burger = document.querySelector('.header__burger');
const menu = document.querySelector('.nav');
const menuLinks = document.querySelectorAll('.nav__link');

export const changeMenu = () => {
	burger?.addEventListener('click', () => {
		menu?.classList.toggle('active');
		burger?.classList.toggle('active');
		if (menu?.classList.contains('active')) {
			document.body.style.overflowY = 'hidden';
		} else {
			document.body.style.overflowY = 'auto';
		}
	});

	menuLinks.forEach((el) => {
		el.addEventListener('click', () => {
			menu?.classList.remove('active');
			document.body.style.overflowY = 'auto';
			burger?.classList.remove('active');
		});
	});
};
