document.addEventListener("DOMContentLoaded", function() {
    // Function to get a cookie value by name
    function getCookie(name) {
        let cookieArr = document.cookie.split(";");
        for(let i = 0; i < cookieArr.length; i++) {
            let cookiePair = cookieArr[i].split("=");
            if(name === cookiePair[0].trim()) {
                return decodeURIComponent(cookiePair[1]);
            }
        }
        return null;
    }

    // Check for the specific cookie
    const cookieName = "specialAccess";
    const cookieValue = getCookie(cookieName);

    if (cookieValue) {
        // Create the link element
        const link = document.createElement("a");
        link.href = "https://github.com/CellIJel/GPTMade";
        link.textContent = "Visit the Repository";
        link.style.position = "fixed";
        link.style.top = "0";
        link.style.left = "0";
        link.style.width = "100%";
        link.style.backgroundColor = "yellow";
        link.style.color = "black";
        link.style.textAlign = "center";
        link.style.padding = "10px";
        link.style.zIndex = "1000";

        // Append the link to the body
        document.body.appendChild(link);
    }
});