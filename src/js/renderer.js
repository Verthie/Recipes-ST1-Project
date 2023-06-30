const { ipcRenderer } = require("electron");

const iconsPath = require("path").join(__dirname, "../img/icons.svg");
const icons = `file://${iconsPath}`;

document.addEventListener("DOMContentLoaded", () => {
  function getRecipe(recipe_details) {
    const recipeContainer = document.querySelector(".recipe");
    console.log("recipe_details:", recipe_details);
    const filteredIngredients = recipe_details.filter(
      (ingredient) => recipe_details.recipesId === recipe_details.id
    );
    const id = 0;
    const markup = `
        <figure class="recipe__fig">
          <img src="${
            recipe_details[id].image_url
          }" alt="Tomato" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${recipe_details[id].title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              recipe_details[id].cooking_time
            }</span>
            <span class="recipe__info-text">minut</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              recipe_details[id].serving_size
            }</span>
            <span class="recipe__info-text">ilość porcji</span>
          </div>

          <button class="btn--round" style="margin-left: 250px;">
            <svg class="">
              <use xlink:href="${icons}#icon-bookmark-fill"></use>
            </svg>
          </button>
        </div>

        <div class="recipeIngredients">
          <div class="recipe__ingredients">
            <h2 class="heading--2">Składniki</h2>
            <ul class="recipe__ingredient-list">
              ${filteredIngredients
                .map(
                  (ingredient) => `
                  <li class="recipe__ingredient">
                    <svg class="recipe__icon">
                      <use href="${icons}#icon-check"></use>
                    </svg>
                    <div class="recipe__quantity">${ingredient.quantity}</div>
                    <div class="recipe__description">
                      <span class="recipe__unit">${ingredient.unit}</span>
                      ${ingredient.name}
                    </div>
                  </li>
                `
                )
                .join("")}
            </ul>
          </div>
        </div>`;
    recipeContainer.innerHTML = "";
    recipeContainer.insertAdjacentHTML("afterbegin", markup);

    const bookmarkButton = recipeContainer.querySelector(".btn--round");
    bookmarkButton.addEventListener("click", function () {
      const recipeLoadId = recipe_details[id].recipesId;
      console.log("recipeLoadId:", recipeLoadId);
      ipcRenderer.send("bookmarkRecipe", recipeLoadId);
    });
  }

  function getResults(results) {
    const previewContainer = document.querySelector(".results");
    console.log("results:", results);
    const filteredResults = results.filter(
      (result) => results.id === results.id
    );
    const markup = `${filteredResults
      .map(
        (result) => `
            <li class="preview">
                <a class="preview__link preview__link--active" data-result-id="${result.id}" id="myButton" href="#">
                  <figure class="preview__fig">
                    <img src="${result.image_url}" alt="Test" />
                  </figure>
                  <div class="preview__data">
                    <h4 class="preview__title">${result.title}</h4>
                  </div>
                </a>
              </li>
                        `
      )
      .join("")};`;

    previewContainer.innerHTML = "";
    previewContainer.insertAdjacentHTML("afterbegin", markup);

    const buttons = previewContainer.querySelectorAll(".preview__link");
    buttons.forEach((button) => {
      button.addEventListener("click", function () {
        const recipeLoadId = button.getAttribute("data-result-id");
        ipcRenderer.send("detailsRecipe", recipeLoadId);
      });
    });
  }

  function getBookmarks(bookmarks) {
    const bookmarkContainer = document.querySelector(".bookmarks__list");
    console.log("bookmarks:", bookmarks);
    const filteredBookmarks = bookmarks.filter(
      (bookmark) => bookmarks.id === bookmarks.id
    );
    const markup = `${filteredBookmarks
      .map(
        (bookmark) => `
            <li class="preview">
                <a class="preview__link preview__link--active" data-result-id="${bookmark.id}" id="myButton" href="#">
                  <figure class="preview__fig">
                    <img src="${bookmark.image_url}" alt="Test" />
                  </figure>
                  <div class="preview__data">
                    <h4 class="preview__title">${bookmark.title}</h4>
                  </div>
                </a>
              </li>
                        `
      )
      .join("")};`;

    bookmarkContainer.innerHTML = "";
    bookmarkContainer.insertAdjacentHTML("afterbegin", markup);

    const buttons = bookmarkContainer.querySelectorAll(".preview__link");
    buttons.forEach((button) => {
      button.addEventListener("click", function () {
        const recipeLoadId = button.getAttribute("data-result-id");
        ipcRenderer.send("detailsRecipe", recipeLoadId);
      });
    });
  }

  document
    .getElementById("searchInput")
    .addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault(); // Prevent the form from submitting
        var recipesLoadTitle = document.getElementById("searchInput").value;
        // var recipesLoadTitle = document.querySelector(".search__field").value;
        ipcRenderer.send("leftBarRecipes", recipesLoadTitle);
      }
    });

  ipcRenderer.send("mainWindowLoaded");
  ipcRenderer.on("allBookmarkRecipesSent", function (evt, allrecipes) {
    // console.log(allrecipes);
    getBookmarks(allrecipes);
  });

  ipcRenderer.on("recipeWithIgSent", function (evt, recipeWithIg) {
    // console.log("recipeWithIg:", recipeWithIg);
    getRecipe(([results] = recipeWithIg));
  });

  ipcRenderer.on("recipesNoIgSent", function (evt, recipesNoIg) {
    // console.log("recipesNoIg:", recipesNoIg);
    getResults(recipesNoIg);
  });
});
