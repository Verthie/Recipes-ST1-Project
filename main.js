const { app, BrowserWindow, ipcMain } = require("electron");

var knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./database.sqlite",
  },
});

const path = require("path");

// modify your existing createWindow() function
const createWindow = () => {
  const win = new BrowserWindow({
    width: 1254,
    height: 954,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "src/js/renderer.js"),
      // preload: path.join(__dirname, "src/js/preload.js"),
    },
  });

  win.loadFile("index.html");
  win.once("ready-to-show", () => {
    win.show();
  });

  ipcMain.on("mainWindowLoaded", function () {
    let allrecipes = knex
      .select("*")
      .from("recipes")
      .where("recipes.bookmarked", 1);
    allrecipes.then(function (rows) {
      win.webContents.send("allBookmarkRecipesSent", rows);
    });
  });
  ipcMain.on("detailsRecipe", function (event, recipeLoadId) {
    let recipeWithIg = knex
      .select("*")
      .from("recipes", "ingredient")
      .innerJoin("ingredient", "recipes.id", "=", "ingredient.recipesId")
      .where("recipes.id", recipeLoadId);
    recipeWithIg.then(function (rows) {
      win.webContents.send("recipeWithIgSent", rows);
    });
  });
  ipcMain.on("leftBarRecipes", function (event, recipesLoadTitle) {
    let recipesNoIg = knex
      .select("*")
      .from("recipes")
      .where("recipes.title", "like", `%${recipesLoadTitle}%`);
    recipesNoIg.then(function (rows) {
      win.webContents.send("recipesNoIgSent", rows);
    });
  });
  ipcMain.on("bookmarkRecipe", function (event, recipeLoadId) {
    let recipes = knex.select("*").from("recipes").where("id", recipeLoadId);
    recipes.then(function (rows) {
      console.log("bez sensu:", rows);
      let [przepisy] = rows;
      console.log("przepisy:", przepisy);
      if (przepisy.bookmarked === 0) {
        knex("recipes")
          .where("recipes.id", recipeLoadId)
          .update({ bookmarked: 1 });
      } else {
        knex("recipes")
          .where("recipes.id", recipeLoadId)
          .update({ bookmarked: 0 });
      }
    });
  });
};

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
