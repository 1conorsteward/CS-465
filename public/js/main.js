document.addEventListener('DOMContentLoaded', () => {
    setupModals();  // Manage modals for login and registration
    checkLoginStatus();  // Check user login status
    loadTrips('beach');  // Load trips by default category (beach)
     // Make sure this logic runs only on the reservations page
    if (document.body.contains(document.getElementById('reservations-list'))) {
        loadReservations();
        loadAvailableTrips();
    
        // Event listener for reserving trips
        document.getElementById('trip-rows').addEventListener('click', (event) => {
            const target = event.target;
            const tripId = target.getAttribute('data-trip-id');
                
            if (target.classList.contains('reserve-trip-btn')) {
                reserveTrip(tripId);  // Reserve the selected trip
            }
        });
    } 

    // Event listener for Add Trip button
    const addTripButton = document.getElementById('add-trip-button');
    if (addTripButton) {
        addTripButton.addEventListener('click', showAddTripForm);
    }

     // Event listener for Search functionality
    const searchBar = document.getElementById('search-bar');
    if (searchBar) {
        searchBar.addEventListener('input', (event) => {
            const query = event.target.value.trim();
            if (query) {
                searchTrips(query);  // Call search function if query is provided
            } else {
                loadTrips('beach');  // Reload default trips if search bar is empty
            }
        });
    }

// Event delegation for reserve, edit, and delete buttons
document.getElementById('trip-rows').addEventListener('click', (event) => {
    const target = event.target;
    const tripId = target.getAttribute('data-trip-id');
    
    if (target.classList.contains('res-trip-btn')) {
        reserveTrip(tripId);  // Call the function to reserve the trip
    } else if (target.classList.contains('edit-trip-btn')) {
        editTrip(tripId);  // Existing function for editing
    } else if (target.classList.contains('delete-trip-btn')) {
        deleteTrip(tripId);  // Existing function for deleting
    }
});

    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const tripType = event.target.getAttribute('data-type');
            loadTrips(tripType);
        });
    });
});

// Load the available trips
async function loadAvailableTrips() {
    try {
        const response = await fetch('/api/trips');  // Fetch all trips from the server
        if (!response.ok) throw new Error('Failed to fetch available trips');
        
        const trips = await response.json();
        const tripsList = document.getElementById('trip-rows');  // Adjust to point to the correct element

        if (trips.length === 0) {
            tripsList.innerHTML = '<p>No trips available at the moment.</p>';
            return;
        }

        tripsList.innerHTML = trips.map(trip => `
            <tr>
                <td>${trip._id}</td>
                <td>${trip.destination}</td>
                <td>${trip.lengthOfStay.nights} nights / ${trip.lengthOfStay.days} days</td>
                <td>${new Date(trip.startDate).toLocaleDateString()}</td>
                <td>${trip.resort}</td>
                <td>$${trip.pricePerPerson}</td>
                <td>
                    <button onclick="reserveTrip('${trip._id}')">Reserve</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading available trips:', error);
    }
}

//Search trips by destination
async function searchTrips(query) {
    try {
        const response = await fetch(`/api/trips/search?destination=${query}`);
        const trips = await response.json();
        const tripRows = document.getElementById('trip-rows');
        tripRows.innerHTML = '';  // Clear previous rows

        const isLoggedIn = document.body.getAttribute('data-logged-in') === 'true';  // Check if the user is logged in

        trips.forEach(trip => {
            let row = `
                <tr>
                    <td>${trip._id}</td>
                    <td>${trip.destination}</td>
                    <td>${trip.lengthOfStay.nights} nights / ${trip.lengthOfStay.days}</td>
                    <td>${new Date(trip.startDate).toLocaleDateString()}</td>
                    <td>${trip.resort}</td>
                    <td>$${trip.pricePerPerson}</td>
                    <td>
                        ${isLoggedIn ? `
                            <button class="edit-trip-btn" data-trip-id="${trip._id}">Edit</button>
                            <button class="delete-trip-btn" data-trip-id="${trip._id}">Delete</button>
                        ` : ''}
                    </td>
                </tr>
            `;
            tripRows.innerHTML += row;
        });
    } catch (error) {
        console.error('Error searching trips:', error);
    }
}


// Load trips by category (beach, cruise, mountain)
async function loadTrips(type) {
    try {
        const response = await fetch(`/api/trips/${type}`);
        if (!response.ok) {
            throw new Error('Failed to load trips');
        }

        const trips = await response.json();
        const tripRows = document.getElementById('trip-rows');
        tripRows.innerHTML = '';  // Clear previous rows

        const isLoggedIn = document.body.getAttribute('data-logged-in') === 'true';

        if (trips.length === 0) {
            tripRows.innerHTML = `<tr><td colspan="7">No trips available for ${type}</td></tr>`;
        } else {
            trips.forEach(trip => {
                let row = `
                    <tr>
                        <td>${trip._id}</td>
                        <td>${trip.destination}</td>
                        <td>${trip.lengthOfStay.nights} nights / ${trip.lengthOfStay.days} days</td>
                        <td>${new Date(trip.startDate).toLocaleDateString()}</td>
                        <td>${trip.resort}</td>
                        <td>$${trip.pricePerPerson}</td>
                        <td>
                            ${isLoggedIn ? `
                                <button class="edit-trip-btn" data-trip-id="${trip._id}">Edit</button>
                                <button class="delete-trip-btn" data-trip-id="${trip._id}">Delete</button>
                            ` : ''}
                        </td>
                    </tr>
                `;
                tripRows.innerHTML += row;
            });
        }
    } catch (error) {
        console.error('Error loading trips:', error);
        document.getElementById('trip-rows').innerHTML = `<tr><td colspan="7">Error loading trips. Please try again later.</td></tr>`;
    }
}

// Edit trip function
async function editTrip(id) {
    const updatedTrip = {
        destination: prompt("Enter new destination"),
        lengthOfStay: {
            nights: prompt("Enter new nights"),
            days: prompt("Enter new days"),
        },
        startDate: prompt("Enter new start date (YYYY-MM-DD)"),
        resort: prompt("Enter new resort"),
        pricePerPerson: prompt("Enter new price per person"),
        type: prompt("Enter new type (beach, cruise, mountain)"),
    };

    try {
        await fetch(`/api/trips/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTrip),
        });
        loadTrips(updatedTrip.type);  // Reload trips after editing
    } catch (error) {
        console.error('Error editing trip:', error);
    }
}

// Delete trip function
async function deleteTrip(id) {
    if (confirm('Are you sure you want to delete this trip?')) {
        try {
            await fetch(`/api/trips/${id}`, { method: 'DELETE' });
            loadTrips('beach');  // Reload trips after deletion
        } catch (error) {
            console.error('Error deleting trip:', error);
        }
    }
}

    // Handle form submission to add a new trip
    const addTripForm = document.getElementById('add-trip-form');
if (addTripForm) {
    addTripForm.onsubmit = async (event) => {
        event.preventDefault();  // Prevent the default form submission behavior
        console.log("Submitting trip...");

        const trip = {
            destination: document.getElementById('destination').value,
            lengthOfStay: {
                nights: document.getElementById('nights').value,
                days: document.getElementById('days').value
            },
            startDate: document.getElementById('startDate').value,
            resort: document.getElementById('resort').value,
            pricePerPerson: document.getElementById('pricePerPerson').value,
            type: document.getElementById('type').value,  // Ensure type is selected
        };

        try {
            const response = await fetch('/api/trips', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(trip)
            });

            if (!response.ok) {
                throw new Error('Failed to add trip');
            }

            console.log('Trip added successfully');
            loadTrips(trip.type);  // Refresh the trip list for the selected category

            // Close the modal after successful submission
            document.getElementById('add-trip-modal').style.display = 'none';
            addTripForm.reset();  // Clear the form fields

        } catch (error) {
            console.error('Error adding trip:', error);
        }
    };
}



// Show the Add Trip form
function showAddTripForm() {
    console.log('Add Trip button clicked');
    const modal = document.getElementById('add-trip-modal');

    if (modal) {
        modal.style.display = 'block';
        console.log('Modal is now visible');
    } else {
        console.error('Add Trip modal not found');
    }
}

// Setup the login and registration modal functionality
function setupModals() {
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const loginLink = document.querySelector('#login-link');
    const registerButton = document.querySelector('#register-button');
    const closeButtons = document.querySelectorAll('.close-button');

    // Open login modal
    if (loginLink) {
        loginLink.onclick = () => loginModal.style.display = 'block';
    }

    // Open registration modal
    if (registerButton) {
        registerButton.onclick = () => {
            loginModal.style.display = 'none';  // Close login modal
            registerModal.style.display = 'block';  // Open registration modal
        };
    }

    // Close modals when clicking on close button
    closeButtons.forEach(button => {
        button.onclick = (event) => {
            event.target.closest('.modal').style.display = 'none';
        };
    });

    // Close modals when clicking outside of them
    window.onclick = (event) => {
        if (event.target === loginModal || event.target === registerModal) {
            event.target.style.display = 'none';
        }
    };
}

// Check login status and update UI (Reservations tab, login/logout visibility)
async function checkLoginStatus() {
    try {
        const response = await fetch('/auth/check-session');
        const { isLoggedIn } = await response.json();

        const reservationsTab = document.getElementById('reservations-tab');
        const loginLink = document.getElementById('login-link');
        const logoutButton = document.getElementById('logout-button');

        if (isLoggedIn) {
            reservationsTab.style.display = 'block';
            loginLink.style.display = 'none';
            logoutButton.style.display = 'block';
        } else {
            reservationsTab.style.display = 'none';
            loginLink.style.display = 'block';
            logoutButton.style.display = 'none';
        }
    } catch (error) {
        console.error('Error checking login status:', error);
    }
}
