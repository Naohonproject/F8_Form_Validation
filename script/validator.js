/** @format */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Constructor function
function Validator(options) {
	// input handler
	function removeError(inputElement) {
		const formGroup = inputElement.closest(".form-group");
		const formMessage = formGroup.querySelector(options.errorSelector);
		if (formMessage.innerText) {
			formMessage.innerText = "";
			formGroup.classList.remove("invalid");
		}
	}

	// blur handler
	// validating function,
	function validate(inputElement, rule) {
		let errorMessage = rule.test(inputElement.value);
		const formGroup = inputElement.closest(".form-group");
		const formMessage = formGroup.querySelector(options.errorSelector);
		if (errorMessage) {
			formGroup.classList.add("invalid");
			formMessage.innerText = errorMessage;
		} else {
			formGroup.classList.remove("invalid");
			formMessage.innerText = "";
		}
	}

	const formElement = $(options.form);
	if (formElement) {
		options.rules.forEach(function (rule) {
			let inputElement = formElement.querySelector(rule.selector);
			if (inputElement) {
				// blur handling
				inputElement.onblur = function () {
					validate(inputElement, rule);
				};
				// input handling
				inputElement.oninput = function () {
					removeError(inputElement);
				};
			}
		});
	}
}

// define Rules
Validator.isRequired = function (selector, mess) {
	return {
		selector: selector,
		test: function (inputValue) {
			return inputValue.trim() ? undefined : mess || "Vui lòng nhập trường này";
		},
	};
};

Validator.isEmail = function (selector, mess) {
	return {
		selector: selector,
		test: function (inputValue) {
			const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
			return regex.test(inputValue)
				? undefined
				: mess || "Vui Lòng nhập đúng định dạng email";
		},
	};
};

Validator.minLength = function (selector, minLength, mess) {
	return {
		selector: selector,
		test: function (inputValue) {
			return inputValue.length >= minLength
				? undefined
				: mess || `Mật khẩu cần ít nhất ${minLength} ký tự`;
		},
	};
};

Validator.isConfirmedPassword = function (selector, getPassword, mess) {
	return {
		selector: selector,
		test: function (inputValue) {
			return inputValue === getPassword()
				? undefined
				: mess || "Gia trị nhập vào  không khớp, xin hãy xác nhận lại";
		},
	};
};
