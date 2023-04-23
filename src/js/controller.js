import data from "../../data.json";
import icons from "url:../img/icons.svg";

const recipeContainer = document.querySelector(".recipe");

async function getRecipies() {
  let { recipes } = data;
  let { name, image_url, servings, ingredients } = recipes[0];
  let { recipe_details } = data;
  console.log(data);
  console.log(recipes[0].image_url);

  const markup = `
        <figure class="recipe__fig">
          <img src="${
            recipe_details[0].image_url
          }" alt="Tomato" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${recipe_details[0].title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              recipe_details[0].cooking_time
            }</span>
            <span class="recipe__info-text">minut</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              recipe_details[0].serving_size
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
            ${recipe_details[0].ingredients
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

getRecipies();
