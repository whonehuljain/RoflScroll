// API URLs
const JOKE_API = "https://v2.jokeapi.dev/joke/Any?type=single&amount=10";
const MEME_API = "https://meme-api.com/gimme/10";

const contentContainer = document.getElementById("content-container");
const loadingIndicator = document.getElementById("loading");
let page = 1;
let isLoading = false;

async function fetchContent() {
  if (isLoading) return;

  isLoading = true;
  loadingIndicator.style.display = "block";

  try {
    // Fetch both jokes and memes
    const [jokeResponse, memeResponse] = await Promise.all([
      fetch(JOKE_API),
      fetch(MEME_API),
    ]);

    const jokes = await jokeResponse.json();
    const memes = await memeResponse.json();

    // Combine and shuffle content
    const combinedContent = [...jokes.jokes, ...memes.memes].sort(
      () => Math.random() - 0.5
    );

    combinedContent.forEach((content) => {
      const card = document.createElement("div");
      card.classList.add("content-card");

      // Determine if it's a meme or joke
      if (content.url) {
        // Meme
        card.innerHTML = `
                            <img src="${content.url}" alt="Meme" class="content-image">
                            <div class="reaction-buttons">
                                <button class="reaction-btn"><i class="fas fa-laugh"></i></button>
                                <button class="reaction-btn"><i class="fas fa-heart"></i></button>
                                <button class="reaction-btn"><i class="fas fa-share"></i></button>
                            </div>
                        `;
      } else {
        // Joke
        card.innerHTML = `
                            <div class="content-text">${content.joke}</div>
                            <div class="reaction-buttons">
                                <button class="reaction-btn"><i class="fas fa-laugh"></i></button>
                                <button class="reaction-btn"><i class="fas fa-heart"></i></button>
                                <button class="reaction-btn"><i class="fas fa-share"></i></button>
                            </div>
                        `;
      }

      contentContainer.appendChild(card);
    });

    page++;
  } catch (error) {
    console.error("Error fetching content:", error);
  } finally {
    isLoading = false;
    loadingIndicator.style.display = "none";
  }
}

// Infinite scroll logic
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
    fetchContent();
  }
});

// Initial content load
fetchContent();
