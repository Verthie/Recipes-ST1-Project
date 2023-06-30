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
    width: 1200,
    height: 800,
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
    let recipe = knex
      .select("id", "title", "cooking_time", "serving_size", "image_url")
      .from("recipes");
    recipe.then(function (rows) {
      win.webContents.send("recipeSent", rows);
    });
    let ingredients = knex
      .select("id", "name", "quantity", "unit")
      .from("ingredient");
    ingredients.then(function (rows) {
      win.webContents.send("ingredientsSent", rows);
    });
    let ingredientsInRecipe = knex
      .select("recipesId", "ingredientId")
      .from("recipes-ingredients");
    ingredientsInRecipe.then(function (rows) {
      win.webContents.send("ingredientsInRecipeSent", rows);
    });
  });
};

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
