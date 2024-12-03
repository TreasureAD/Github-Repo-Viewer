// Get references to HTML elements by their IDs
const fetchButton = document.getElementById('fetchButton');
const usernameInput = document.getElementById('username');
const profileSection = document.getElementById('profileSection');
const avatar = document.getElementById('avatar');
const name = document.getElementById('name');
const bio = document.getElementById('bio');
const profileLink = document.getElementById('profileLink');
const company = document.getElementById('company');
const website = document.getElementById('website');
const joinDate = document.getElementById('joinDate');
const repoList = document.getElementById('repoList');

// Add a click event listener to the fetch button
fetchButton.addEventListener('click', function () {
    const username = usernameInput.value.trim(); // Get the username input

    if (username === '') {
        alert('Please enter a username!');
        return; // Stop if the input is empty
    }

    // Fetch user data from GitHub API
    fetch(`https://api.github.com/users/${username}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('User not found');
            }
            return response.json(); // Convert to JSON
        })
        .then((userData) => {
            // Update profile section
            avatar.src = userData.avatar_url;
            name.textContent = userData.login || 'N/A';
            bio.textContent = userData.bio || 'No bio available';
            profileLink.href = userData.html_url;
            company.textContent = userData.company || 'N/A';
            website.textContent = userData.blog || 'N/A';
            joinDate.textContent = new Date(userData.created_at).toLocaleDateString();
            profileSection.classList.remove('d-none'); // Show profile section

            // Fetch repositories
            return fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`);
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Repositories not found');
            }
            return response.json(); // Convert to JSON
        })
        .then((repos) => {
            repoList.innerHTML = ''; // Clear previous repos
            repos.forEach((repo) => {
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item';
                listItem.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
                repoList.appendChild(listItem);
            });
        })
        .catch((error) => {
            alert(error.message);
        });
});
