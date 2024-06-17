// Call this function to check login session
// Return true if users are logged in, false if not
async function checkLoginSession(api = "../api/authentication/checkSession.php")  {
    try {
        const loginRequest = await fetch(api, {
            method: "GET",
        })
        
        const response = await loginRequest.json();
        
        if(response.code !== 200) {
            return false;
        }
        return true;

    } catch (error) {
        return false;
    } 
    return false;
}