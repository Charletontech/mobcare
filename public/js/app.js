// var joinUs = document.querySelector('.hero-text-sub button')

// joinUs.addEventListener('click', () => { 
//     joinUs.style.transform = "scale(0.8)";
//     joinUs.style.transform = "scale(1)";
// })

// // joinUs.addEventListener('mouseup', () => {
// //     joinUs.style.transform = "scale(1)"
// //     joinUs.style.background = '#046599'
// // })

function toggleSidebar() {
    var sidebar = document.getElementById('sidebar');
    if (sidebar.style.left === "0px") {
        sidebar.style.left = "-250px";
    } else {
        sidebar.style.left = "0px";
    }
}


 // Function to remove loader overlay
 function removeLoaderOverlay() {
    var loaderOverlay = document.getElementById('loader-overlay');
    loaderOverlay.style.display = 'none';
}

// Event listener for page load
window.addEventListener('load', function () {
    // Hide the loader overlay when the page has fully loaded
    removeLoaderOverlay();
});

// Event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    // Your code to execute when the DOM is ready
});




function handleIntersection(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
        }
    });
}

// Create an intersection observer for fading and sliding sections
const fadeSlideObserver = new IntersectionObserver(handleIntersection, {
    root: null,
    rootMargin: '0px',
    threshold: 0.5, // Adjust this threshold as needed
});

// Observe sections with the "fade-slide-section" class
document.querySelectorAll('.fade-slide-section').forEach(section => {
    fadeSlideObserver.observe(section);
});

