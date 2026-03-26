async function signIn() {
    const email = document.getElementById("signin-email").value;
    const password = document.getElementById("signin-password").value;
    if (!email || !password) {
        alert("შეავსე ყველა ველი");
        return;
    }
    try {
        const res = await fetch("https://api.everrest.educata.dev/auth/sign_in", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok && data.access_token) {
            localStorage.setItem("token", data.access_token);
            alert("წარმატებით შეხვედი!");
            window.location.href = "../index.html";
        } else {
            alert("შეცდომა: " + (data.message || data.error));
        }
    } catch (err) {
        console.error("Sign in error:", err);
        alert("დაფიქსირდა შეცდომა");
    }
}

