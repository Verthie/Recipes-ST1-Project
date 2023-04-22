"use strict";

import data from "../../data.json";

async function getRecipies() {
  try {
    const res = await fetch(data);

    console.log(res, data);
  } catch (error) {
    console.log(error);
  }
}

getRecipies();
