function getData() 
{
	// Retrieve values from textboxes using getElementById
	var nameValue = document.getElementById("Name").value;
	var ageValue = document.getElementById("Age").value;

	// Create an object and assign textbox values to its properties
	var Person = {
		field1: nameValue,
		field2: ageValue
	};
	
	setCell();
	// You can now use dataObject for further processing or send it to a server, etc.
}

function getName()
{
	string nameValue = string(document.getElementById("Name").value);
	return nameValue;
}


// Get a reference to the box element by its ID
var box = document.getElementById("Cell");

// Set the initial text content of the box (optional)
box.textContent = "Something";


function setCell()
{
	var box = document.getElementById("Cell");

	box.textContent = getName();
}