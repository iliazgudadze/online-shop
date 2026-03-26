async function signUp(event) {
  event.preventDefault();

  const firstName = document.getElementById("Signup-FirstName").value.trim();
  const lastName  = document.getElementById("Signup-LastName").value.trim();
  const age       = document.getElementById("Signup-age").value.trim();
  const email     = document.getElementById("Signup-email").value.trim();
  const password  = document.getElementById("Signup-password").value.trim();
  const address   = document.getElementById("Signup-adress").value.trim();
  const phone     = document.getElementById("Signup-phone").value.trim();
  const zipcode   = document.getElementById("Signup-zipcode").value.trim();
  const avatar    = document.getElementById("Signup-avatar").value.trim();
  const gender    = document.getElementById("Signup-gender").value;

  if (!firstName) { showError("Signup-FirstName", "სახელი სავალდებულოა"); return; }
  if (!lastName)  { showError("Signup-LastName",  "გვარი სავალდებულოა");  return; }
  if (!age)       { showError("Signup-age",       "ასაკი სავალდებულოა");  return; }
  if (!email)     { showError("Signup-email",     "ელ-ფოსტა სავალდებულოა"); return; }
  if (!password)  { showError("Signup-password",  "პაროლი სავალდებულოა"); return; }
  if (!address)   { showError("Signup-adress",    "მისამართი სავალდებულოა"); return; }
  if (!phone)     { showError("Signup-phone",     "ტელეფონი სავალდებულოა"); return; }
  if (!zipcode)   { showError("Signup-zipcode",   "საფოსტო კოდი სავალდებულოა"); return; }

  clearErrors();

  const userData = {
    firstName, lastName,
    age: Number(age),
    email, password, address, phone, zipcode, gender, avatar
  };

  try {
    const res = await fetch("https://api.everrest.educata.dev/auth/sign_up", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "*/*" },
      body: JSON.stringify(userData)
    });

    const data = await res.json();

    if (res.status === 409) {
      showError("Signup-email", "ეს მონაცემები უკვე გამოყენებულია");
      return;
    }

    if (res.ok) {
      console.log(data);
      alert("რეგისტრაცია წარმატებით დასრულდა!");
    } else {
      alert("შეცდომა: " + (data.message || "სცადე თავიდან"));
    }

  } catch (err) {
    console.error(err);
    alert("დაფიქსირდა შეცდომა");
  }
}

function showError(fieldId, message) {
  clearErrors();
  const field = document.getElementById(fieldId);
  if (!field) return;

  field.style.borderColor = "#b30000";
  field.style.boxShadow   = "0 0 0 3px rgba(255, 0, 0, 0.15)";

  const err = document.createElement("p");
  err.className   = "field-error";
  err.textContent = message;
  err.style.cssText = "color:#ef4444; font-size:12px; margin-top:4px;";

  field.insertAdjacentElement("afterend", err);
  field.focus();
}

function clearErrors() {
  document.querySelectorAll(".field-error").forEach(el => el.remove());
  document.querySelectorAll(".input, #Signup-avatar, #Signup-gender").forEach(el => {
    el.style.borderColor = "";
    el.style.boxShadow   = "";
  });
}