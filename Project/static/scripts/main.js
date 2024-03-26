// Add an event listener to the div to trigger a function when clicked
// clickBox.addEventListener('click', function () {
// 	// Call your function here
// 	FillInInfo();
// });


// function storeData() {
// 	var nameValue = document.getElementById('Name').value;
// 	var ageValue = document.getElementById('Age').value;


// 	localStorage.setItem('Name', nameValue);
// 	localStorage.setItem('Age', ageValue);

// 	const cellElement = document.getElementById('Cell');
// 	const name = localStorage.getItem('Name');

// 	cellElement.textContent = name;

// 	const textboxName = document.getElementById('Name');
// 	const textboxAge = document.getElementById('Age');
// 	const imageBox = document.getElementById('imageBox');

// 	textboxName.value = "";
// 	textboxAge.value = "";
// 	imageBox.style.backgroundImage = 'none';
// }

// function FillInInfo() {
// 	const name = localStorage.getItem('Name');
// 	const age = localStorage.getItem('Age');
// 	const savedImage = localStorage.getItem('savedImage');

// 	const setName = document.getElementById('Name');
// 	const setAge = document.getElementById('Age');
// 	const setImage = document.getElementById('imageBox');

// 	setName.value = name;
// 	setAge.value = age;
// 	if (savedImage) {
// 		imageBox.style.backgroundImage = `url(${savedImage})`;
// 	} else {
// 		alert('No saved image found in Local Storage.');
// 	}

// }

// const imageInput = document.getElementById('imageInput');
// const imageBox = document.getElementById('imageBox');

// Grabs the login cookie
document.addEventListener('DOMContentLoaded', async () => {
	await grabCookie();
});

// imageInput.addEventListener('change', function () {
// 	const selectedFile = imageInput.files[0];

// 	if (selectedFile && selectedFile.type.startsWith('image/')) {
// 		const reader = new FileReader();

// 		reader.onload = function (event) {
// 			const imageUrl = event.target.result;
// 			imageBox.style.backgroundImage = `url(${imageUrl})`;

// 			localStorage.setItem('savedImage', imageUrl);
// 		};

// 		reader.readAsDataURL(selectedFile);
// 	} else {
// 		alert('Please select a valid image file.');
// 	}
// });

function grabFormData() {
	document.getElementById('userForm').addEventListener('submit', function (event) {
		event.preventDefault();

		const formData = new FormData(this);
		const jsonData = {};

		formData.forEach((value, key) => {
			jsonData[key] = value;
		});

		// console.log(jsonData);
		postNewPerson(jsonData);
	});
};

function postNewPerson(jsonData) {
	fetch("/insertPerson", {
		method: "POST",
		body: JSON.stringify(jsonData),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	})
		.then((response) => response.json())
		.then((json) => console.log(json));
}

async function grabCookie() {
	try {
		const response = await fetch('index',
			{
				method: 'POST',
				headers:
				{
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ loggedIn: true })
			});

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const data = await response.json();

		// Right now just prints email, can be used to determine other logic
		console.log('Success:', data.message);
		document.getElementById('email').value = data.message != Null ? data.message : "";
	}
	catch (error) {
		console.error('Error:', error);
		throw error;
	}
}

// function postNewPerson() {
// 	fetch("/insertData", {
// 		method: "POST",
// 		body: JSON.stringify({
// 			firstName: "Mona",
// 			lastName: "Simpson",
// 			dob: '1901-01-12',
// 			gender: "Female",
// 			createdBy: 1,
// 			treeID: 1
// 		}),
// 		headers: {
// 			"Content-type": "application/json; charset=UTF-8"
// 		}
// 	})
// 		.then((response) => response.json())
// 		.then((json) => console.log(json));
// }

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
			const resultField = document.getElementById('result');
			resultField.innerHTML = JSON.stringify(data, null, 2);
			// const jsonAlert = document.getElementById('result').innerText;
			// window.alert(jsonAlert);
			// window.alert(resultDiv.innerHTML);
		})
		.catch(error => {
			console.error('Error fetching data:', error);
		});
}

function spawnChild() {
	// Create a new child box
	const parentBox = document.getElementById('Cell');
	const childBox = document.createElement('div');
	childBox.className = 'click-box';
	// childBox.id = parentBox.id + "_1";
	childBox.id = 'child of ' + parentBox.id;
	childBox.textContent = childBox.id;

	// // Append the child and line to the parent
	parentBox.appendChild(childBox);

}

function getInfo() {
	// const jsonAlert = JSON.parse(document.getElementById('result').innerText);
	const jsonObj = JSON.parse(document.getElementById('result').innerText);
	const jsonAlert = jsonObj[0].firstname;
	window.alert(jsonAlert);
}

function getChildren(parentID) {
	fetch("/children/" + parentID)
		.then(response => response.json())
		.then(data => {
			// Display the data in the 'result' div
			const resultField = document.getElementById('children');
			resultField.innerHTML = "";
			data.forEach(function (row) {
				let box = document.createElement("div");
				box.classList.add("person");
				box.textContent = row.childname;
				resultField.appendChild(box)

			})
			// resultField.innerHTML = JSON.stringify(data, null, 2);
			// resultField.innerHTML = JSON.stringify(data, null, 2);
			// window.alert(resultDiv.innerHTML);
		})
		.catch(error => {
			console.error('Error fetching data:', error);
		});
}

// function newJsonObject() {
// 	let templateObject = {
// 		"firstName": null,
// 		"lastName": null,
// 		"spouse": null,
// 		"children": []
// 	}
// 	return templateObject;
// }