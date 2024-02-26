function showInput() {
    document.getElementById('displaye').innerHTML = 
           document.getElementById("email").value;
    document.getElementById('displayp').innerHTML =
           document.getElementById("password").value;
}

async function loggedIn()
{
  try{
    let loginInfo = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        loggedIn: true
    }

    const response = await fetch('/api/endpoint', 
    {
      method: 'POST',
      headers: 
      {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginInfo)
    });
    if (!response.ok) 
    {
      console.log("Uh oh");
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    console.log('Success:', data);
    document.getElementById('displaye').innerHTML = data.message;
  }
  catch(error)
  {
    console.error('Error:', error);
    throw error;
  }
}