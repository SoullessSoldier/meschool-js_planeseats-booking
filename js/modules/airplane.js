import createElement from './createElement.js';
import { setStorage, getStorage } from '../service/storage.js';

const createCockpit = (titleText) => {
	const cockpit = createElement('div', {
		className: 'cockpit'
	});
	const title = createElement('h1', {
		className: 'cockpit-title',
		textContent: titleText
	});
	
	const button = createElement('button', {
		className: 'cockpit-confirm',
		type: 'submit',
		textContent: 'Подтвердить'
	});
	cockpit.append(title, button);
	
	return cockpit;
};

const createExit = () => {
	const fuselage = createElement('div', {
		className: 'fuselage exit',		
	});
	return fuselage;
};

const createBlockSeats = (n, count, bookingSeat) => {
	const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
	const fuselage = createElement('ol', {
		className: 'fuselage',		
	});
	
	for (let i = n; i < count + n; i++){
		const wrapperRow = createElement('li');
		const seats = createElement('ol', {
			className: 'seats'
		});
		
		const seatsRow = letters.map(letter => {
			const seat = createElement('li', {
				className: 'seat'
			});
			const wrapperCheck = createElement('label');
			const checkedSeat = `${i}${letter}`;
			const check = createElement('input', {
				name: 'seat',
				type: 'checkbox',
				value: checkedSeat,
				disabled: bookingSeat.includes(checkedSeat)
			});
			
			wrapperCheck.append(check);
			seat.append(wrapperCheck);
			return seat;
		});
		seats.append(...seatsRow);
		wrapperRow.append(seats);
		fuselage.append(wrapperRow);
	}

	return fuselage;
	
};

const createAirplane = (title, tourData) => {
	const scheme  = tourData.scheme;
	const bookingSeat = getStorage(tourData.id).map(item => item.seat);
	const choicesSeat = createElement('form', {
		className: 'choices-seat'
	});
	const plane = createElement('fieldset', {
		className: 'plane',
		name: 'plane'
	});
	
	const cockpit = createCockpit(title);
	
	let n = 1;	
	const elements = scheme.map((type) => {
		if((type)==='exit'){
			return createExit();
		}
		if(typeof type === 'number'){
			const blockSeats = createBlockSeats(n, type, bookingSeat);
			n += type;
			return blockSeats;
		}
	});
	
	plane.append(cockpit, ...elements);
	choicesSeat.append(plane);
	
	return choicesSeat;
};

const checkSeat = (form, data, id) => {
	const bookingSeat = getStorage(id).map(item => item.seat);
	form.addEventListener('change', () => {
		const formData = new FormData(form);
		const checked = [...formData].map(([, value]) => value);
		if(checked.length === data.length){
			[...form].forEach(item => {
				if (item.checked === false && item.name === 'seat'){
					item.disabled = true;
				}
			});
		} else {
			[...form].forEach(item => {
				if(!bookingSeat.includes(item.value)){
					item.disabled = false;
				}
			});
		}
	});
	form.addEventListener('submit', (e) => {
		e.preventDefault();
		const formData = new FormData(form);
		const booking = [...formData].map(([, value]) => value);
		for (let i = 0; i < data.length; i++){
			data[i].seat = booking[i];
		}
		setStorage(id, data);
		form.remove();

		document.body.innerHTML = `
			<h1 class='title'>Спасибо, хорошего полёта</h1>
			<h2 class='title'>${booking.length === 1 ? 
				`Ваше место ${booking}` :
				`Ваши места ${booking}`}</h2>
		`;
	});
};

const airplane = (main, data, tourData) => {	
	const numberSeats = data.length;
	const title = numberSeats > 1 && numberSeats < 5 ? `Выберите ${numberSeats} места`  : 
		numberSeats > 4 && numberSeats < 21 ? `Выберите ${numberSeats} мест` : 
		`Выберите ${numberSeats} место`;
	//const title = `Выберите ${declofNum(data.length, ['место', 'места', 'мест'])}`;
			
	const choiseForm = createAirplane(title, tourData);
	checkSeat(choiseForm, data, tourData.id);
	main.append(choiseForm);
};

export default airplane;