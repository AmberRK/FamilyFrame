
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

	new LeaderLine(
		parentBox,
		childBox
	);

}


const clickBox = document.getElementById('Cell');

// Add an event listener to the div to trigger a function when clicked
clickBox.addEventListener('click', function () {
	// Call your function here
	FillInInfo();
});


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


function newJsonObject() {
	let returnObject = {
		"firstName": null,
		"lastName": null,
		"spouse": null,
		"children": []
	}

	return returnObject;
}

function spawnTable(tableName) {

	let mainData = newJsonObject();

	mainData.firstName = "Jane";
	mainData.lastName = "Smith";
	mainData.spouse = "John";

	let child1 = newJsonObject();
	child1.firstName = "Kate";
	child1.lastName = "Lobos";
	child1.spouse = "Bob";

	let child1_1 = newJsonObject()
	child1_1.firstName = "Sam";
	child1_1.lastName = "Lobos";

	let child1_2 = newJsonObject()
	child1_2.firstName = "Sarah";
	child1_2.lastName = "Lobos";

	child1.children.push(child1_1);
	child1.children.push(child1_2);

	mainData.children.push(child1);


	let child2 = newJsonObject();
	child2.firstName = "Misty";
	child2.lastName = "Alleman";
	child2.spouse = "Will";
	mainData.children.push(child2);

	let child3 = newJsonObject();
	child3.firstName = "Laura";
	child3.lastName = "Jordan";
	child3.spouse = "Justin";
	mainData.children.push(child3);

	console.log(mainData);

	if (mainData && mainData !== undefined && mainData !== null && mainData.firstName) {

		var table = document.createElement('table');
		table.setAttribute("id", "table_0");
		table.setAttribute("width", "100%");

		let row1 = table.insertRow(0);

		let cell1 = row1.insertCell(0);

		if (mainData.spouse) {
			cell1.innerHTML = mainData.firstName + " / " + mainData.spouse;
		}
		else {
			cell1.innerHTML = mainData.firstName;
		}

		if (mainData.children.length > 0) {
			let row2 = table.insertRow(1);
			let cell2 = row2.insertCell(0);

			let childTables = getChildString(mainData.children);
			cell2.innerHTML = "<table style='width:100%;'><tr>" + childTables + "</tr></table>";
		}

		let mainDiv = document.getElementById("main_div");
		mainDiv.innerHTML = table.outerHTML;
	}

	// var table_level_array = tableName.split("_");
	// console.log(table_level_array);

	// var table_depth = table_level_array.length;

	// alert(table_depth);

	// var table = document.getElementById(tableName);


	// var row = table.insertRow(1);

	// var cell1 = row.insertCell(0);
	// var innerText = "<table style='width: 100%;'><tr>";

	// var nameArray = ["Hannah", "Hezzie", "Abster", "Jonnie", "Becky", "Adam"];

	// for(i = 0; i < nameArray.length; i++) {
	//     let table_id = tableName + "_" + i;
	//     innerText += "<td><table id='" + table_id + "' style='width: 100%;' id='myTable2'><tr><td>" + nameArray[i] + "</td></tr></table><td>";
	// }

	// innerText += "</tr></table>";

	// cell1.innerHTML = innerText;

}

function getChildString(children) {

	var innerText = "";
	for (i = 0; i < children.length; i++) {
		let table_id = "table_0_" + i;

		let cellText = "";
		if (children[i].spouse) {
			cellText = children[i].firstName + " / " + children[i].spouse;
		}
		else {
			cellText = children[i].firstName;
		}

		innerText += "<td><table id='" + table_id + "' style='width: 100%;' id='myTable2'><tr><td>" + cellText + "</td></tr></table><td>";
	}

	return innerText;
}
