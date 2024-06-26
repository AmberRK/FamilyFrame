function pickExistingPerson(event) {
	const selectedPerson = event.target.value;
	fetch("/getPerson/", {
		method: "POST",
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		},
		body: JSON.stringify({ selectedPerson: selectedPerson })
	})
	.then(response => response.json())
	.then(json => {
		console.log(json);
		var person = json[0];
		// dateOfBirth = person.dateofbirth.getFullYear() + "-" + (person.dateofbirth.getMonth() + 1) + "-" + person.dateofbirth.getDate();
		first = document.getElementById("firstName");
		first.value = person.firstname;
		last = document.getElementById("lastName");
		last.value = person.lastname;
		dob = document.getElementById("dateOfBirth");
		dob.value = person.dateofbirth;
		gender = document.getElementById("gender");
		gender.value = person.gender;

	});
}

function checkLoginForTrees()
{
	try 
    {
		fetch("/profileJWT")
        .then((response) => {
        if (!response.ok) 
        {
            disableForm();
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        else 
        {
            enableForm();
        }
        })
        .catch(() => disableForm());
    }
	catch (error) 
    {
		console.error('Error:', error);
		throw error;
    }
}

function disableForm() 
{
    // Get the form element by its ID
    const form = document.getElementById("userForm");
    
    // Check if the form exists
    if (form) {
        // Get all form elements within the form
        const elements = form.elements;
        
        // Loop through each form element and set the `disabled` attribute to `true`
        for (let i = 0; i < elements.length; i++) {
            elements[i].disabled = true;
        }
    } else {
        console.log(`Form with ID ${formId} not found.`);
    }
}

function enableForm()
{
	console.log("Enabling form");
	// Get the form element by its ID
	const form = document.getElementById("userForm");
	
	// Check if the form exists
	if (form) {
		const elements = form.elements;
		
		for (let i = 0; i < elements.length; i++) {
			elements[i].disabled = false;
		}
	} else {
		console.log(`Form with ID ${formId} not found.`);
	}
	var parent = document.getElementById("parent");
	var existingPerson = document.getElementById("existingPerson");
	fetch("/listOfPeople", {
		method: "GET",
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	})
	.then(response => response.json())
	.then(json => 
	{	
		parent.innerHTML = "";
		existingPerson.innerHTML = "";
		existingPerson.options[existingPerson.options.length] = new Option("Existing Person", "");
		parent.options[parent.options.length] = new Option("New Eldest", "New Eldest");
		json.forEach(function (item) {
			existingPerson.disabled = false;
			existingPerson.options[existingPerson.options.length] = new Option(item.firstname, item.firstname);
			existingPerson.addEventListener("change", pickExistingPerson);
			parent.disabled = false;
			parent.options[parent.options.length] = new Option(item.firstname, item.firstname);
		});
		if(existingPerson.options.length === 0)
		{
			existingPerson.disabled = true;
		}
		getChildrenToStratify();
	});
}
function grabFormData() {
	document.getElementById('userForm').addEventListener('submit', function (event) {
		event.preventDefault();

		const formData = new FormData(this);
		const jsonData = {};

		formData.forEach((value, key) => {
			jsonData[key] = value;
		});

		console.log(jsonData);
		postNewPerson(jsonData);
	});
};

function alertUser(message) 
{
  var alert = document.getElementById("alert");
  message = '<span class="closebtn">&times;</span>'
  + ' <strong>Error!  </strong>' + message;
  alert.setAttribute("style", "opacity: 1");
  alert.innerHTML = message;

  var close = document.getElementsByClassName("closebtn");
  var i;

  for (i = 0; i < close.length; i++) 
  {
    close[i].onclick = function(){
      var div = this.parentElement;
      div.style.opacity = "0";
      setTimeout(function(){ div.style.display = "none"; }, 600);
  }
  }
}

function postNewPerson(jsonData) {
	const existingPerson = document.getElementById("existingPerson");
	const firstName = document.getElementById("firstName").value;
	const parent = document.getElementById("parent");
	// for (let i = 0; i < existingPerson.options.length; i++) {
        // Compare the value of the option with the value to check
    //     if (existingPerson.options[i].value === firstName && firstName != existingPerson.value) {
	// 		alertUser("Person already exists");
	// 		return;
    //     }
    // }
	console.log("Existing person: " + existingPerson.value);
	if(existingPerson.value != "")
	{
		jsonData.selectedPerson = existingPerson.value;
		fetch("/updatePerson", {
			method: "POST",
			body: JSON.stringify(jsonData),
			headers: {
				"Content-type": "application/json; charset=UTF-8"
			}
		})
		.then((response) => response.json())
		.then((json) => console.log(json));
	}
	else if(parent.value == "New Eldest")
	{
		console.log(jsonData);
		fetch('/insertNewEldest',
		{
			method: "POST",
			body: JSON.stringify(jsonData),
			headers: {
				"Content-type": "application/json; charset=UTF-8"
			}
		})
		.then((response) => response.json())
		.then((json) => console.log(json));
	}
	else
	{
		console.log(jsonData);
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
	let treeContainer = document.getElementById("tree-container");
	treeContainer.removeChild(treeContainer.firstChild);
	enableForm();
}

// function getDynamicData() {
// 	fetch('/results/2')
// 		.then(response => response.json())
// 		.then(data => {
// 			// Display the data in the 'result' div
// 			const resultDiv = document.getElementById('result2');
// 			resultDiv.innerHTML = JSON.stringify(data, null, 2);
// 		})
// 		.catch(error => {
// 			console.error('Error fetching data:', error);
// 		});
// }

// function getAllData() {
// 	fetch('/results')
// 		.then(response => response.json())
// 		.then(data => {
// 			// Display the data in the 'result' div
// 			const resultField = document.getElementById('result');
// 			resultField.innerHTML = JSON.stringify(data, null, 2);
// 			// const jsonAlert = document.getElementById('result').innerText;
// 			// window.alert(jsonAlert);
// 			// window.alert(resultDiv.innerHTML);
// 		})
// 		.catch(error => {
// 			console.error('Error fetching data:', error);
// 		});
// }

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
			// console.log(data);
			const treeData = d3.stratify()
				.id((d) => d.name)
				.parentId((d) => d.parent)
				(data);
			console.log(treeData);
			const treeContainer = document.getElementById("tree-container");
			treeContainer.appendChild(chartTree(treeData, {
				label: d => d.id,
				// title: (d, n) => `${n.ancestors().reverse().map(d => d.data.name).join(".")}`, // hover text
				title: d => d.id,
				// link: (d, n) => `https://github.com/prefuse/Flare/${n.children ? "tree" : "blob"}/master/flare/src/${n.ancestors().reverse().map(d => d.data.name).join("/")}${n.children ? "" : ".as"}`,
				width: 500
			}));
		})
		.catch(error => {
			console.error('Error fetching data:', error);
		});

}

// function getChildren(parentID) {
// 	return fetch("/children/" + parentID)
// 		.then(response => response.json())
// 		.then(data => {
// 			return (data);
// 		})
// 		.catch(error => {
// 			console.error('Error fetching data:', error);
// 		});
// }

// function spawnChild(id) {
// 	getChildren(id)
// 		.then(data => {
// 			let resultID = "resultDiv" + id;
// 			const resultField = document.getElementById(resultID);
// 			resultField.innerHTML = "";
// 			if (Object.values(data).length != 0) {

// 				data.forEach(function (row) {
// 					let childDiv = document.createElement("div");
// 					childDiv.classList.add("person");
// 					childDiv.id = (row.id);
// 					childDiv.textContent = row.childname;
// 					resultField.appendChild(childDiv);

// 					let spawnChildButton = document.createElement("button");
// 					spawnChildButton.textContent = "Get Children";
// 					spawnChildButton.addEventListener("click", function () { spawnChild(this.parentNode.id); });
// 					childDiv.appendChild(spawnChildButton);

// 					let grandChildDiv = document.createElement("div");

//					grandChildDiv.id = "resultDiv" + row.id;
//					childDiv.appendChild(grandChildDiv);
//				});
//			}
//			else {
//				resultField.innerHTML = "No children";
//			}
//		})
//}
// async function whoAmI() {
// 	const response = await fetch("/getCredentials");
// 	const data = await response.json();
// 	return (data);
// }

async function createTree(event) 
{
	event.preventDefault();
	const formData = new FormData(this);
	const jsonData = {};
	formData.forEach((value, key) => {
		jsonData[key] = value;
	});
	console.log(jsonData);

	fetch("/createTree", {
		method: "POST",
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		},
		body: JSON.stringify(jsonData)
	})
		// .then(response => response.json())
		// .then(json => {
		// console.log(json);
		// });
		.then(window.location.href = "/");
}

async function selectTree(event) 
{
	let treeID = event.target.id;
	console.log(treeID);
	await fetch("/selectTree", {
		method: "POST",
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		},
		body: JSON.stringify({ treeID: treeID })
	})
	.then(response => {
		console.log(response);
		window.location.href = "/";
	});
}

function getMyTrees() {
	fetch("/grabmytrees", {
		method: "GET",
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	})
		.then(response => response.json())
		.then(json => {
			let tableOwnedTree = document.getElementById("showMyTrees");
			let tableSharedTree = document.getElementById("showALLTrees");
			const popup = document.getElementById('popup');
			const yesButton = document.getElementById('yesButton');
			const noButton = document.getElementById('noButton');

			json.forEach(function (item) {
				var tr = document.createElement("tr");
				var tdLabel = document.createElement("td");
				var tdShareCode = document.createElement("td");
				tdLabel.style.cursor = "pointer";
				tdLabel.classList.add('highlight');
				if (item.createdby == item.userid) {
					tdLabel.textContent = item.treelabel;
					tdShareCode.textContent = item.treeid;
					tdLabel.id = item.treeid;
					tr.appendChild(tdLabel);
					tdLabel.addEventListener("click", selectTree);
					tr.appendChild(tdShareCode);
				} else {
					tdLabel.textContent = item.treelabel;
					tdLabel.id = item.treeid;
					// tdShareCode.textContent = "";
					tdLabel.addEventListener("click", selectTree);
					tr.appendChild(tdLabel);
				}

				if (item.createdby == item.userid) {
					//  deleteButton = document.createElement("button");
					// deleteButton.textContent = "Delete";
					// deleteButton.addEventListener('click', () => {
					//	popup.style.display = 'block';
					// });
					// tr.appendChild(deleteButton);

					tableOwnedTree.appendChild(tr);
				} else {
					//var removeButton = document.createElement("button");
					//removeButton.textContent = "Remove";
					// removeButton.addEventListener("click", function () {
					// 	window.alert("Clicked");
					// });
					//tr.appendChild(removeButton);

					tableSharedTree.appendChild(tr);
				}

				noButton.addEventListener('click', () => {
					popup.style.display = 'none';
				});

				yesButton.addEventListener('click', () => {
					window.alert('Clicked on modal');
					popup.style.display = 'none';
				});
			});

		});
}
// function getALLTrees() {
// 	fetch("/grabALLtrees", {
// 		method: "GET",
// 		headers: {
// 			"Content-type": "application/json; charset=UTF-8"
// 		}
// 	})
// 		.then(response => response.json())
// 		.then(json => {
// 			console.log(json);
// 			let ulTree = document.getElementById("showALLTrees");
// 			// listTree.innerHTML = JSON.stringify(json, null, 2);
// 			json.forEach(function (item) {
// 				var li = document.createElement("li");
// 				li.textContent = "Name: " + item.treelabel + " ID: " + item.treeid;
// 				ulTree.appendChild(li);
// 			});

// 		});
// }

function addATree(event) 
{
	console.log("Adding a tree");
	event.preventDefault();
	const formData = new FormData(this);
	const jsonData = {};
	formData.forEach((value, key) => {
		jsonData[key] = value;
	});
	console.log(jsonData);

	fetch("/addTreeWithCode", {
		method: "POST",
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		},
		body: JSON.stringify(jsonData)
	})
		// .then(response => response.json())
		// .then(json => {
		// console.log(json);
		// });
		.then(response => console.log(response));
}
// Copyright 2021-2023 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/tree
function chartTree(data, { // data is either tabular (array of objects) or hierarchy (nested objects)
	path, // as an alternative to id and parentId, returns an array identifier, imputing internal nodes
	id = Array.isArray(data) ? d => d.id : null, // if tabular data, given a d in data, returns a unique identifier (string)
	parentId = Array.isArray(data) ? d => d.parentId : null, // if tabular data, given a node d, returns its parent’s identifier
	children, // if hierarchical data, given a d in data, returns its children
	tree = d3.tree, // layout algorithm (typically d3.tree or d3.cluster)
	sort, // how to sort nodes prior to layout (e.g., (a, b) => d3.descending(a.height, b.height))
	label, // given a node d, returns the display name
	title, // given a node d, returns its hover text
	link, // given a node d, its link (if any)
	linkTarget = "_blank", // the target attribute for links (if any)
	width = 640, // outer width, in pixels
	height, // outer height, in pixels
	r = 3, // radius of nodes
	padding = 1, // horizontal padding for first and last column
	fill = "#999", // fill for nodes
	fillOpacity, // fill opacity for nodes
	stroke = "#555", // stroke for links
	strokeWidth = 1.5, // stroke width for links
	strokeOpacity = 0.4, // stroke opacity for links
	strokeLinejoin, // stroke line join for links
	strokeLinecap, // stroke line cap for links
	halo = "#fff", // color of label halo 
	haloWidth = 3, // padding around the labels
	curve = d3.curveBumpX, // curve for the link
} = {}) {

	// If id and parentId options are specified, or the path option, use d3.stratify
	// to convert tabular data to a hierarchy; otherwise we assume that the data is
	// specified as an object {children} with nested objects (a.k.a. the “flare.json”
	// format), and use d3.hierarchy.
	const root = path != null ? d3.stratify().path(path)(data)
		: id != null || parentId != null ? d3.stratify().id(id).parentId(parentId)(data)
			: d3.hierarchy(data, children);

	// Sort the nodes.
	if (sort != null) root.sort(sort);

	// Compute labels and titles.
	const descendants = root.descendants();
	const L = label == null ? null : descendants.map(d => label(d.data, d));

	// Compute the layout.
	const dx = 10;
	const dy = width / (root.height + padding);
	tree().nodeSize([dx, dy])(root);

	// Center the tree.
	let x0 = Infinity;
	let x1 = -x0;
	root.each(d => {
		if (d.x > x1) x1 = d.x;
		if (d.x < x0) x0 = d.x;
	});

	// Compute the default height.
	if (height === undefined) height = x1 - x0 + dx * 2;

	// Use the required curve
	if (typeof curve !== "function") throw new Error(`Unsupported curve`);

	const svg = d3.create("svg")
		.attr("viewBox", [-dy * padding / 2, x0 - dx, width, height])
		.attr("width", width)
		.attr("height", height)
		.attr("style", "max-width: 100%; height: auto; height: intrinsic;")
		.attr("font-family", "sans-serif")
		.attr("font-size", 10);

	svg.append("g")
	
		.attr("fill", "none")
		.attr("stroke", stroke)
		.attr("stroke-opacity", strokeOpacity)
		.attr("stroke-linecap", strokeLinecap)
		.attr("stroke-linejoin", strokeLinejoin)
		.attr("stroke-width", strokeWidth)
		.selectAll("path")
		.data(root.links())
		.join("path")
		.attr("d", d3.link(curve)
			.x(d => d.y)
			.y(d => d.x));

	const node = svg.append("g")
		.selectAll("a")
		.data(root.descendants())
		.join("a")
		.attr("xlink:href", link == null ? null : d => link(d.data, d))
		.attr("target", link == null ? null : linkTarget)
		.attr("transform", d => `translate(${d.y},${d.x})`);

	node.append("circle")
		.attr("fill", d => d.children ? stroke : fill)
		.attr("r", r);

	if (title != null) node.append("title")
		.text(d => title(d.data, d));

	if (L) node.append("text")
		.attr("dy", "0.32em")
		.attr("x", d => d.children ? -6 : 6)
		.attr("text-anchor", d => d.children ? "end" : "start")
		.attr("paint-order", "stroke")
		.attr("stroke", halo)
		.attr("stroke-width", haloWidth)
		.text((d, i) => L[i]);

	return svg.node();
}

document.getElementById('submitCode').addEventListener('submit', addATree);
document.getElementById('submitName').addEventListener('submit', createTree);