function showInput() {
    document.getElementById('displaye').innerHTML = 
           document.getElementById("email").value;
    document.getElementById('displayp').innerHTML =
           document.getElementById("password").value;
}

async function loggedIn()
{
  console.log("Stuff changes");
  try{
    // Object to send to server
    const loginInfo = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        loggedIn: true
    };

    // Send the object to the server
    const currentUrl = `http://${window.location.hostname}:5000`;
    console.log("Current URL: " + currentUrl);
    const response = await fetch('login', 
    {
      method: 'POST',
      headers: 
      {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginInfo)
    });
    console.log("Response");

    // If the server sends back an error, throw it
    if (!response.ok) 
    {
      console.log("Uh oh");
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Get response from server
    const data = await response.json();

    console.log('Success:', data.message);
    document.getElementById('email').value = data.message != Null ? data.message : "";
  }
  catch(error)
  {
    console.error('Error:', error);
    throw error;
  }
}