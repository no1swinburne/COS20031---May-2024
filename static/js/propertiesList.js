let offset = 0;
let mode = "owning";
let disabled = false;

function toggleRadioButtons(status) {
    const owningRadio = document.getElementById(`owning`);
    const rentingRadio = document.getElementById(`renting`);
    const forRentRadio = document.getElementById(`forRent`);
   
    [owningRadio, rentingRadio, forRentRadio].forEach(function(radio) {
        radio.disabled = status;
    });
}

async function getPropertiesList() {

    if(disabled) return;
    disabled = true;

    const loadingSkeleton = document.getElementById(`properties-loading-skeleton`);
    const notFound = document.getElementById(`properties-not-found`);
    const errorScreen = document.getElementById(`properties-error`);
    const propertiesListCard = document.getElementById(`properties-list`);
    const getMoreArea = document.getElementById(`properties-list-see-more`);
    const getMoreBtn = document.getElementById(`properties-list-see-more-btn`);

    toggleRadioButtons(disabled);

    if(offset == 0) {
        propertiesListCard.innerHTML = "";
        addClass(notFound, "hidden");
        addClass(propertiesListCard, "hidden");
        addClass(errorScreen, "hidden");
        addClass(getMoreArea, "hidden");
        removeClass(loadingSkeleton, "hidden");
    }
    else {
        getMoreBtn.disabled = true;
        getMoreBtn.innerHTML = '<i class="animate-spin fas fa-spinner"></i>  Loading...';
    }

    try {
        const getPropertiesRequest = await fetch(`../api/myProperties/getPropertiesList.php?offset=${offset}&mode=${mode}`, {
            method: "GET",
        })
        
        const response = await getPropertiesRequest.json();

        if(response.propertiesCount == 0 && offset == 0) {
            removeClass(notFound, "hidden");
            addClass(loadingSkeleton, "hidden");
        }
        else {
            removeClass(propertiesListCard, "hidden");
            addClass(loadingSkeleton, "hidden");
            addClass(notFound, "hidden");
        }


        let propertiesList = response.propertiesList;
        let propertiesHTML = "";

        for(let i = 0; i < propertiesList.length; i++) {
            let propertyDetails = propertiesList[i];
            console.log(propertyDetails);
            let propertyCard = `<div class="bg-white border-gray-300 border-2 rounded-lg shadow-lg hover:shadow-2xl transition">
                    <img src="${propertyDetails.imageURL}" alt="${propertyDetails.name}" class="w-full h-30 max-h-52 object-cover object-center rounded-t-lg mb-3">

                    <div class="px-4 pb-4">
                        <h3 class="text-2xl font-bold text-left">${propertyDetails.name}</h3>
                        <p class="text-gray-600 text-left mt-2">${propertyDetails.description}</p>

                        <a href=" getPropertiesDetail.html?id=${propertyDetails.id}" class="block text-center py-2 text-xl font-bold border-2 border-blue-600 w-full mt-3 rounded-lg bg-white text-blue-600 hover:bg-blue-600 hover:text-white active:opacity-20 transition">
                            View details
                        </a>
                    </div>
                </div>`;
            
            propertiesHTML += propertyCard;
        }
        propertiesListCard.innerHTML = propertiesListCard.innerHTML + propertiesHTML;

        
        
        if(typeof response.nextOffset !== "undefined") {
            removeClass(getMoreArea, "hidden");
            offset = parseInt(response.nextOffset);
            console.log("Offset: " + response.nextOffset);
        }
        else {
            addClass(getMoreArea, "hidden");
        }


    } catch (error) {
        console.log("error!!!!");
        console.log(error);
        removeClass(errorScreen, "hidden");
        addClass(loadingSkeleton, "hidden");
    } finally {
        disabled = false;
        getMoreBtn.disabled = false;
        getMoreBtn.innerHTML = '<i class="fas fa-angle-down"></i>  See more';
        toggleRadioButtons(disabled);
    }
}

window.onload = async function() {

    let loginSessionCheck = await checkLoginSession();
    if(!loginSessionCheck) {
        window.location = "../authentication";
    }

    initForm();
    
    initPropertyDetailsInputChangeStatus();
    handleDisplayForm();

    console.log("truong to init form");

    getPropertiesList();

    console.log("truong to get prop form");

    const getMoreBtn = document.getElementById(`properties-list-see-more`);
    const tryAgainBtn = document.getElementById(`properties-list-try-again`);

    const owningRadio = document.getElementById(`owning`);
    const rentingRadio = document.getElementById(`renting`);
    const forRentRadio = document.getElementById(`forRent`);

    getMoreBtn.addEventListener('click', async function() {

        getPropertiesList();
    });

    tryAgainBtn.addEventListener('click', async function() {
        getPropertiesList();
    });

    [owningRadio, rentingRadio, forRentRadio].forEach(function(radio) {
        radio.addEventListener('change', async function() {
            console.log("truong to get prop form");
            if(radio.checked == true) {
                offset = 0;
                mode = radio.id;
                getPropertiesList();
            }
        })
    });

    // loadProperties();
    
};