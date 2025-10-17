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

const loadLevelWord = (id) => {
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
  .then((res)=>res.json())
  .then((data)=>displayLevelWord(data))
};

const displayLevelWord = (words) => {
    console.log(words);
}

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
        <button onclick="loadLevelWord(${lesson.level_no})"
            class="w-full sm:w-auto text-[#422AD5] p-3 border-2 box-border border-[#422AD5] rounded-sm text-center hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-colors duration-200 focus:outline-none"
        >
            <i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}
        </button>
    `;

    // 4. append child into container
    levelContainer.appendChild(btnDiv);
  }
};
loadLessons();
