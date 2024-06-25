function handleMultipleImageUpload() {
    document.getElementById('more').addEventListener('click', function() {
        const imageUploadContainer = document.getElementById('imageUploadContainer');
        const uploadSection = document.createElement('div');
        uploadSection.classList.add('upload-section');

        uploadSection.innerHTML = `
        <div class="flex">
            <input type="file" id="image-upload-1" name="images[]" accept="image/*" class="mt-1 block w-full px-3 py-2 bg-white border-gray-300 rounded-md focus:border-blue-600 focus:text-blue-600 focus:outline-none disabled:bg-gray-300 transition">
            <button type="button" class="deleteImage px-2 py-1 bg-red-500 text-black rounded mt-2">×</button>
            </div>
        <p class="text-pink-600 text-sm hidden" id="image-alert">Please upload an image.</p>
        `;
        
        const imageInputCount = imageUploadContainer.querySelectorAll('.upload-section').length + 1;

        imageUploadContainer.appendChild(uploadSection);
        
        const deleteButton = uploadSection.querySelector('.deleteImage');
        if (imageInputCount > 1) {
            deleteButton.classList.remove('hidden');
        } else {
            deleteButton.classList.add('hidden');
        }   

        uploadSection.querySelector('.deleteImage').addEventListener('click', function() {
            imageUploadContainer.removeChild(uploadSection);
        });
    });
}

function formValidation() {
    document.getElementById('property-details-form').addEventListener('submit', async function(event) {
        event.preventDefault();
    
        const form = event.target;
        const formData = new FormData(form);
    
        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: formData,
            });
    
            const result = await response.json();
    
            document.querySelectorAll('.text-pink-600').forEach(function(errorElement) {
                errorElement.classList.add('hidden');
                errorElement.previousElementSibling.classList.remove('border-pink-600');
            });
    
            if (response.ok) {
    
                alert('Form submitted successfully!');
                form.reset(); 
            } else {
    
                Object.keys(result.errors).forEach(function(key) {
                    const errorElement = document.getElementById(`${key}-alert`);
                    const inputElement = document.getElementById(key);
    
                    if (errorElement) {
                        errorElement.textContent = result.errors[key];
                        errorElement.classList.remove('hidden');
                    }
    
                    if (inputElement) {
                        inputElement.classList.add('border-pink-600');
                    }
                });
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    });
}

// Functions to handle alert messages
function modifyAlertMessage(status, input, message) {
    let alertElement = input.nextElementSibling;
    if (input.type === "checkbox") {
        alertElement = alertElement.nextElementSibling;
    }
    if (status === "show") {
        removeClass(alertElement, "hidden");
        alertElement.innerText = message;
    } else {
        addClass(alertElement, "hidden");
        alertElement.innerText = "";
    }
}

function modifyGeneralAlertMessage(status, alertId, message, code = "error") {
    let alertElement = document.getElementById(alertId);

    console.log(`Alert ID: ${alertId}`);
    console.log(`Alert Element:`, alertElement);

    if (alertElement) {
        removeClass(alertElement, "bg-red-100", "text-red-700", "bg-green-100", "text-green-700");

        if (code === "error") {
            addClass(alertElement, "bg-red-100", "text-red-700");
            alertElement.innerHTML = `<i class="fas fa-exclamation-triangle"></i><span>${message}</span>`;
        } else if (code === "success") {
            addClass(alertElement, "bg-green-100", "text-green-700");
            alertElement.innerHTML = `<i class="fas fa-check"></i><span>${message}</span>`;
        }

        if (status === "show") {
            removeClass(alertElement, "hidden");
        } else {
            addClass(alertElement, "hidden");
        }
    } else {
        console.error(`Element with ID ${alertId} not found.`);
    }
}


function resetAllAlerts() {
    var textAlertsList = [...document.querySelectorAll(`[id*="-alert"]`)];
    for (let i = 0; i < textAlertsList.length; i++) {
        addClass(textAlertsList[i], "hidden");
    }

    var alertInputsList = [...document.querySelectorAll(`input`)];
    for (let i = 0; i < alertInputsList.length; i++) {
        removeClass(alertInputsList[i], "border-pink-500", "text-pink-600", "ring-pink-500");
    }
}

// Functions to handle form display
function displayForm() {
    var addPropertyForm = document.getElementById("addPropertyForm");
    removeClass(addPropertyForm, "hidden");
    addClass(document.getElementById('main'), "blur-background");
    addClass(addPropertyForm, 'transform-active');
    removeClass(addPropertyForm, 'transform');
}

function closeForm() {
    var addPropertyForm = document.getElementById("addPropertyForm");
    addClass(addPropertyForm, 'transform');
    removeClass(addPropertyForm, 'transform-active');
    setTimeout(function() {
        addClass(addPropertyForm, "hidden");
        removeClass(document.getElementById('main'), "blur-background");
    }, 200);
}

// Validation function
function validatePropertyDetails() {
    let nameInput = document.getElementById('name');
    let streetInput = document.getElementById('street');
    let cityInput = document.getElementById('city');
    let stateInput = document.getElementById('state');
    let areaInput = document.getElementById('area');
    let floorsInput = document.getElementById('number-floors');
    let bedroomsInput = document.getElementById('number-bedrooms');
    let bathroomsInput = document.getElementById('number-bathrooms');
    let descriptionInput = document.getElementById('description');
    let imageInputs = Array.from(document.querySelectorAll('input[type="file"]'));
    let result = true;

    const allowedMimeTypes = ['image/jpeg', 'image/png'];
    const maxFileSize = 5 * 1024 * 1024; // 5MB in bytes

    if (nameInput.value.trim() === "") {
        addClass(nameInput, "border-pink-500", "text-pink-600", "ring-pink-500");
        modifyAlertMessage("show", nameInput, "Please enter the property name.");
        result = false;
    }

    if (streetInput.value.trim() === "") {
        addClass(streetInput, "border-pink-500", "text-pink-600", "ring-pink-500");
        modifyAlertMessage("show", streetInput, "Please enter the street.");
        result = false;
    }

    if (cityInput.value.trim() === "") {
        addClass(cityInput, "border-pink-500", "text-pink-600", "ring-pink-500");
        modifyAlertMessage("show", cityInput, "Please enter the city.");
        result = false;
    }

    if (stateInput.value.trim() === "") {
        addClass(stateInput, "border-pink-500", "text-pink-600", "ring-pink-500");
        modifyAlertMessage("show", stateInput, "Please enter the state.");
        result = false;
    }

    if (areaInput.value.trim() === "" || parseInt(areaInput.value) <= 0) {
        addClass(areaInput, "border-pink-500", "text-pink-600", "ring-pink-500");
        modifyAlertMessage("show", areaInput, "Please enter a valid area.");
        result = false;
    }

    if (floorsInput.value.trim() === "" || parseInt(floorsInput.value) <= 0) {
        addClass(floorsInput, "border-pink-500", "text-pink-600", "ring-pink-500");
        modifyAlertMessage("show", floorsInput, "Please enter a valid number of floors.");
        result = false;
    }

    if (bedroomsInput.value.trim() === "" || parseInt(bedroomsInput.value) <= 0) {
        addClass(bedroomsInput, "border-pink-500", "text-pink-600", "ring-pink-500");
        modifyAlertMessage("show", bedroomsInput, "Please enter a valid number of bedrooms.");
        result = false;
    }

    if (bathroomsInput.value.trim() === "" || parseInt(bathroomsInput.value) <= 0) {
        addClass(bathroomsInput, "border-pink-500", "text-pink-600", "ring-pink-500");
        modifyAlertMessage("show", bathroomsInput, "Please enter a valid number of bathrooms.");
        result = false;
    }

    if (descriptionInput.value.trim() === "") {
        addClass(descriptionInput, "border-pink-500", "text-pink-600", "ring-pink-500");
        modifyAlertMessage("show", descriptionInput, "Please enter a description.");
        result = false;
    }

    imageInputs.forEach((imageInput, index) => {
        let files = imageInput.files;
        if (files.length === 0) {
            addClass(imageInput, "border-pink-500", "text-pink-600", "ring-pink-500");
            modifyAlertMessage("show", imageInput, `Please upload at least one file.`);
            result = false;
        } else {
            for (let file of files) {
                if (!allowedMimeTypes.includes(file.type)) {
                    addClass(imageInput, "border-pink-500", "text-pink-600", "ring-pink-500");
                    modifyAlertMessage("show", imageInput, `Invalid file type. Only JPEG and PNG files are allowed.`);
                    result = false;
                }

                if (file.size > maxFileSize) {
                    addClass(imageInput, "border-pink-500", "text-pink-600", "ring-pink-500");
                    modifyAlertMessage("show", imageInput, `File size should not exceed 5MB.`);
                    result = false;
                }
            }
        }
    });
    // MISSING MANY UPLOAD FILE VALIDATION

    return result;
}

// Initialize form handlers
async function initForm() {
    console.log("init...")
    let propertyDetailsForm = document.getElementById("property-details-form");

    if (propertyDetailsForm !== null) {
        window.onclick = function(event) {
            if (event.target == propertyDetailsForm) {
                closeForm();
            }
        };

        propertyDetailsForm.addEventListener('submit', async function(event) {

            // Disable form activity on submit
            document.getElementById('name').readOnly = true;
            document.getElementById('street').readOnly = true;
            document.getElementById('city').readOnly = true;
            document.getElementById('state').readOnly = true;
            document.getElementById('area').readOnly = true;
            document.getElementById('number-floors').readOnly = true;
            document.getElementById('number-bedrooms').readOnly = true;
            document.getElementById('number-bathrooms').readOnly = true;
            document.getElementById('has-yard').readOnly = true;
            document.getElementById('description').readOnly = true;

            event.preventDefault();
            resetAllAlerts();

            if (!validatePropertyDetails()) {
                return;
            }

            let formData = new FormData(propertyDetailsForm);

            try {
                const loginRequest = await fetch("../api/myProperties/handleNewProperty.php", {
                    method: "POST",
                    body: formData,
                })
                
                const response = await loginRequest.json();
                
                if(response.code == 200) {
                    offset = 0
                    getPropertiesList();
                    closeForm();
                }
                else {
                    modifyGeneralAlertMessage("show", "form-alert", response.description, "error");
                }

            } catch (error) {
                modifyGeneralAlertMessage("show", "form-alert", "Something went wrong. Please try again later")
            }
            finally {
            }
        });
    }
}

// Initialize input change handlers
function initPropertyDetailsInputChangeStatus() {
    let inputs = [
        // PLEASE UPLOAD AT LEAST 1 IMAGE
        ['name', 'Please enter the property name.'],
        ['street', 'Please enter the street.'],
        ['city', 'Please enter the city.'],
        ['state', 'Please enter the state.'],
        ['area', 'Please enter a valid area.'],
        ['number-floors', 'Please enter a valid number of floors.'],
        ['number-bedrooms', 'Please enter a valid number of bedrooms.'],
        ['number-bathrooms', 'Please enter a valid number of bathrooms.'],
        ['description', 'Please enter a description.'],
        ['image-upload-1', 'Please upload at least 1 image']
    ];

    for (let i = 0; i < inputs.length; i++) {
        let element = document.getElementById(inputs[i][0]);
        element.addEventListener('keyup', (e) => {
            if (e.target.value.trim() !== "") {
                removeClass(element, "border-pink-500", "text-pink-600", "ring-pink-500");
                modifyAlertMessage("hide", element, inputs[i][1]);
            }
        });
    }
}

// Handle form display on button click
function handleDisplayForm() {
    var addPropertyBtn = document.getElementById("addPropertyBtn");
    var closeBtn = document.querySelector("#addPropertyForm .close-btn");

    addPropertyBtn.addEventListener("click", displayForm);
    closeBtn.addEventListener("click", closeForm);
}

