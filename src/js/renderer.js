const { ipcRenderer } = require("electron");

var knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "../../database.sqlite",
  },
});

const iconsPath = require("path").join(__dirname, "../img/icons.svg");
const icons = `file://${iconsPath}`;

document.addEventListener("DOMContentLoaded", () => {
  const recipeContainer = document.querySelector(".recipe");
  const previewContainer = document.querySelector(".results");
  const searchInput = document.querySelector(".search__field");
  let recipeLoadId = 1;
  let recipesLoadTitle = "Kurczak Curry";
  function getRecipe(recipe_details) {
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

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--increase-servings">
                <svg>
                  <use xlink:href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--increase-servings">
                <svg>
                  <use xlink:href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated">
            <svg>
              <use xlink:href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round">
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
  }

  ipcRenderer.send("mainWindowLoaded");
  ipcRenderer.send("detailsRecipe", recipeLoadId);
  ipcRenderer.send("leftBarRecipes", recipesLoadTitle);

  // ipcRenderer.on("allRecipesSent", function (evt, allrecipes) {
  //   console.log(allrecipes);
  // });

  ipcRenderer.on("recipeWithIgSent", function (evt, recipeWithIg) {
    console.log("recipeWithIg:", recipeWithIg);
    getRecipe(recipeWithIg);
  });

  ipcRenderer.on("recipesNoIgSent", function (evt, recipesNoIg) {
    console.log("recipesNoIg:", recipesNoIg);
  });
  /*

  ipcRenderer.on("ingredientsSent", function (evt, ingredients) {
    let all_ingredients = ingredients;
    const recipeContainer = document.querySelector(".recipeIngredients");
    function getIngredient(id) {
      const markup = `
        <div class="recipe__ingredients">
          <h2 class="heading--2">Składniki</h2>
          <ul class="recipe__ingredient-list">
            <li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
              </svg>
              <div class="recipe__quantity">${all_ingredients[id].quantity}</div>
              <div class="recipe__description">
                <span class="recipe__unit">${all_ingredients[id].unit}</span>
                ${all_ingredients[id].name}
              </div>
            </li>
          </div>
            `;
      recipeContainer.innerHTML = "";
      recipeContainer.insertAdjacentHTML("afterbegin", markup);
    }
    getIngredient(0);
  });
  ipcRenderer.on("ingredientsSent", function (evt, ingredients) {
    let all_ingredients = ingredients;
    const recipeContainer = document.querySelector(".recipeIngredients");
    function getIngredient(id) {
      const markup = `
        <div class="recipe__ingredients">
          <h2 class="heading--2">Składniki</h2>
          <ul class="recipe__ingredient-list">
            <li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
              </svg>
              <div class="recipe__quantity">${all_ingredients[id].quantity}</div>
              <div class="recipe__description">
                <span class="recipe__unit">${all_ingredients[id].unit}</span>
                ${all_ingredients[id].name}
              </div>
            </li>
          </div>
            `;
      recipeContainer.innerHTML = "";
      recipeContainer.insertAdjacentHTML("afterbegin", markup);
    }
    for (let i = 1; i < 6; i++) {
      getIngredient(i);
    }
  });
  */

  // ipcRenderer.on("ingredientsSent", function (evt, ingredients) {
  //   let all_ingredients = ingredients;
  //   const recipeContainer = document.querySelector(".recipeIngredients");

  //   function getIngredients(recipeId) {
  //     const filteredIngredients = all_ingredients.filter(
  //       (ingredient) => ingredient.recipesId === recipeId
  //     );

  //     const markup = `
  //     <div class="recipe__ingredients">
  //       <h2 class="heading--2">Składniki</h2>
  //       <ul class="recipe__ingredient-list">
  //         ${filteredIngredients
  //           .map(
  //             (ingredient) => `
  //             <li class="recipe__ingredient">
  //               <svg class="recipe__icon">
  //                 <use href="${icons}#icon-check"></use>
  //               </svg>
  //               <div class="recipe__quantity">${ingredient.quantity}</div>
  //               <div class="recipe__description">
  //                 <span class="recipe__unit">${ingredient.unit}</span>
  //                 ${ingredient.name}
  //               </div>
  //             </li>
  //           `
  //           )
  //           .join("")}
  //       </ul>
  //     </div>`;

  //     recipeContainer.innerHTML = "";
  //     recipeContainer.insertAdjacentHTML("afterbegin", markup);
  //   }

  //   // Call the function with the desired recipeId
  //   getIngredients(1);

  //   function createButtons() {
  //     recipes.forEach((recipe) => {
  //       const button = document.createElement("button");

  //       button.textContent = recipe.name;
  //       previewContainer.appendChild(button);

  //       button.addEventListener("click", () => {
  //         getRecipe(`${recipe.id}`);
  //       });
  //     });
  //   }
  // });
});
