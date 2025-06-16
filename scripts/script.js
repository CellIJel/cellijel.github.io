document.addEventListener("DOMContentLoaded", function () {
  // Function to get a cookie by name
  function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  // Check if the specific cookie is present
  if (getCookie("showBanner") === "true") {
    const banner = document.getElementById("cookie-banner");
    if (banner) {
      banner.style.display = "block";
    } else {
      console.error('Element with ID "cookie-banner" not found.');
    }
  }
});

// Instructions to set the cookie via the browser's developer tools console:
// document.cookie = "showBanner=true; path=/";
// Remove the cookie by pasting
// document.cookie = "showBanner=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
