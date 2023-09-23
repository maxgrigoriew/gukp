import { changeMenu } from '../js/components/burber-menu';
import { initializationSliders } from '../js/components/sliders';

const header = document.querySelector('.header');

changeMenu();
initializationSliders();

window.onscroll = () => {
	const top = window.scrollY;
	if (top >= 100) header.classList.add('active');
	else header.classList.remove('active');
};
