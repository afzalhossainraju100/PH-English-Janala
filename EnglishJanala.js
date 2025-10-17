// Flow: loadLessons -> displayLessons -> loadLevelWord -> displayLevelWord -> loadWordDetails -> displayWordDetails
const createElement = (arr) => {
  const htmlElements = arr
    .map(
      (item) => `<span class="btn bg-[#D7E4EF] p-2 rounded-lg">${item}</span>`
    )
    .join("");
  return htmlElements;
};
const manageSpinner = (status) => {
  if (status == true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("word-container").classList.add("hidden");
  } else {
    document.getElementById("spinner").classList.add("hidden");
    document.getElementById("word-container").classList.remove("hidden");
  }
};
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const loadLessons = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all") // promise of response
    .then((res) => res.json()) // promise of json data
    .then((data) => {
      // Normalize various API response shapes to an array
      const lessons = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.levels)
        ? data.levels
        : [];
      displayLessons(lessons);
    })
    .catch((err) => console.error("Failed to load lessons:", err));
};
const removeActive = () => {
  const lessonButtons = document.querySelectorAll(".lesson-btn");
  lessonButtons.forEach((btn) => btn.classList.remove("active"));
  console.log(lessonButtons);
};
const loadLevelWord = (id) => {
  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeActive();
      const clickBtn = document.getElementById(`lesson-btn-${id}`);
      clickBtn.classList.add("active");
      displayLevelWord(data.data);
    });
};
const loadWordDetails = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const details = await res.json();
  displayWordDetails(details.data);
};
const displayWordDetails = (word) => {
  console.log(word);
  const detailsContainer = document.getElementById("details-container");
  detailsContainer.innerHTML = `
    <div
              class="p-5 bg-[#ffffff] border-2 box-border border-[#edf7ff] rounded-lg flex flex-col gap-3"
            >
              <h1
                class="text-[#000000] text-[32px] font-[600] leading-[40px] text-left"
              >
                ${word.word} (<i class="fa-solid fa-microphone-lines"></i>: ${
    word.pronunciation
  })
              </h1>

              <div>
                <h2
                  class="text-[#000000] text-[24px] font-[600] leading-[40px] text-left"
                >
                  Meaning
                </h2>
                <h3
                  class="text-[#000000] text-[24px] font-[400] opacity-80 leading-[40px] text-left"
                >
                  ${word.meaning}
                </h3>
              </div>

              <div>
                <h2
                  class="text-[#000000] text-[24px] font-[600] leading-[40px] text-left"
                >
                  Example
                </h2>
                <p
                  class="text-[#000000] text-[24px] font-[400] opacity-80 leading-[40px] text-left"
                >
                  ${word.sentence}
                </p>
              </div>

              <div>
                <h2
                  class="text-[#000000] text-[24px] font-[500] leading-[40px] text-left"
                >
                  সমার্থক শব্দ গুলো
                </h2>
                <div class="flex justify-start gap-2">
                  ${createElement(word.synonyms)}
              </div>
            </div>
          </div>
    `;
  document.getElementById("word_modal").showModal();
};
const displayLevelWord = (words) => {
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";

  if (words.length == 0) {
    // for not available section
    wordContainer.innerHTML = `
        <div class="grid col-span-full">
        <div class="p-2">
         <div class="flex flex-col items-center"><img src="./assets/alert-error.png" alt="attention"></div>
          <p class="text-[#79716b] text-[13px] font-[400] leading-[24px] text-center font-bangla">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
          <h1 class="text-[#292524] text-[34px] font-[500] text-center font-bangla">নেক্সট Lesson এ যান</h1>
        </div>
       </div>
      `;
    manageSpinner(false);
    return;
  }

  words.forEach((word) => {
    const wordDiv = document.createElement("div");
    // make wrapper fill grid cell and inner card full height so footers align
    wordDiv.className = "h-full";
    wordDiv.innerHTML = `
          <div
            class="p-10 bg-[#FFFFFF] rounded-lg flex flex-col justify-between h-full"
          >
            <div>
              <h1
                class="text-[32px] font-[700] leanding-[24px] text-center text-[#000000]"
              >
                ${word.word ? word.word : "Word Not Found"}
              </h1>
              <p
                class="text-[#000000] text-[20px] font-[500] leanding-6 text-center"
              >
                Meaning /Pronounciation
              </p>
              <h1
                class="font-bangla text-[32px] font-[600] leanding-none text-center text-[#18181b]"
              >
                ${word.meaning ? word.meaning : "Meaning Not Found"}/${
      word.pronunciation ? word.pronunciation : "Pronunciation Not Found"
    }
              </h1>
            </div>
            <div class="flex justify-between items-center mt-5">
              <button onclick="loadWordDetails(${
                word.id
              })" class="p-3 bg-[#1a91ff1a] rounded-md">
                <i class="fa-solid fa-circle-info"></i>
              </button>
              <button onclick="pronounceWord('${
                word.word
              }')" class="p-3 bg-[#1a91ff1a] rounded-md">
                <i class="fa-solid fa-volume-high"></i>
              </button>
            </div>
          </div>
        `;
    //append child into container
    wordContainer.appendChild(wordDiv);
    manageSpinner(false);
  });
};
const displayLessons = (lessons) => {
  const levelContainer = document.getElementById("level-container");
  if (!levelContainer) {
    console.warn("#level-container element not found in DOM");
    return;
  }
  levelContainer.innerHTML = "";

  if (!Array.isArray(lessons) || lessons.length === 0) {
    levelContainer.innerHTML =
      '<p class="text-center text-gray-500">No lessons available.</p>';
    return;
  }
  for (const lesson of lessons) {
    const btnDiv = document.createElement("div");
    // try to display a sensible label from the lesson object
    const label =
      (lesson && (lesson.name || lesson.title || lesson.level || lesson.id)) ||
      "Lesson";
    btnDiv.innerHTML = `
        <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})"
            class="w-full sm:w-auto text-[#422AD5] p-3 border-2 box-border border-[#422AD5] rounded-sm text-center hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-colors duration-200 focus:outline-none lesson-btn"
        >
            <i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}
        </button>
    `;

    levelContainer.appendChild(btnDiv);
  }
};
// expose handlers to window for inline onclicks
window.loadLevelWord = loadLevelWord;
window.loadWordDetails = loadWordDetails;
window.loadLessons = loadLessons;
window.removeActive = removeActive;
loadLessons();
// search
document.getElementById("btn-search").addEventListener("click", () => {
  removeActive();
  const inputSearch = document.getElementById("input-search");
  const inputSearchValue = inputSearch.value.trim().toLowerCase();

  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;
      const filterWords = allWords.filter((word) =>
        word.word.toLowerCase().includes(inputSearchValue)
      );

      displayLevelWord(filterWords);
    });
});

//plus minus toggle function setupToggleButtons()
const toggleButtons = document.querySelectorAll(".plus, .minus");
toggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const parentLi = button.closest("li");
    const paragraph = parentLi.querySelector("p");

    if (button.classList.contains("plus")) {
      paragraph.style.display = "block";
      parentLi.querySelector(".plus").style.display = "none";
      parentLi.querySelector(".minus").style.display = "inline";
    } else {
      paragraph.style.display = "none";
      parentLi.querySelector(".plus").style.display = "inline";
      parentLi.querySelector(".minus").style.display = "none";
    }
  });
});

// Initially hide all paragraphs and show only plus buttons
document.querySelectorAll("li p").forEach((p) => (p.style.display = "none"));
document.querySelectorAll(".minus").forEach((btn) => (btn.style.display = "none"));