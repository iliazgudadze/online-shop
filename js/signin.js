// async function signIn() {
//     let email = document.getElementById("signin-email")
//     let password = document.getElementById("signin-password")

//     const res = await fetch("https://api.everrest.educata.dev/auth/sign_in",{
//         method : "POST",
//         headers:{
//             "Content-type":"application/json",
//             "Accept":"*/*",
//         },
//         body:JSON.stringify({email, password})
//     })
//     const data = await res.json();
//     accessToken=data.access_Token;
//     alert("signed in")
//     console.log(data)
    
    
// }
// async function getCurrentUser() {
//     if(!accessToken){
//         alert("თავიდან სცადე");
//         return
//     }
//     const res = await fetch("https://api.everrest.educata.dev/auth",{
//         headers:{
//            'Authorization':`Bearer ${accessToken}`,
//            "accept": "application/json"
//         }
//     })

    
// }
// const user = await res.json()
// document.getElementById("user-info").innerHTML=`
// <p>Name: ${user.firstname}</p>
// <p>Name: ${user.email}</p>
// <p>Name: ${user.age}</p>

// `
// console.log(user)