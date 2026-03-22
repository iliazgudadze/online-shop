document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
    loadUser();
});

function checkAuth() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "../html/sign-in.html";
    }
}

async function loadUser() {
    const token = localStorage.getItem("token");
    try {
        const res = await fetch("https://api.everrest.educata.dev/auth", {
            headers: {
                Authorization: `Bearer ${token}`,
                accept: "application/json"
            }
        });
        if (!res.ok) {
            alert("მომხმარებლის ჩატვირთვა ვერ მოხერხდა");
            return;
        }
        const user = await res.json();
        console.log("USER DATA:", user);
        fillForm(user);

    } catch (err) {
        console.error(err);
    }
}

function fillForm(user) {
    document.getElementById("hero-name").textContent = user.firstName + " " + user.lastName;
    document.getElementById("hero-email").textContent = user.email;
    const avatarEl = document.getElementById("avatar-initials");
    if (user.avatar) {
        avatarEl.innerHTML = `<img src="${user.avatar}" alt="avatar" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
    } else {
        const initials = (user.firstName?.[0] || "") + (user.lastName?.[0] || "");
        avatarEl.textContent = initials.toUpperCase() || "?";
    }
    document.getElementById("firstName").value = user.firstName || "";
    document.getElementById("lastName").value = user.lastName || "";
    document.getElementById("age").value = user.age || "";
    document.getElementById("email").value = user.email || "";
    document.getElementById("phone").value = user.phone || "";
    document.getElementById("address").value = user.address || "";
    document.getElementById("zipcode").value = user.zipcode || "";
    document.getElementById("avatar-url").value = user.avatar || "";
    if (user.gender) {
        document.getElementById("gender").value = user.gender.toUpperCase();
    }
}
async function updateUser() {
    const token = localStorage.getItem("token");
    const updatedData = {
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        age: Number(document.getElementById("age").value),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        address: document.getElementById("address").value.trim(),
        zipcode: document.getElementById("zipcode").value.trim(),
        avatar: document.getElementById("avatar-url").value.trim(),
        gender: document.getElementById("gender").value,
    };
    try {
        const res = await fetch("https://api.everrest.educata.dev/auth", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedData),
        });
        const data = await res.json();
        if (res.ok) {
            showToast("ცვლილებები შეინახა!", "success");
            fillForm(data);
        } else {
            showToast(data.message || "შეცდომა მოხდა", "error");
        }
    } catch (err) {
        console.error(err);
        showToast("დაფიქსირდა შეცდომა", "error");
    }
}
function logout() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "../html/sign-in.html";
}
function showToast(msg, type = "success") {
    const toast = document.getElementById("toast");
    const toastMsg = document.getElementById("toast-msg");
    const icon = toast.querySelector("i");

    toastMsg.textContent = msg;
    toast.className = `toast ${type}`;
    icon.className = type === "success"
        ? "fa-solid fa-circle-check"
        : "fa-solid fa-circle-exclamation";

    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
}