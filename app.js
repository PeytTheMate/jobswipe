// DOM Elements
const cardStack = document.getElementById('cardStack');
const profileModal = document.getElementById('profileModal');
const matchesModal = document.getElementById('matchesModal');
const savedModal = document.getElementById('savedModal');
const profileForm = document.getElementById('profileForm');

// Buttons
const profileBtn = document.getElementById('profileBtn');
const matchesBtn = document.getElementById('matchesBtn');
const savedBtn = document.getElementById('savedBtn');
const leftSwipeBtn = document.getElementById('leftSwipe');
const rightSwipeBtn = document.getElementById('rightSwipe');
const upSwipeBtn = document.getElementById('upSwipe');

// State
let currentJobIndex = 0;
let currentCard = null;
let startX = 0;
let startY = 0;
let currentX = 0;
let currentY = 0;
let isDragging = false;

// Initialize the app
function init() {
    loadNextCard();
    setupEventListeners();
    loadUserProfile();
}

// Event Listeners
function setupEventListeners() {
    // Modal toggles
    profileBtn.addEventListener('click', () => toggleModal(profileModal));
    matchesBtn.addEventListener('click', () => {
        loadMatches();
        toggleModal(matchesModal);
    });
    savedBtn.addEventListener('click', () => {
        loadSavedJobs();
        toggleModal(savedModal);
    });

    // Swipe buttons
    leftSwipeBtn.addEventListener('click', () => handleSwipe('left'));
    rightSwipeBtn.addEventListener('click', () => handleSwipe('right'));
    upSwipeBtn.addEventListener('click', () => handleSwipe('up'));

    // Profile form
    profileForm.addEventListener('submit', handleProfileSubmit);

    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
}

// Card Management
function createJobCard(job) {
    const card = document.createElement('div');
    card.className = 'job-card';
    card.innerHTML = `
        <div class="company-info">
            <img src="${job.companyLogo}" alt="${job.company}" onerror="this.src='https://via.placeholder.com/40'">
            <h3>${job.company}</h3>
        </div>
        <h2>${job.title}</h2>
        <p class="salary">${job.salary}</p>
        <p>${job.location} ${job.remote ? '• Remote' : ''}</p>
        <p>${job.description}</p>
        <div class="skills">
            ${job.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
        </div>
        <p>Experience: ${job.experience}</p>
    `;

    // Touch events for mobile
    card.addEventListener('touchstart', handleDragStart);
    card.addEventListener('touchmove', handleDragMove);
    card.addEventListener('touchend', handleDragEnd);

    // Mouse events for desktop
    card.addEventListener('mousedown', handleDragStart);
    card.addEventListener('mousemove', handleDragMove);
    card.addEventListener('mouseup', handleDragEnd);
    card.addEventListener('mouseleave', handleDragEnd);

    return card;
}

function loadNextCard() {
    if (currentJobIndex >= mockJobs.length) {
        cardStack.innerHTML = '<div class="no-more-cards">No more jobs to show!</div>';
        return;
    }

    const job = mockJobs[currentJobIndex];
    const card = createJobCard(job);
    cardStack.innerHTML = '';
    cardStack.appendChild(card);
    currentCard = card;
}

// Swipe Handling
function handleDragStart(e) {
    if (!currentCard) return;
    isDragging = true;
    startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    startY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
    currentCard.classList.add('swiping');
}

function handleDragMove(e) {
    if (!isDragging || !currentCard) return;
    e.preventDefault();

    const currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    const currentY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;

    currentCard.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${deltaX * 0.1}deg)`;
}

function handleDragEnd(e) {
    if (!isDragging || !currentCard) return;
    isDragging = false;
    currentCard.classList.remove('swiping');

    const deltaX = e.type === 'mouseup' ? e.clientX - startX : 0;
    const deltaY = e.type === 'mouseup' ? e.clientY - startY : 0;

    if (Math.abs(deltaX) > 100) {
        handleSwipe(deltaX > 0 ? 'right' : 'left');
    } else if (deltaY < -100) {
        handleSwipe('up');
    } else {
        currentCard.style.transform = '';
    }
}

function handleSwipe(direction) {
    if (!currentCard) return;

    const job = mockJobs[currentJobIndex];
    currentCard.classList.add(`swipe-${direction}`);

    switch (direction) {
        case 'right':
            handleMatch(job);
            break;
        case 'left':
            // Just pass on this job
            break;
        case 'up':
            saveJob(job);
            break;
    }

    setTimeout(() => {
        currentJobIndex++;
        loadNextCard();
    }, 300);
}

// Match Handling
function handleMatch(job) {
    // Simulate matching algorithm (random for demo)
    const isMatch = Math.random() > 0.5;
    
    if (isMatch) {
        const matches = JSON.parse(localStorage.getItem(STORAGE_KEYS.MATCHES) || '[]');
        matches.push(job);
        localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
        showMatchNotification(job);
    }
}

function showMatchNotification(job) {
    // Create and show a match notification
    const notification = document.createElement('div');
    notification.className = 'match-notification';
    notification.innerHTML = `
        <h3>It's a Match!</h3>
        <p>You matched with ${job.company} for the ${job.title} position!</p>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Saved Jobs
function saveJob(job) {
    const savedJobs = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_JOBS) || '[]');
    if (!savedJobs.find(j => j.id === job.id)) {
        savedJobs.push(job);
        localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(savedJobs));
    }
}

// Modal Management
function toggleModal(modal) {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
    modal.classList.add('active');
}

function loadMatches() {
    const matches = JSON.parse(localStorage.getItem(STORAGE_KEYS.MATCHES) || '[]');
    const matchesList = document.getElementById('matchesList');
    matchesList.innerHTML = matches.map(job => `
        <div class="match-item">
            <h3>${job.title} at ${job.company}</h3>
            <p>${job.location}</p>
            <button onclick="startChat(${job.id})">Start Chat</button>
        </div>
    `).join('') || '<p>No matches yet. Keep swiping!</p>';
}

function loadSavedJobs() {
    const savedJobs = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_JOBS) || '[]');
    const savedList = document.getElementById('savedList');
    savedList.innerHTML = savedJobs.map(job => `
        <div class="saved-item">
            <h3>${job.title}</h3>
            <p>${job.company} • ${job.location}</p>
            <p class="salary">${job.salary}</p>
        </div>
    `).join('') || '<p>No saved jobs yet. Swipe up to save jobs!</p>';
}

// Profile Management
function loadUserProfile() {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_PROFILE));
    if (user) {
        document.getElementById('name').value = user.name;
        document.getElementById('title').value = user.title;
        document.getElementById('skills').value = user.skills.join(', ');
        document.getElementById('experience').value = user.experience;
    }
}

function handleProfileSubmit(e) {
    e.preventDefault();
    const formData = {
        name: document.getElementById('name').value,
        title: document.getElementById('title').value,
        skills: document.getElementById('skills').value.split(',').map(s => s.trim()),
        experience: parseInt(document.getElementById('experience').value),
    };
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(formData));
    toggleModal(profileModal);
}

// Chat functionality (basic implementation)
function startChat(jobId) {
    // This would typically open a chat interface
    alert('Chat functionality would open here in a full implementation');
}

// Initialize the app
init();