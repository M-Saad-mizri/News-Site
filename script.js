const apiKey = "1ba030a06b7d4f51b2014820d067609b";
const newsContainer = document.getElementById("newsContainer");
const searchButton = document.getElementById("searchButton");
const searchInput = document.getElementById("search");

function fetchNews(query) {
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
    query
  )}&apiKey=${apiKey}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      displayNews(data.articles);
    })
    .catch((error) => {
      console.error("Error fetching the news:", error);
      newsContainer.innerHTML =
        "<p>Failed to fetch news articles. Please try again later.</p>";
    });
}

function displayNews(articles) {
  newsContainer.innerHTML = ""; // Clear previous news
  if (articles.length === 0) {
    newsContainer.innerHTML = "<p>No articles found.</p>";
    return;
  }
  articles.forEach((article) => {
    const articleElem = document.createElement("article");
    articleElem.innerHTML = `
            <h2>${article.title}</h2>
            <img src="${
              article.urlToImage || "https://via.placeholder.com/400"
            }" alt="${article.title}">
            <p>${article.description || "No description available."}</p>
            <a href="${article.url}" target="_blank">Read more</a>
            <p><small>Published at: ${new Date(
              article.publishedAt
            ).toLocaleString()}</small></p>
        `;
    newsContainer.appendChild(articleElem);
  });
}

function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchCountry(lat, lon);
      },
      (error) => {
        console.error("Error getting location:", error);
        fetchNews("World"); // Fallback to global news
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
    fetchNews("World"); // Fallback to global news
  }
}

function fetchCountry(lat, lon) {
  const geoUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;

  fetch(geoUrl)
    .then((response) => response.json())
    .then((data) => {
      const userCity = data.city || data.principalSubdivision;
      searchInput.value = userCity; // Set input to user's city
      fetchNews(userCity); // Fetch news for user's city
    })
    .catch((error) => {
      console.error("Error fetching location data:", error);
      fetchNews("World"); // Fallback to global news
    });
}

searchButton.addEventListener("click", () => {
  const query = searchInput.value.trim(); // Get user input
  if (query) {
    fetchNews(query);
  }
});

const toggleButton = document.getElementById("toggleButton");

// Check for saved theme in localStorage
const currentTheme = localStorage.getItem("theme");
if (currentTheme === "dark") {
  document.body.classList.add("dark-mode");
}

// Toggle button event listener
toggleButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  // Save the user's preference
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
    toggleButton.innerText = "Switch to Light Mode";
  } else {
    localStorage.setItem("theme", "light");
    toggleButton.innerText = "Switch to Dark Mode";
  }
});

// Get user's location on load
getUserLocation();
