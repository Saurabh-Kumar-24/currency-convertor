

const BASE_URL = "https://v6.exchangerate-api.com/v6/bff0cd6672d3b7b218d0468f/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

const populateDropdowns = () => {
  for (let select of dropdowns) {
    for (let currCode in countryList) {
      let newOption = document.createElement("option");
      newOption.innerText = currCode;
      newOption.value = currCode;
      if (select.name === "from" && currCode === "USD") {
        newOption.selected = "selected";
      } else if (select.name === "to" && currCode === "INR") {
        newOption.selected = "selected";
      }
      select.append(newOption);
    }
    select.addEventListener("change", (evt) => updateFlag(evt.target));
  }
};

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount-input");
  let amtVal = amount.value || 1;
  amount.value = amtVal;

  const URL = `${BASE_URL}/${fromCurr.value}`;
  msg.innerText = "Fetching latest rates...";
  msg.classList.add("loading");

  try {
    let response = await fetch(URL);
    if (!response.ok) throw new Error("Failed to fetch data");
    
    let data = await response.json();
    let rate = data.conversion_rates[toCurr.value];

    if (!rate) throw new Error("Rate not found for selected currency");

    let finalAmount = (amtVal * rate).toFixed(2);
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    msg.classList.remove("loading");
  } catch (error) {
    console.error("Error:", error);
    msg.innerText = "Error fetching exchange rate. Try again.";
    msg.classList.add("loading");
  }
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

const init = () => {
  populateDropdowns();
  updateExchangeRate();
  btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
  });
};

window.addEventListener("load", init);
