const clickBox = document.getElementById('Cell');

// Add an event listener to the div to trigger a function when clicked
clickBox.addEventListener('click', function() {
    // Call your function here
    FillInInfo();
});


function storeData()
{
	var nameValue = document.getElementById('Name').value;
	var ageValue = document.getElementById('Age').value;

	
	localStorage.setItem('Name', nameValue);
	localStorage.setItem('Age', ageValue);
	
	const cellElement = document.getElementById('Cell');
	const name = localStorage.getItem('Name');

	cellElement.textContent = name;
	
	const textboxName = document.getElementById('Name');
	const textboxAge = document.getElementById('Age');
	const imageBox = document.getElementById('imageBox');
	
	textboxName.value = "";
	textboxAge.value = "";
	imageBox.style.backgroundImage = 'none';
}

function FillInInfo()
{
	const name = localStorage.getItem('Name');
	const age = localStorage.getItem('Age');
	const savedImage = localStorage.getItem('savedImage');
	
	const setName = document.getElementById('Name');
	const setAge = document.getElementById('Age');
	const setImage = document.getElementById('imageBox');
	
	setName.value = name;
	setAge.value = age;
	if (savedImage) {
        imageBox.style.backgroundImage = `url(${savedImage})`;
    } else {
        alert('No saved image found in Local Storage.');
    }
	
}

const imageInput = document.getElementById('imageInput');
const imageBox = document.getElementById('imageBox');

imageInput.addEventListener('change', function() {
    const selectedFile = imageInput.files[0];

    if (selectedFile && selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();

        reader.onload = function(event) {
            const imageUrl = event.target.result;
            imageBox.style.backgroundImage = `url(${imageUrl})`;
			
			localStorage.setItem('savedImage', imageUrl);
        };

        reader.readAsDataURL(selectedFile);
    } else {
        alert('Please select a valid image file.');
    }
});



function showInput()
{
	document.getElementById('displaye').innerHTML = 
        document.getElementById("email").value;
	document.getElementById('displayp').innerHTML =
	document.getElementById("password").value;
}
