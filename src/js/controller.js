import data from "../../data.json";
import icons from "url:../img/icons.svg";

const recipeContainer = document.querySelector(".recipe");
const previewContainer = document.querySelector(".results");
const searchInput = document.querySelector(".search__field");

let { recipes } = data;

const renderSpinner = function (parentElement) {
  const markup = `
    <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
    </div>
  `;
  parentElement.innerHTML = "";
  parentElement.insertAdjacentHTML("afterbegin", markup);
};

function getRecipe(id) {
  renderSpinner(recipeContainer);
  let { recipe_details } = data;
  console.log(data);

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

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--increase-servings">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--increase-servings">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round">
            <svg class="">
              <use href="${icons}#icon-bookmark-fill"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Składniki</h2>
          <ul class="recipe__ingredient-list">
            ${recipe_details[id].ingredients
              .map((ing) => {
                return `
            <li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
              </svg>
              <div class="recipe__quantity">${ing.quantity}</div>
              <div class="recipe__description">
                <span class="recipe__unit">${ing.unit}</span>
                ${ing.name}
              </div>
            </li>
            `;
              })
              .join("")}
        </div>
  `;
  recipeContainer.innerHTML = "";
  recipeContainer.insertAdjacentHTML("afterbegin", markup);
}

recipes.forEach((recipe) => {
  const button = document.createElement("button");

  button.textContent = recipe.name;
  previewContainer.appendChild(button);

  button.addEventListener("click", () => {
    getRecipe(recipe.id);
    console.log(`Button ${recipe.id} was clicked.`);
  });
});

const searchAction = function () {
  searchInput.addEventListener("keyup", function () {
    const query = searchInput.value.toLowerCase();
    const filteredRecipes = recipes.filter((recipe) => {
      return recipe.name.toLowerCase().includes(query);
    });
    console.log(filteredRecipes);
    previewContainer.innerHTML = "";
    filteredRecipes.forEach((recipe) => {
      const button = document.createElement("button");

      button.textContent = recipe.name;
      previewContainer.appendChild(button);

      button.addEventListener("click", () => {
        getRecipe(recipe.id);
        console.log(`Button ${recipe.id} was clicked.`);
      });
    });
  });
};

getRecipe(0);
searchAction();
