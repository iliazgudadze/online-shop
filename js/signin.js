async function signIn() {
    const email = document.getElementById("signin-email").value;
    const password = document.getElementById("signin-password").value;
 
    if (!email || !password) {
        alert("შეავსეთ ყველა ველი");
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
        console.log("Sign in response:", data);
 
        if (res.ok && data.access_token) {
            localStorage.setItem("token", data.access_token);
            alert("წარმატებით შეხვედით ✅");
            window.location.href = "./shop.html";
        } else {
            alert("შეცდომა: " + (data.message || data.error || "არასწორი მონაცემები"));
        }
    } catch (err) {
        console.error("Sign in error:", err);
        alert("კავშირის შეცდომა");
    }
}