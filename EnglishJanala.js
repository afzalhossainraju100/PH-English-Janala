const loadLessons = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all") // promise of response
    .then((res) => res.json()) // promise of json data
    .then((data) => {
      // The API often returns an object like { status: true, data: [...] }
      // Normalize to an array if possible, otherwise pass an empty array
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

const displayLevelWord = (words) => {
  const wordContainer = document.getElementById("word-container");
  // Clear previous content
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
              <button onclick="my_modal_5.showModal()" class="p-3 bg-[#1a91ff1a] rounded-md">
                <i class="fa-solid fa-circle-info"></i>
              </button>
              <button class="p-3 bg-[#1a91ff1a] rounded-md">
                <i class="fa-solid fa-volume-high"></i>
              </button>
            </div>
          </div>
        `;
    //append child into container
    wordContainer.appendChild(wordDiv);
  });
};

const displayLessons = (lessons) => {
  // 1. get the container & validate
  const levelContainer = document.getElementById("level-container");
  if (!levelContainer) {
    console.warn("#level-container element not found in DOM");
    return;
  }
  // clear previous content
  levelContainer.innerHTML = "";

  // 2. validate lessons is iterable (array)
  if (!Array.isArray(lessons) || lessons.length === 0) {
    levelContainer.innerHTML =
      '<p class="text-center text-gray-500">No lessons available.</p>';
    return;
  }
  // 3. render each lesson safely
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

    // 4. append child into container
    levelContainer.appendChild(btnDiv);
  }
};
loadLessons();
