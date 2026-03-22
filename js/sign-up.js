async function signUp(event) {
  event.preventDefault();

  const userData = {
    firstName: document.getElementById("Signup-FirstName").value,
    lastName: document.getElementById("Signup-LastName").value,
    age: Number(document.getElementById("Signup-age").value),
    email: document.getElementById("Signup-email").value,
    password: document.getElementById("Signup-password").value,
    address: document.getElementById("Signup-adress").value,
    phone: document.getElementById("Signup-phone").value,
    zipcode: document.getElementById("Signup-zipcode").value,
    gender: document.getElementById("Signup-gender").value,
    avatar: document.getElementById("Signup-avatar").value
  };

  const res = await fetch("https://api.everrest.educata.dev/auth/sign_up", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "Accept": "*/*"
    },
    body: JSON.stringify(userData)
  });

  const data = await res.json();
  localStorage.setItem("token", data.access_token);
  alert("Signed up");
  console.log(data);
}

async function getCurrentUser() {
  const accessToken = localStorage.getItem("token");

  if (!accessToken) {
    alert("გაიარე ავტორიზაცია");
    return;
  }
  const res = await fetch("https://api.everrest.educata.dev/auth/me", {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      "accept": "application/json"
    }
  })

  const user = await res.json()
  document.getElementById("user-info").innerHTML = `
    <p>Name: ${user.firstName}</p>
    <p>Name: ${user.email}</p>
    <p>Name: ${user.age}</p>
    
    `
  console.log(user)
}
