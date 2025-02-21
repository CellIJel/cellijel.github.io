// Function to delete a cookie by name
function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict';
}

// Delete the 'specialAccess' cookie
deleteCookie('specialAccess');