// Toggle
let openMenu = document.getElementById('menu_open');
let openMenuPath = '<svg  id="menu_open" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z"></path></svg>';
let closeMenu = document.createElementNS("http://www.w3.org/2000/svg", "svg");
closeMenu.setAttribute("id", "close_menu");
closeMenu.setAttribute("xmlns", "http://www.w3.org/2000/svg");
closeMenu.setAttribute("fill", "none");
closeMenu.setAttribute("viewBox", "0 0 24 24");
closeMenu.style.width = "24";
closeMenu.innerHTML = `<path fill="#F5F5F5" d="m17.1 19.15 -2.3 2.325c-0.15 0.15 -0.325 0.225 -0.525 0.225s-0.375 -0.075 -0.525 -0.225c-0.15 -0.15 -0.225 -0.32915 -0.225 -0.5375 0 -0.20835 0.075 -0.3875 0.225 -0.5375l2.3 -2.3 -2.325 -2.3c-0.15 -0.15 -0.225 -0.325 -0.225 -0.525s0.075 -0.375 0.225 -0.525c0.15 -0.15 0.32915 -0.225 0.5375 -0.225 0.20835 0 0.3875 0.075 0.5375 0.225l2.3 2.3 2.3 -2.325c0.15 -0.15 0.325 -0.225 0.525 -0.225s0.375 0.075 0.525 0.225c0.15 0.15 0.225 0.32915 0.225 0.5375 0 0.20835 -0.075 0.3875 -0.225 0.5375l-2.3 2.3 2.325 2.3c0.15 0.15 0.225 0.325 0.225 0.525s-0.075 0.375 -0.225 0.525c-0.15 0.15 -0.32915 0.225 -0.5375 0.225 -0.20835 0 -0.3875 -0.075 -0.5375 -0.225l-2.3 -2.3ZM3.75 15.75c-0.2125 0 -0.390585 -0.07235 -0.53425 -0.217C3.071915 15.3885 3 15.20935 3 14.9955c0 -0.21365 0.071915 -0.39135 0.21575 -0.533 0.143665 -0.14165 0.32175 -0.2125 0.53425 -0.2125h6c0.2125 0 0.39065 0.07235 0.5345 0.217 0.14365 0.1445 0.2155 0.32365 0.2155 0.5375 0 0.21365 -0.07185 0.39135 -0.2155 0.533 -0.14385 0.14165 -0.322 0.2125 -0.5345 0.2125h-6Zm0 -4.125c-0.2125 0 -0.390585 -0.07235 -0.53425 -0.217C3.071915 11.2635 3 11.08435 3 10.8705c0 -0.21365 0.071915 -0.39135 0.21575 -0.533 0.143665 -0.14165 0.32175 -0.2125 0.53425 -0.2125H14c0.2125 0 0.39065 0.07235 0.5345 0.217 0.14365 0.1445 0.2155 0.32365 0.2155 0.5375 0 0.21365 -0.07185 0.39135 -0.2155 0.533 -0.14385 0.14165 -0.322 0.2125 -0.5345 0.2125H3.75Zm0 -4.125c-0.2125 0 -0.390585 -0.07235 -0.53425 -0.217C3.071915 7.1385 3 6.95935 3 6.7455c0 -0.21365 0.071915 -0.39135 0.21575 -0.533C3.359415 6.07085 3.5375 6 3.75 6H14c0.2125 0 0.39065 0.07235 0.5345 0.217 0.14365 0.1445 0.2155 0.32365 0.2155 0.5375 0 0.21365 -0.07185 0.39135 -0.2155 0.533 -0.14385 0.14165 -0.322 0.2125 -0.5345 0.2125H3.75Z" stroke-width="0.5"></path>`;

let navLinks = document.getElementById('nav_links');
let lightMode = document.getElementById('light_mode');

openMenu.addEventListener('click', (e) =>{
    // Change path to close-menu
    openMenu.replaceWith(closeMenu);
    // Show the nav-links
    navLinks.classList.add('active');
    navbar.style.background = 'none';
});

closeMenu.addEventListener('click', (e) =>{
    // Change path to open-menu
    closeMenu.replaceWith(openMenu);
    // Hide the nav-links
    navLinks.classList.remove('active');
});

// Dynamic Post
// Select main sections
const freshHighlightsContainer = document.getElementById("latest_posts"); // Stores 3 latest posts
const spotlightContainer = document.getElementById("spotlight-posts"); // Stores all remaining posts
const searchInput = document.getElementById("search"); // Search bar

// Function to show a loading indicator
function showLoading() {
  freshHighlightsContainer.innerHTML = `<p class="loading">Loading posts...</p>`;
}

// Function to remove the loading indicator
function removeLoading() {
  const loadingElement = document.querySelector(".loading");
  if (loadingElement) {
    loadingElement.remove();
  }
}

// Function to fetch all posts (handling pagination)
async function fetchAllPosts(tag = "wecoded", maxPages = 5) {
  let allPosts = [];
  let currentPage = 1;

  try {
    while (currentPage <= maxPages) {
      const response = await fetch(`https://dev.to/api/articles?tag=${tag}&page=${currentPage}`);
      const posts = await response.json();

      console.log("Fetched Posts (Before Sorting):", posts); 

      if (posts.length === 0) break; // Stop fetching if no more posts
      allPosts = [...allPosts, ...posts];
      currentPage++;
    }

    return allPosts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

let sortedPosts;
// Function to sort posts by date (newest first)
function sortPostsByDate(posts) {
  const filteredPosts = posts.filter(post => post.tags.includes("wecoded") && post.published_at &&
  !post.title.toLowerCase().includes("cancel my jio airfiber"));
  sortedPosts = filteredPosts.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
  console.log("Filtered & Sorted Posts:", sortedPosts);   
  return sortedPosts;
}


// Function to create a post element
function createPostElement(post) {
  const postElement = document.createElement("div");
  postElement.classList.add("post");

  postElement.innerHTML = `
     <img src="${post.cover_image || post.social_image}" alt="post image">
     <div class = "container"> 
       <div class="meta">
           <div class="date">${new Date(post.published_at).toLocaleDateString()}</div>
           <div class="read_time">${post.reading_time_minutes} min read</div>
       </div>
       <div class="title">
         <div class="logo">
             <img src="${post.user.profile_image}" alt="${post.user.name}" class="author-avatar">
         </div>
         <h3 class="small_h3">${post.title}</h3>
       </div>
       <div class="post_content">
        ${post.description}
       </div>
       <a href="${post.url}" class="cta" target="Read full post">Read More</a>
     </div>
  `;

  return postElement;
}

// Function to display posts dynamically
async function fetchAndDisplayPosts() {
  showLoading(); // Show loading indicator

  try {
    let posts = await fetchAllPosts("wecoded", 5); // Fetch from multiple pages
    posts = sortPostsByDate(posts); // Sort by date

    removeLoading(); // Remove loading indicator
    freshHighlightsContainer.innerHTML = ""; // Clear previous content
    spotlightContainer.innerHTML = ""; // Clear spotlight section

    if (posts.length === 0) {
      freshHighlightsContainer.innerHTML = `<p class="error">No posts found.</p>`;
      return;
    }

    // Display the 3 latest posts in Fresh Highlights
    sortedPosts.slice(0, 5).forEach((post) => {
      const postElement = createPostElement(post);
      freshHighlightsContainer.appendChild(postElement);
    });

    // Store remaining posts for Spotlights section
    allSpotlightPosts = sortedPosts.slice(5);
    displaySpotlightPosts(allSpotlightPosts);

  } catch (error) {
    console.error("Error displaying posts:", error);
    removeLoading();
    freshHighlightsContainer.innerHTML = `<p class="error">Failed to load posts. Please try again later.</p>`;
  }
}

// Function to display Spotlights section (Horizontal scrolling)
function displaySpotlightPosts(posts) {
    spotlightContainer.innerHTML = "";
    posts.forEach((post) => spotlightContainer.appendChild(createPostElement(post)));
}

// Search function with debouncing
function debounce(func, delay) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
}

// Optimized search function
const handleSearch = debounce((query) => {
    if (query.trim() === "") {
      displaySpotlightPosts(allSpotlightPosts); // Reset to original posts
      return;
    }
  
    const filteredPosts = allSpotlightPosts.filter((post) =>
      post.title.toLowerCase().includes(query.toLowerCase())
    );
  
    displaySpotlightPosts(filteredPosts);
  }, 300); // 300ms delay for better performance
  
// Attach event listener once
searchInput.addEventListener("input", (e) => handleSearch(e.target.value));

// Run function when page loads
fetchAndDisplayPosts();

// Carousel function
document.addEventListener("DOMContentLoaded", function () {
    const spotlightTrack = document.getElementById("spotlight-posts");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
  
    function scrollCarousel(direction) {
      const scrollAmount = 300; // Adjust scroll step
      spotlightTrack.scrollBy({
        left: direction * scrollAmount,
        behavior: "smooth",
      });
    }
    setInterval(() => scrollCarousel(1), 20000);
    prevBtn.addEventListener("click", () => scrollCarousel(-1));
    nextBtn.addEventListener("click", () => scrollCarousel(1));
  });
  
  
// Theme
let sun = document.getElementById('light_mode');
let moon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
moon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
moon.setAttribute("viewBox", "0 0 24 24");
moon.setAttribute("fill", "currentColor");

const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
path.setAttribute("d", "M11.3807 2.01886C9.91573 3.38768 9 5.3369 9 7.49999C9 11.6421 12.3579 15 16.5 15C18.6631 15 20.6123 14.0843 21.9811 12.6193C21.6613 17.8537 17.3149 22 12 22C6.47715 22 2 17.5228 2 12C2 6.68514 6.14629 2.33869 11.3807 2.01886Z");

moon.appendChild(path);

sun.onclick = function(){
  document.body.classList.add('dark-theme');
  sun.replaceWith(moon);
}

moon.onclick = function(){
  document.body.classList.remove('dark-theme');
  moon.replaceWith(sun);
}

