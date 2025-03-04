document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('employmentForm');
    const formContainer = document.getElementById('formContainer');
    const successMessage = document.getElementById('successMessage');
    const inputs = form.querySelectorAll('input, textarea, select');

    const validations = {
        fullName: {
            pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,50}$/,
            message: 'Nombre debe contener solo letras y tener entre 3 y 50 caracteres'
        },
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Email no válido'
        },
        phone: {
            pattern: /^\d{8,15}$/,
            message: 'Teléfono debe tener entre 8 y 15 dígitos'
        },
        birthdate: {
            custom: (value) => {
                if (!value) return false;
                const birthDate = new Date(value);
                const today = new Date();
                let calculatedAge = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    calculatedAge--;
                }
                
                return calculatedAge >= 18 && calculatedAge <= 100;
            },
            message: 'Debes ser mayor de 18 años'
        },
        salary: {
            custom: (value) => {
                const salary = parseFloat(value);
                return !isNaN(salary) && salary >= 0 && salary <= 1000000;
            },
            message: 'Salario debe estar entre 0 y 1,000,000'
        },
        website: {
            pattern: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
            message: 'URL no válida'
        },
        position: {
            pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,50}$/,
            message: 'Ingrese un puesto válido'
        },
        experience: {
            custom: (value) => value.trim().length >= 30,
            message: 'Por favor, proporcione al menos 30 caracteres sobre su experiencia'
        },
        education: {
            custom: (value) => value.trim().length >= 20,
            message: 'Por favor, proporcione al menos 20 caracteres sobre su educación'
        },
        // Se mantiene la validación, pero se validará de forma separada
        english: {
            custom: () => {
                const radioButtons = document.querySelectorAll('input[name="english"]');
                return Array.from(radioButtons).some(radio => radio.checked);
            },
            message: 'Seleccione un nivel de inglés'
        }
    };

    function validateInput(input) {
        const validation = validations[input.id] || validations[input.name];
        let errorElement;
        
        if (input.type === 'radio') {
            const radioGroup = input.closest('.radio-group');
            errorElement = radioGroup.nextElementSibling;
        } else {
            errorElement = input.nextElementSibling;
        }

        if (!errorElement || !errorElement.classList.contains('error-message')) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            if (input.type === 'radio') {
                input.closest('.radio-group').parentNode.appendChild(errorElement);
            } else {
                input.parentNode.insertBefore(errorElement, input.nextSibling);
            }
        }

        let isValid = true;
        let errorMessage = '';

        if (input.required) {
            if (input.type === 'radio') {
                const radioButtons = document.querySelectorAll(`input[name="${input.name}"]`);
                if (!Array.from(radioButtons).some(radio => radio.checked)) {
                    isValid = false;
                    errorMessage = 'Este campo es requerido';
                }
            } else if (!input.value.trim()) {
                isValid = false;
                errorMessage = 'Este campo es requerido';
            }
        }

        if (isValid && validation) {
            if (validation.pattern && !validation.pattern.test(input.value)) {
                isValid = false;
                errorMessage = validation.message;
            } else if (validation.custom && !validation.custom(input.value)) {
                isValid = false;
                errorMessage = validation.message;
            }
        }

        if (input.type === 'radio') {
            const radioGroup = input.closest('.radio-group');
            radioGroup.classList.toggle('invalid', !isValid);
        } else {
            input.classList.toggle('invalid', !isValid);
        }
        errorElement.textContent = errorMessage;

        return isValid;
    }

    inputs.forEach(input => {
        if (input.type === 'radio') {
            input.addEventListener('change', () => {
                const radioButtons = document.querySelectorAll(`input[name="${input.name}"]`);
                radioButtons.forEach(radio => validateInput(radio));
            });
        } else {
            ['input', 'blur', 'change'].forEach(eventType => {
                input.addEventListener(eventType, () => validateInput(input));
            });
        }
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        let allValid = true;
        // Validar todos los inputs que no son radio
        inputs.forEach(input => {
            if (input.type !== 'radio' && !validateInput(input)) {
                allValid = false;
            }
        });
        // Validar el grupo de radio "english" de forma separada
        const englishRadios = document.querySelectorAll('input[name="english"]');
        const radioGroup = document.querySelector('.radio-group');
        let radioErrorElement = radioGroup.nextElementSibling;
        if (!radioErrorElement || !radioErrorElement.classList.contains('error-message')) {
            radioErrorElement = document.createElement('span');
            radioErrorElement.className = 'error-message';
            radioGroup.parentNode.appendChild(radioErrorElement);
        }
        if (!Array.from(englishRadios).some(radio => radio.checked)) {
            radioErrorElement.textContent = validations.english.message;
            radioGroup.classList.add('invalid');
            allValid = false;
        } else {
            radioErrorElement.textContent = '';
            radioGroup.classList.remove('invalid');
        }
        
        if (allValid) {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            console.log('Datos del formulario:', data);
            
            formContainer.style.display = 'none';
            successMessage.style.display = 'block';
        }
    });
});
