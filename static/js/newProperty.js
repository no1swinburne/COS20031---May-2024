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
    let result = true;

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

    return result;
}

// Initialize form handlers
function initForm() {
    console.log("init...")
    let propertyDetailsForm = document.getElementById("property-details-form");

    if (propertyDetailsForm !== null) {
        window.onclick = function(event) {
            if (event.target == propertyDetailsForm) {
                closeForm();
            }
        };

        propertyDetailsForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            resetAllAlerts();

            if (!validatePropertyDetails()) {
                return;
            }

            // AJAX API call would go here
            // Nice one an 
            // - hieu
        });
    }
}

// Initialize input change handlers
function initPropertyDetailsInputChangeStatus() {
    let inputs = [
        ['name', 'Please enter the property name.'],
        ['street', 'Please enter the street.'],
        ['city', 'Please enter the city.'],
        ['state', 'Please enter the state.'],
        ['area', 'Please enter a valid area.'],
        ['number-floors', 'Please enter a valid number of floors.'],
        ['number-bedrooms', 'Please enter a valid number of bedrooms.'],
        ['number-bathrooms', 'Please enter a valid number of bathrooms.'],
        ['description', 'Please enter a description.']
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


// Display Data from form
document.addEventListener("DOMContentLoaded", function() {
    loadProperties();

    document.getElementById("properties-list-try-again").addEventListener("click", function() {
        loadProperties();
    });
});

function loadProperties() {
    const propertiesList = document.getElementById("properties-list");
    const propertiesLoading = document.getElementById("properties-loading-skeleton");
    const propertiesNotFound = document.getElementById("properties-not-found");
    const propertiesError = document.getElementById("properties-error");

    propertiesLoading.classList.remove("hidden");
    propertiesList.classList.add("hidden");
    propertiesNotFound.classList.add("hidden");
    propertiesError.classList.add("hidden");

    fetch('../api/myProperties/displayNewProperty.php')
        .then(response => response.json())
        .then(data => {
            propertiesLoading.classList.add("hidden");

            if (data.code === 200) {
                if (data.properties.length > 0) {
                    propertiesList.innerHTML = data.properties.map(property => `
                        <div class="bg-white border-gray-300 border-2 rounded-lg shadow-lg hover:shadow-2xl transition">
                            <img src="${property.image_url}" alt="Property Image" class="w-full h-30 max-h-52 object-cover object-center rounded-t-lg mb-3">

                            <div class="px-4 pb-4">
                                <div class="flex justify-between items-center mb-2">
                                    <div class="text text-left py-1 px-3 rounded-full bg-red-200 text-red-500 w-max">${property.status}</div>
                                </div>
                                
                                <h3 class="text-2xl font-bold text-left">${property.name}</h3>
                                <p class="text-gray-600 text-left mt-2">${property.description}</p>

                                <a class="py-2 text-xl font-bold border-2 border-blue-600 w-full mt-3 rounded-lg bg-white text-blue-600 hover:bg-blue-600 hover:text-white active:opacity-20 transition">
                                    View details
                                </a>
                            </div>
                        </div>
                    `).join('');
                    propertiesList.classList.remove("hidden");
                } else {
                    propertiesNotFound.classList.remove("hidden");
                }
            } else {
                propertiesError.classList.remove("hidden");
            }
        })
        .catch(() => {
            propertiesLoading.classList.add("hidden");
            propertiesError.classList.remove("hidden");
        });
}
