function showInput() {
    document.getElementById('displaye').innerHTML = 
           document.getElementById("email").value;
    document.getElementById('displayp').innerHTML =
           document.getElementById("password").value;
}

function loggedIn()
{
    let loginInfo = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        loggedIn: true
    }

    fetch('/api/endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginInfo)
      })
}