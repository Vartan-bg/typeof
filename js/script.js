// функция filterByType принимает в качестве аргумента тип (выбранные в селекте) и массив элементов values, введённый в инпут (все значения записываются в массив благодаря spread-оператору), после чего массив фильтруется по принципу совпадения типа элемента с типом, выбранном в селекте
const filterByType = (type, ...values) => values.filter(value => typeof value === type),

	hideAllResponseBlocks = () => {
		const responseBlocksArray = Array.from(document.querySelectorAll('div.dialog__response-block'));
		responseBlocksArray.forEach(block => block.style.display = 'none');
	},
	//функция showResponseBlock() принимает в качестве аргументов селектор блока, текст сообщения и селектор спана
	showResponseBlock = (blockSelector, msgText, spanSelector) => {
		//выполняет функцию hideAllResponseBlocks(), которая прячет все блоки (строки 35-57 в документе index.html)
		hideAllResponseBlocks();
		//выводит на экран блок, переданный в качестве первого аргумента
		document.querySelector(blockSelector).style.display = 'block';
		//в случае передачи селектора спана, записывает в него msgText (в функции showNoResults() не передаётся селектор спана)
		if (spanSelector) {
			document.querySelector(spanSelector).textContent = msgText;
		}
	},
	//функции showError() showResults() и showNoResults() передают в функцию showResponseBlock() аргументы: селектор блока(div), сообщение внутри спана и сам селектор спана (span)
	showError = msgText => showResponseBlock('.dialog__response-block_error', msgText, '#error'),

	showResults = msgText => showResponseBlock('.dialog__response-block_ok', msgText, '#ok'),

	showNoResults = () => showResponseBlock('.dialog__response-block_no-results'),
// принимает зачение селектора и инпута
	tryFilterByType = (type, values) => {
		//выполняем try catch, чтобы код продолжил работать даже при ошибке
		try {
			//через eval выполняется функция filterByType() с аргументами селекта и данных инпута, и записывает их в valuesArray в виде строки
			const valuesArray = eval(`filterByType('${type}', ${values})`).join(", ");
			//в том случае, если в строке valuesArray есть хотя бы один символ, в переменную alertMsg записывается сообщение:
			const alertMsg = (valuesArray.length) ?
				//это
				`Данные с типом ${type}: ${valuesArray}` :
				//если строка valuesArray пустая, то в переменную alertMsg записывается это сообщение
				`Отсутствуют данные типа ${type}`;
			//и выводится на экран через функцию showResults(), передавая в неё alertMsg как msgText
			showResults(alertMsg);
		} catch (e) {
			//в том случае, если во время выполнения кода произошла ошибка, в поле вывода отобразится сообщение `Отсутствуют данные типа ${type}` и showError() с указанием ошибки
			showError(`Ошибка: ${e}`);
		}
	};
// находим ни странице кнопку "фильтровать"
const filterButton = document.querySelector('#filter-btn');
//вешаем событие при клике кнопки "фильтровать"
filterButton.addEventListener('click', e => {
	//находим селектор, в котором выбирает искомый type, и инпут, куда вводим значения
	const typeInput = document.querySelector('#type');
	const dataInput = document.querySelector('#data');
// если инпут пустой, вывести предупреждение
	if (dataInput.value === '') {
		dataInput.setCustomValidity('Поле не должно быть пустым!');
		//showNoResults() - поле вывода в изначальном состоянии "пока что нечего показать"
		showNoResults();
		// если инпут не пустой, выполнить функцию tryFilterByType(строка 22), аргументами которой являются значение селекта и значение инпута
	} else {
		dataInput.setCustomValidity('');
		e.preventDefault();
		tryFilterByType(typeInput.value.trim(), dataInput.value.trim());
	}
});

