window.onload = function() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const email = localStorage.getItem('loggedInEmail'); 

    // Check if logged-in email exists and find the user
    if (email) {
        const user = users.find(u => u.email === email);

        // If the user is found, display their name and profile image
        if (user) {
            document.getElementById('userName').textContent = user.name;

            // Check if the profile image exists, if not set a default
            const profileImageElement = document.getElementById('userProfileImage');
            if (profileImageElement && user.profileImage) {
                profileImageElement.src = user.profileImage;
            } else {
                profileImageElement.src = 'path/to/default/image.jpg'; // Default image
            }
        }
    } else {
        console.log('No logged-in user found');
    }
};

function logout() {
    localStorage.removeItem('loggedInEmail'); // Remove logged-in email from localStorage
    // Optionally redirect to login page after logout
    window.location.href = "login.html"; 
}
