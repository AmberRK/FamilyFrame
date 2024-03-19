// Add an event listener to the div to trigger a function when clicked
// clickBox.addEventListener('click', function () {
// 	// Call your function here
// 	FillInInfo();
// });


function storeData() {
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

function FillInInfo() {
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

imageInput.addEventListener('change', function () {
	const selectedFile = imageInput.files[0];

	if (selectedFile && selectedFile.type.startsWith('image/')) {
		const reader = new FileReader();

		reader.onload = function (event) {
			const imageUrl = event.target.result;
			imageBox.style.backgroundImage = `url(${imageUrl})`;

			localStorage.setItem('savedImage', imageUrl);
		};

		reader.readAsDataURL(selectedFile);
	} else {
		alert('Please select a valid image file.');
	}
});

function getDynamicData() {
	fetch('/results/2')
		.then(response => response.json())
		.then(data => {
			// Display the data in the 'result' div
			const resultDiv = document.getElementById('result2');
			resultDiv.innerHTML = JSON.stringify(data, null, 2);
		})
		.catch(error => {
			console.error('Error fetching data:', error);
		});
}
function getAllData() {
	fetch('/results')
		.then(response => response.json())
		.then(data => {
			// Display the data in the 'result' div
			const resultDiv = document.getElementById('result');
			resultDiv.innerHTML = JSON.stringify(data, null, 2);
		})
		.catch(error => {
			console.error('Error fetching data:', error);
		});
}

function postNewPerson() {
	// const insertValues = ['Mona', 'Simpson', '1901-01-12', 'Female', 1, 1];
	fetch("/insertData", {
		method: "POST",

		// body: JSON.parse(JSON.stringify({
		// 	firstName: "Mona",
		// 	lastName: "Simpson",
		// 	dob: '1901-01-12',
		// 	gender: "Female",
		// 	createdBy: 1,
		// 	treeID: 1
		// })),
		body: JSON.stringify({
			firstName: "Mona",
			lastName: "Simpson",
			dob: '1901-01-12',
			gender: "Female",
			createdBy: 1,
			treeID: 1
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	})
		.then((response) => response.json())
		.then((json) => console.log(json));
}

function newJsonObject() {
	let templateObject = {
		"firstName": null,
		"lastName": null,
		"spouse": null,
		"children": []
	}
	return templateObject;
}