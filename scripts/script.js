// Set default theme as dark
document.documentElement.setAttribute("data-theme", "dark");

// Available Categories from APIs
const CATEGORIES = {
  jokes: ["Programming", "Miscellaneous", "Dark", "Pun"],
  memes: ["memes"],
};

const contentContainer = document.getElementById("content-container");
const loadingIndicator = document.getElementById("loading");
const categorySelector = document.getElementById("category-selector");
const themeToggle = document.getElementById("theme-toggle");

let selectedCategories = [];
let page = 1;
let isLoading = false;

// Theme Toggle
themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  document.documentElement.setAttribute(
    "data-theme",
    currentTheme === "dark" ? "light" : "dark"
  );
});

// Category Selection
function createCategoryButtons() {
  const allCategories = [...CATEGORIES.jokes, ...CATEGORIES.memes];
  allCategories.forEach((category) => {
    const btn = document.createElement("button");
    btn.textContent = category;
    btn.classList.add("category-btn");
    btn.addEventListener("click", () => {
      btn.classList.toggle("active");

      if (btn.classList.contains("active")) {
        selectedCategories.push(category);
      } else {
        selectedCategories = selectedCategories.filter((c) => c !== category);
      }

      // Reset content when categories change
      contentContainer.innerHTML = "";
      page = 1;
      fetchContent();
    });
    categorySelector.appendChild(btn);
  });
}

function showShareModal(content) {
  // Create share modal
  const overlay = document.createElement("div");
  overlay.classList.add("share-overlay");

  // Generate shareable message and link
  const shareType = content.type === "meme" ? "meme" : "joke";
  const shareMessage = `Check out this awesome ${shareType}!`;

  // Different share logic for memes and jokes
  const shareLink = content.type === "meme" ? content.content : content.content;

  overlay.innerHTML = `
              <div class="share-modal">
                  <button class="close-share">&times;</button>
                  <h3>Share ${
                    shareType.charAt(0).toUpperCase() + shareType.slice(1)
                  }</h3>
                  
                  <div class="share-link-container">
                      <input type="text" class="share-link" value="${
                        content.type === "meme" ? shareLink : content.content
                      }" readonly>
                      <button class="copy-btn">Copy</button>
                  </div>

                  <div class="social-share">
                      <button class="social-share-btn whatsapp-share" title="WhatsApp">
                          <i class="fab fa-whatsapp"></i>
                      </button>
                      <button class="social-share-btn telegram-share" title="Telegram">
                          <i class="fab fa-telegram"></i>
                      </button>
                      <button class="social-share-btn twitter-share" title="Twitter">
                          <i class="fab fa-twitter"></i>
                      </button>
                  </div>

                  <p class="mt-3">
                      Watch more ${shareType}s infinitely at https://whonehuljain.github.io/brainrot-scroll/
                  </p>
              </div>
          `;

  // Add event listeners
  overlay.querySelector(".close-share").addEventListener("click", () => {
    document.body.removeChild(overlay);
  });

  overlay.querySelector(".copy-btn").addEventListener("click", () => {
    const linkInput = overlay.querySelector(".share-link");
    linkInput.select();
    document.execCommand("copy");
  });

  // Social Share Buttons
  overlay.querySelector(".whatsapp-share").addEventListener("click", () => {
    const url = `https://wa.me/?text=${encodeURIComponent(
      content.type === "meme"
        ? `${shareMessage}\n${shareLink}\n\nWatch more ${shareType}s infinitely at https://whonehuljain.github.io/brainrot-scroll/`
        : `${shareMessage}\n\n"${content.content}"\n\nWatch more ${shareType}s infinitely at https://whonehuljain.github.io/brainrot-scroll/`
    )}`;
    window.open(url, "_blank");
  });

  overlay.querySelector(".telegram-share").addEventListener("click", () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(
      shareLink
    )}&text=${encodeURIComponent(
      content.type === "meme"
        ? `${shareMessage}\n\nWatch more ${shareType}s infinitely at https://whonehuljain.github.io/brainrot-scroll/`
        : `${shareMessage}\n\n"${content.content}"\n\nWatch more ${shareType}s infinitely at https://whonehuljain.github.io/brainrot-scroll/`
    )}`;
    window.open(url, "_blank");
  });

  overlay.querySelector(".twitter-share").addEventListener("click", () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      content.type === "meme"
        ? `${shareMessage}\n${shareLink}\n\nWatch more ${shareType}s infinitely at https://whonehuljain.github.io/brainrot-scroll/`
        : `${shareMessage}\n\n"${content.content}"\n\nWatch more ${shareType}s infinitely at https://whonehuljain.github.io/brainrot-scroll/`
    )}`;
    window.open(url, "_blank");
  });

  document.body.appendChild(overlay);
}

async function fetchContent() {
  if (isLoading) return;

  isLoading = true;
  loadingIndicator.style.display = "block";

  try {
    const contents = [];

    // Fetch Jokes
    const jokeResponse = await fetch(
      `https://v2.jokeapi.dev/joke/${
        selectedCategories.length ? selectedCategories.join(",") : "Any"
      }?type=single&amount=5`
    );
    const jokes = await jokeResponse.json();
    contents.push(
      ...jokes.jokes.map((joke) => ({
        type: "joke",
        content: joke.joke,
        category: joke.category,
      }))
    );

    // Fetch Memes
    const selectedMemeCats = selectedCategories.filter((cat) =>
      CATEGORIES.memes.includes(cat)
    );
    const memeUrl = selectedMemeCats.length
      ? `https://meme-api.com/gimme/${selectedMemeCats.join(",")}`
      : "https://meme-api.com/gimme/5";
    const memeResponse = await fetch(memeUrl);
    const memes = await memeResponse.json();
    contents.push(
      ...(memes.memes || []).map((meme) => ({
        type: "meme",
        content: meme.url,
        category: meme.subreddit,
      }))
    );

    // Shuffle and render content
    contents.sort(() => Math.random() - 0.5).forEach(renderContent);

    page++;
  } catch (error) {
    console.error("Error fetching content:", error);
  } finally {
    isLoading = false;
    loadingIndicator.style.display = "none";
  }
}

function renderContent(content) {
  const card = document.createElement("div");
  card.classList.add("content-card");

  // Render meme or joke
  card.innerHTML =
    content.type === "meme"
      ? `
                  <img src="${content.content}" alt="Meme" class="content-image">
                  <div class="reaction-buttons">
                      <button class="reaction-btn laugh-btn"><i class="fas fa-laugh"></i></button>
                      <button class="reaction-btn like-btn"><i class="fas fa-heart"></i></button>
                      <button class="reaction-btn share-btn"><i class="fas fa-share"></i></button>
                  </div>
              `
      : `
                  <div class="content-text">${content.content}</div>
                  <div class="reaction-buttons">
                      <button class="reaction-btn laugh-btn"><i class="fas fa-laugh"></i></button>
                      <button class="reaction-btn like-btn"><i class="fas fa-heart"></i></button>
                      <button class="reaction-btn share-btn"><i class="fas fa-share"></i></button>
                  </div>
              `;

  // Reaction buttons functionality
  const laughBtn = card.querySelector(".laugh-btn");
  const likeBtn = card.querySelector(".like-btn");
  const shareBtn = card.querySelector(".share-btn");
  shareBtn.addEventListener("click", () => {
    showShareModal(content);
  });

  laughBtn.addEventListener("click", () => {
    laughBtn.classList.toggle("active");
  });

  likeBtn.addEventListener("click", () => {
    likeBtn.classList.toggle("liked");
  });

  contentContainer.appendChild(card);
}

// Infinite scroll logic
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
    fetchContent();
  }
});

// Initialize
createCategoryButtons();
fetchContent();
