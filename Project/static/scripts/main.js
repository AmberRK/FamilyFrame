// import * as d3 from "d3";
// const d3 = require('d3');

// Grabs the login cookie
document.addEventListener('DOMContentLoaded', async () => {
	await grabCookie();
});

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
		getAllData();
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
		console.log('Success:', data.message, 'is logged in.');

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

function getInfo(targetID) {
	return fetch("/results/" + targetID)
		.then(response => response.json())
		.then(data => {
			// return (data);
			window.alert(JSON.stringify(data));
		})
}

function getChildrenToStratify() {
	return fetch("/stratifyChildren/")
		.then(response => response.json())
		.then(data => {
			console.log(data);
			const root = d3.stratify()
				.id((d) => d.name)
				.parentId((d) => d.parent)
				(data);
			console.log(root);
			return (root);
		})
		.catch(error => {
			console.error('Error fetching data:', error);
		});
	// return fetch("/stratifyChildren/")
	// 	.then(response => response.json())
	// 	.then(data => {
	// 		// return (data);
	// 		window.alert(JSON.stringify(data));
	// 	});
}

function getChildren(parentID) {
	return fetch("/children/" + parentID)
		.then(response => response.json())
		.then(data => {
			return (data);
		})
		.catch(error => {
			console.error('Error fetching data:', error);
		});
}

function spawnChild(id) {
	getChildren(id)
		.then(data => {
			let resultID = "resultDiv" + id;
			const resultField = document.getElementById(resultID);
			resultField.innerHTML = "";
			if (Object.values(data).length != 0) {

				data.forEach(function (row) {
					let childDiv = document.createElement("div");
					childDiv.classList.add("person");
					childDiv.id = (row.id);
					childDiv.textContent = row.childname;
					resultField.appendChild(childDiv);

					let spawnChildButton = document.createElement("button");
					spawnChildButton.textContent = "Get Children";
					spawnChildButton.addEventListener("click", function () { spawnChild(this.parentNode.id); });
					childDiv.appendChild(spawnChildButton);

					let grandChildDiv = document.createElement("div");

					grandChildDiv.id = "resultDiv" + row.id;
					childDiv.appendChild(grandChildDiv);
				});
			}
			else {
				resultField.innerHTML = "No children";
			}
		})
}