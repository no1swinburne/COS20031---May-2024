function modifyAlertMessage(status, input, message) {
    let alertElement = input.nextElementSibling;
    if(input.type === "checkbox") {
        alertElement = alertElement.nextElementSibling;
    }
    if(status == "show") {
        removeClass(alertElement, "hidden");
        alertElement.innerText = message;
    }
    else {
        addClass(alertElement, "hidden");
        alertElement.innerText = "";
    }
}

function modifyGeneralAlertMessage(status, alertId, message, code = "error") {
    let alertElement = document.getElementById(alertId);

    removeClass(alertElement, "bg-red-100", "text-red-700", "bg-green-100", "text-green-700");

    if(code == "error") {
        addClass(alertElement, "bg-red-100", "text-red-700");
        alertElement.innerHTML = `<i class="fas fa-exclamation-triangle"></i><span>${message}</span>`;
    }
    else if(code == "success") {
        addClass(alertElement, "bg-green-100", "text-green-700");
        alertElement.innerHTML = `<i class="fas fa-check"></i><span>${message}</span>`;
    }

    if(status == "show") {
        removeClass(alertElement, "hidden");
    }
    else {
        addClass(alertElement, "hidden");
    }
}

function resetAllAlerts() {
    var textAlertsList = [...document.querySelectorAll(`[id*="-alert"]`)];
    for(let i = 0; i < textAlertsList.length; i++) {
        addClass(textAlertsList[i], "hidden");
    }

    var alertInputsList = [...document.querySelectorAll(`input`)];
    for(let i = 0; i < alertInputsList.length; i++) {
        removeClass(alertInputsList[i], "border-pink-500", "text-pink-600", "ring-pink-500");
    }
}

// Validate Login Inputs
function validateLogin() {

    let usernameInput = document.getElementById('username');
    let passwordInput = document.getElementById('password');

    let errMsg = ""; 
    let result = true; 

    if (usernameInput.value.trim() === "") {
        addClass(usernameInput, "border-pink-500", "text-pink-600", "ring-pink-500")
        modifyAlertMessage("show", usernameInput, "Please enter your username.");

        result = false;
    }

    if (passwordInput.value === "") {
        addClass(passwordInput, "border-pink-500", "text-pink-600", "ring-pink-500")
        modifyAlertMessage("show", passwordInput, "Please enter your password.");

        result = false;
    }

    return result;
}

// Validate SignUp Inputs
function validateSignUp() {

    let signupButton = document.getElementById("signup-button");

    let fullnameSignUpInput = document.getElementById('name-signup');
    let usernameSignUpInput = document.getElementById('username-signup');
    let natureSignUpInput = document.getElementById('nature-signup');
    let passwordSignUpInput = document.getElementById('password-signup');
    let confirmPasswordSignUpInput = document.getElementById('password-confirm-signup');
    let acceptPolicySignupCheckbox = document.getElementById('accept-policy');

    let result = true; 

    let alphanumericPattern = /^[a-zA-Z0-9]+$/;
    let lettersPattern = /^[a-zA-Z\s]+$/;

    if (fullnameSignUpInput.value.trim() === "") {
        addClass(fullnameSignUpInput, "border-pink-500", "text-pink-600", "ring-pink-500")
        modifyAlertMessage("show", fullnameSignUpInput, "Please enter your full name.");

        result = false;
    }
    else if(!fullnameSignUpInput.value.match(lettersPattern) || fullnameSignUpInput.length > 25) {
        addClass(fullnameSignUpInput, "border-pink-500", "text-pink-600", "ring-pink-500")
        modifyAlertMessage("show", fullnameSignUpInput, "Max 25 characters (a-z, A-Z, spaces) are allowed.");

        result = false;
    }

    if (usernameSignUpInput.value.trim() === "") {
        addClass(usernameSignUpInput, "border-pink-500", "text-pink-600", "ring-pink-500")
        modifyAlertMessage("show", usernameSignUpInput, "Please enter your username.");

        result = false;
    }
    else if(!usernameSignUpInput.value.match(alphanumericPattern)) {
        addClass(usernameSignUpInput, "border-pink-500", "text-pink-600", "ring-pink-500")
        modifyAlertMessage("show", usernameSignUpInput, "Max 20 characters (a-z, A-Z, 0-9) are allowed. No whitespace.");

        result = false;
    }

    if (passwordSignUpInput.value.trim() === "") {
        addClass(passwordSignUpInput, "border-pink-500", "text-pink-600", "ring-pink-500")
        modifyAlertMessage("show", passwordSignUpInput, "The password must have at least 8 characters.");

        result = false;
    }

    if (natureSignUpInput.value.trim() === "") {
        addClass(natureSignUpInput, "border-pink-500", "text-pink-600", "ring-pink-500")
        modifyAlertMessage("show", natureSignUpInput, "Please select a nature.");

        result = false;
    }

    if (confirmPasswordSignUpInput.value.trim() === "") {
        addClass(confirmPasswordSignUpInput, "border-pink-500", "text-pink-600", "ring-pink-500")
        modifyAlertMessage("show", confirmPasswordSignUpInput, "The confirm password must have at least 8 characters.");

        result = false;
    }
    else if (passwordSignUpInput.value !== confirmPasswordSignUpInput.value) {
        addClass(confirmPasswordSignUpInput, "border-pink-500", "text-pink-600", "ring-pink-500")
        modifyAlertMessage("show", confirmPasswordSignUpInput, "The confirm password does not match.");

        result = false;
    }

    if (!acceptPolicySignupCheckbox.checked) {
        addClass(acceptPolicySignupCheckbox, "border-pink-500", "text-pink-600", "ring-pink-500")
        modifyAlertMessage("show", acceptPolicySignupCheckbox, "You must agree with the ToF and the privacy policy.");

        result = false;
    }

    return result;
}

function toggleDisabledInputs(inputs, disabledStatus) {
    for(let i = 0; i < inputs.length; i++) {
        inputs[i].disabled = disabledStatus;
    }
}

function init() {
    let loginForm = document.getElementById("user-login-form");
    let loginButton = document.getElementById("sign-in");

    let usernameInput = document.getElementById('username');
    let passwordInput = document.getElementById('password');

    if (loginForm !== null && loginButton !== null) {
        loginForm.addEventListener('submit', async function(event) {

            event.preventDefault();

            modifyGeneralAlertMessage("hide", "sign-in-alert", "")

            toggleDisabledInputs([loginButton, usernameInput, passwordInput], true);

            resetAllAlerts();
            

            if (!validateLogin()) {
                toggleDisabledInputs([loginButton, usernameInput, passwordInput], false);
                return;
            }

            try {
                const formData = new FormData();
                formData.append("username", usernameInput.value);
                formData.append("password", passwordInput.value);

                const loginRequest = await fetch("../api/authentication/handleLogin.php", {
                    method: "POST",
                    body: formData,
                })
                
                const response = await loginRequest.json();
                
                if(response.code == 200) {
                    document.location.href = '../index.html';
                }
                else {
                    modifyGeneralAlertMessage("show", "sign-in-alert", response.description);
                }

            } catch (error) {
                modifyGeneralAlertMessage("show", "sign-in-alert", "Something went wrong. Please try again later")
            }
            finally {
                toggleDisabledInputs([loginButton, usernameInput, passwordInput], false);
            }

        });
    }
}

function initSignupValidation() {
    let signupForm = document.getElementById("user-signup-form");
    let signupButton = document.getElementById("signup-button");

    let fullnameSignUpInput = document.getElementById('name-signup');
    let usernameSignUpInput = document.getElementById('username-signup');
    let natureSignUpInput = document.getElementById('nature-signup');
    let passwordSignUpInput = document.getElementById('password-signup');
    let confirmPasswordSignUpInput = document.getElementById('password-confirm-signup');
    let acceptPolicySignupCheckbox = document.getElementById('accept-policy');

    if (signupForm !== null && signupButton !== null) {
        signupForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            modifyGeneralAlertMessage("hide", "sign-up-alert", "");

            resetAllAlerts();

            toggleDisabledInputs([signupButton, fullnameSignUpInput, usernameSignUpInput, natureSignUpInput, passwordSignUpInput, confirmPasswordSignUpInput, acceptPolicySignupCheckbox], true);

            if (!validateSignUp()) {
                toggleDisabledInputs([signupButton, fullnameSignUpInput, usernameSignUpInput, natureSignUpInput, passwordSignUpInput, confirmPasswordSignUpInput, acceptPolicySignupCheckbox], false);
                return;
            }

            try {
                const formData = new FormData();

                formData.append("name-signup", fullnameSignUpInput.value);
                formData.append("username-signup", usernameSignUpInput.value);
                formData.append("password-signup", passwordSignUpInput.value);
                formData.append("password-confirm-signup", confirmPasswordSignUpInput.value);
                formData.append("nature-signup", natureSignUpInput.value);

                const signupRequest = await fetch("../api/authentication/handleSignup.php", {
                    method: "POST",
                    body: formData,
                })
                
                const response = await signupRequest.json();
                
                if(response.code == 200) {
                    modifyGeneralAlertMessage("show", "sign-up-alert", response.description, "success");
                }
                else {
                    modifyGeneralAlertMessage("show", "sign-up-alert", response.description);

                    let detailErrors = response.detailErrors;
                    for(let i = 0; i < detailErrors.length; i++) {
                        let element = document.getElementById(detailErrors[i].input);
                        addClass(element, "border-pink-500", "text-pink-600", "ring-pink-500")
                        modifyAlertMessage("show", element, detailErrors[i].errorDescription);
                    }
                }

            } catch (error) {
                modifyGeneralAlertMessage("show", "sign-up-alert", "Something went wrong. Please try again later")
            }
            finally {
                toggleDisabledInputs([signupButton, fullnameSignUpInput, usernameSignUpInput, natureSignUpInput, passwordSignUpInput, confirmPasswordSignUpInput, acceptPolicySignupCheckbox], false);
            }
        });
    }
}

function initSignInInputChangeStatus() {

    let inputs = [
        ['username', ''],
        ['password', '']
    ];

    for(let i = 0; i < inputs.length; i++) {
        let element = document.getElementById(inputs[i][0]);
        element.addEventListener('keyup', (e) => {
            if(e.target.value.trim() !== "") {
                removeClass(element, "border-pink-500", "text-pink-600", "ring-pink-500")
                modifyAlertMessage("hide", element, inputs[i][1]);
            }
        });
    }

}

function initSignUpInputChangeStatus() {

    let inputs = [
        ['name-signup', 'Max 25 characters (a-z, A-Z, spaces) are allowed.'],
        ['username-signup', 'Max 20 characters (a-z, A-Z, 0-9) are allowed. No whitespace.'],
        ['password-signup', 'The password must have at least 8 characters.'],
        ['password-confirm-signup', 'The confirm password must have at least 8 characters.']
    ];

    for(let i = 0; i < inputs.length; i++) {
        let element = document.getElementById(inputs[i][0]);
        element.addEventListener('keyup', (e) => {
            if(e.target.value.trim() !== "") {
                removeClass(element, "border-pink-500", "text-pink-600", "ring-pink-500")
                if(e.target.validity.valid) {
                    modifyAlertMessage("hide", element, inputs[i][1]);
                }
                else {
                    modifyAlertMessage("show", element, inputs[i][1]);
                }
            }
        });
    }

    let acceptPolicySignupCheckbox = document.getElementById('accept-policy');
    acceptPolicySignupCheckbox.addEventListener('change', (e) => {
        if(e.target.checked) {
            console.log("Checked!")
            modifyAlertMessage("hide", acceptPolicySignupCheckbox, "");
        }
        else {
            modifyAlertMessage("show", acceptPolicySignupCheckbox, "You must agree with the ToF and the privacy policy.");
        }
    });
    
}

window.onload = function() {
    init();
    initSignupValidation();
    initSignInInputChangeStatus();
    initSignUpInputChangeStatus();

    const userSignupBtn = document.getElementById('back-to-signup-form');
    const userLoginBtn = document.getElementById('back-to-signin-form');
    const overlayContainer = document.getElementById('overlay-container');
    const userLogin = document.getElementById('user-login');
    const userSignup = document.getElementById('user-signup');

    const userSignInBtn = document.getElementById('sign-in');

    userSignupBtn.addEventListener('click', () => {
        addClass(overlayContainer, '-translate-x-full');
        addClass(userLogin, 'transition', 'duration-700', 'opacity-0');
        removeClass(userLogin, 'opacity-100');
        addClass(userSignup, 'transition', 'duration-700', 'opacity-100');
        removeClass(userSignup, 'opacity-0');
    });

    userLoginBtn.addEventListener('click', () => {
        removeClass(overlayContainer, '-translate-x-full');
        addClass(userLogin, 'opacity-100');
        removeClass(userLogin, 'opacity-0');
        addClass(userSignup, 'opacity-0');
        removeClass(userSignup, 'opacity-100');
    });
};