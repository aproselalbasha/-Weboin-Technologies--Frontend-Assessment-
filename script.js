document.addEventListener('DOMContentLoaded', () => {
    const myname = document.getElementById("name");
    const role = document.getElementById("role");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const course = document.getElementById("course");
    const status = document.getElementById("status");
    const submitbtn = document.getElementById("submit-btn");
    const mainCardContainer = document.querySelector(".main-card");

    //  update counts in localStorage
    function updateCounts() {
        const cards = document.querySelectorAll('.card');
        let placedCount = 0;
        let unplacedCount = 0;

        cards.forEach(card => {
            const statusText = card.querySelector('p:last-of-type').textContent.trim().split(':')[1].trim().toLowerCase();
            if (statusText === 'placed') {
                placedCount++;
            } else if (statusText === 'unplaced') {
                unplacedCount++;
            }
        });

        const totalCount = cards.length;

        // Save counts to localStorage
        localStorage.setItem('placedCount', placedCount);
        localStorage.setItem('unplacedCount', unplacedCount);
        localStorage.setItem('totalCount', totalCount);
    }

    //  create a new card element
    function createCard(data) {
        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
            <div class="main-cir">
                <div class="cir">${data.name.charAt(0).toUpperCase()}</div>
                <h2>${data.name}</h2>
            </div>
            <p><strong>Role:</strong> ${data.role}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone Number:</strong> ${data.phone}</p>
            <p><strong>Course:</strong> ${data.course}</p>
            <p><strong>Status:</strong> ${data.status}</p>
            <button class="delete-btn">Delete</button>
        `;

        // Add delete functionality
        const deleteBtn = div.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", () => {
            div.remove();
            updateCounts(); // Update counts after deletion
            saveCardsToLocalStorage(); // Save updated cards to localStorage
        });

        return div;
    }

    //  save cards to localStorage
    function saveCardsToLocalStorage() {
        const cards = Array.from(document.querySelectorAll('.card')).map(card => {
            return {
                name: card.querySelector('h2').textContent,
                role: card.querySelector('p:nth-of-type(1)').textContent.split(': ')[1],
                email: card.querySelector('p:nth-of-type(2)').textContent.split(': ')[1],
                phone: card.querySelector('p:nth-of-type(3)').textContent.split(': ')[1],
                course: card.querySelector('p:nth-of-type(4)').textContent.split(': ')[1],
                status: card.querySelector('p:nth-of-type(5)').textContent.split(': ')[1]
            };
        });
        localStorage.setItem('cards', JSON.stringify(cards));
    }

    // load cards from localStorage
    function loadCardsFromLocalStorage() {
        const savedCards = JSON.parse(localStorage.getItem('cards')) || [];
        savedCards.forEach(cardData => {
            const card = createCard(cardData);
            mainCardContainer.appendChild(card);
        });
        updateCounts(); // Update counts after loading
    }

    // Handle form submission
    submitbtn.addEventListener("click", (e) => {
        e.preventDefault();

        // Check if all fields are filled
        if (myname.value && role.value && email.value && phone.value && course.value && status.value) {
            // Create and add new card
            const cardData = {
                name: myname.value,
                role: role.value,
                email: email.value,
                phone: phone.value,
                course: course.value,
                status: status.value
            };
            const newCard = createCard(cardData);
            mainCardContainer.appendChild(newCard);

            // Save card to localStorage
            saveCardsToLocalStorage();

        
            myname.value = '';
            role.value = '';
            email.value = '';
            phone.value = '';
            course.value = '';
            status.value = '';

            // Update status counts and total count
            updateCounts();
        } else {
            alert('Please fill in all fields.');
        }
    });

    // Add delete functionality to existing static cards
    function addDeleteFunctionalityToExistingCards() {
        const deleteButtons = document.querySelectorAll('.card .delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const card = event.target.closest('.card');
                if (card) {
                    card.remove();
                    updateCounts(); // Update counts after deletion
                    saveCardsToLocalStorage(); // Save updated cards to localStorage
                }
            });
        });
    }

    // Initialize the page
    loadCardsFromLocalStorage(); // Load cards on page load
    addDeleteFunctionalityToExistingCards(); // Add delete functionality to static cards
});
