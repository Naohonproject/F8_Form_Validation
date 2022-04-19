/** @format */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Constructor function
function Validator(options) {
	// save rules
	var selectorRules = {};
	// input handler
	function removeError(inputElement) {
		const formGroup = inputElement.closest(options.formGroup);
		const formMessage = formGroup.querySelector(options.errorSelector);
		if (formMessage.innerText) {
			formMessage.innerText = "";
			formGroup.classList.remove("invalid");
		}
	}

	// blur handler
	// validating function,
	function validate(inputElement, rule) {
		var errorMessage;
		// get rules for each input that was blur
		var rules = selectorRules[rule.selector];
		// for to assign rule for input, if meet the error condition, break the for loop
		for (let i = 0; i < rules.length; i++) {
			switch (inputElement.type) {
				case "checkbox": case "radio": {
					errorMessage = rules[i](
						formElement.querySelector("input[checked]")
					);
					break;
				}	
				default: {
						errorMessage = rules[i](inputElement.value);
					}
			}
			if (errorMessage) {
				break;
			}
		}

		const formGroup = inputElement.closest(options.formGroup));
		const formMessage = formGroup.querySelector(options.errorSelector);
		if (errorMessage) {
			formGroup.classList.add("invalid");
			formMessage.innerText = errorMessage;
		} else {
			formGroup.classList.remove("invalid");
			formMessage.innerText = "";
		}
		return !errorMessage;
	}

	const formElement = $(options.form);
	if (formElement) {
		// handle submit form event
		formElement.onsubmit = function (event) {
			event.preventDefault();
			var isValidForm = true;
			options.rules.forEach(function (rule) {
				let inputElement = formElement.querySelector(rule.selector);
				var isValid = validate(inputElement, rule);
				if (!isValid) {
					isValidForm = false;
				}
			});

			if (isValidForm) {
				if (typeof options.onsubmit === "function") {
					var enableInput = formElement.querySelectorAll(
						"[name]:not([disable])"
					);
					var formValue = Array.from(enableInput).reduce(function (
						value,
						input
					) {
						value[input.name] = input.value;
						return value;
					},
					{});
					options.onsubmit(formValue);
				}
				// submit with default function
				else {
					formElement.submit();
				}
			}
		};
		// loop into rules and handle
		options.rules.forEach(function (rule) {
			// take all rule for all input
			if (Array.isArray(selectorRules[rule.selector])) {
				selectorRules[rule.selector].push(rule.test);
			} else {
				selectorRules[rule.selector] = [rule.test];
			}

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
