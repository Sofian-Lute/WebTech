const BASE_URL = "https://wt.ops.labs.vu.nl/api22/ca8317f0";

let phones = [];
let products = [
  {
    type: "Charger",
    product: "Original OnePlus USB C charger",
    price: 8,
  },
  {
    type: "Case",
    product: "Iphone X Black case",
    price: 24.69,
  },
  {
    type: "Protector",
    product: "Sapphire for screen",
    price: 14.25,
  },
];

//On start-up: refresh the tables and get data from API
refreshProducts();
fetchData();

//Main buttons on the front: Submit and Reset data
$("#btnSubmit").on("click", (e) => {
  e.preventDefault();
  saveNewPhone();
  clearFields();
});

$("#btnReset").on("click", () => {
  $.get(`${BASE_URL}/reset`, () => {
    phones = [];
    fetchData();
  });
});

//Click-listeners for main table (phones table)
$("#btnBrand").on("click", () => sortTable("brand"));
$("#btnModel").on("click", () => sortTable("model"));
$("#btnOs").on("click", () => sortTable("os"));
$("#btnScreensize").on("click", () => sortTable("screensize"));
$("#btnImage").on("click", () => sortTable("image"));

//Click-listeners for second table (product table)
$("#btnType").on("click", () => sortTable("type", true));
$("#btnProduct").on("click", () => sortTable("product", true));
$("#btnPrice").on("click", () => sortTable("price", true));

//SORTER of both tables
let isAscendingBrand = true;
let isAscendingModel = true;
let isAscendingOs = true;
let isAscendingScreensize = true;
/**
 * @parameter (type) is for getting the clicked button type
 * @parameter (isProduct) is for the second table to determine which table is begin sorted
 * isAscending... to adjust between ascending and descending
 */
function sortTable(type, isProduct = false) {
  switch (type) {
    case "brand":
      phones.sort((a, b) =>
        isAscendingBrand
          ? ascending(a.brand, b.brand)
          : descending(a.brand, b.brand)
      );
      isAscendingBrand = !isAscendingBrand;
      break;
    case "model":
      phones.sort((a, b) =>
        isAscendingModel
          ? ascending(a.model, b.model)
          : descending(a.model, b.model)
      );
      isAscendingModel = !isAscendingModel;
      break;
    case "os":
      phones.sort((a, b) =>
        isAscendingOs ? ascending(a.os, b.os) : descending(a.os, b.os)
      );
      isAscendingOs = !isAscendingOs;
      break;
    case "screensize":
      phones.sort((a, b) =>
        isAscendingScreensize
          ? ascending(a.screensize, b.screensize)
          : descending(a.screensize, b.screensize)
      );
      isAscendingScreensize = !isAscendingScreensize;
      break;
    case "type":
      products.sort((a, b) => ascending(a.type, b.type));
      break;
    case "product":
      products.sort((a, b) => ascending(a.product, b.product));
      break;
    case "price":
      products.sort((a, b) => ascending(a.price, b.price));
      break;
    default:
      phones.sort((a, b) => ascending(a.brand, b.brand));
      products.sort((a, b) => ascending(a.type, b.type));
      break;
  }
  if (!isProduct) refreshTable();
  else refreshProducts();
}

const ascending = (a, b) => (a > b ? 1 : -1);
const descending = (a, b) => (a > b ? -1 : 1);

/**
 * REFRESH THE TABLES
 * found how to skip first row on:
 * https://stackoverflow.com/questions/370013/jquery-delete-all-table-rows-except-first
 */
function refreshTable() {
  $("#table-phones tr:not(:first)").remove();
  phones.forEach((phone) => {
    const row = `<tr><td>${phone.brand}</td><td>${phone.model}</td><td>${phone.os}</td><td>${phone.screensize}</td><td><img src="${phone.image}" class="phone-img-table"/></td></tr>`;
    $("#table-phones").append(row);
  });
}

function refreshProducts() {
  $("#table-products tr:not(:first)").remove();
  products.forEach((product) => {
    const row = `<tr><td>${product.type}</td><td>${product.product}</td><td>${product.price}</td></tr>`;
    $("#table-products").append(row);
  });
}

//Save new data, push to API and refresh the table(add to table)
function saveNewPhone() {
  const brand = capitalize($("#brand").val());
  const model = capitalize($("#model").val());
  const os = capitalize($("#os").val());
  const screensize = parseFloat($("#screensize").val());
  const image = $("#image").val();

  const phone = { brand, model, os, screensize, image };

  $.post(BASE_URL, phone, () => {
    phones.push(phone);
    refreshTable();
  });
}

// Get data from API and refresh the table with new content if there is new content
// We capitalize the first letter using capitalize() so we can sort easier
function fetchData() {
  $.get(BASE_URL, (data) => {
    data.forEach((phone) => {
      phones.push({
        brand: capitalize(phone.brand),
        model: capitalize(phone.model),
        os: capitalize(phone.os),
        screensize: phone.screensize,
        image: phone.image,
      });
    });
    refreshTable();
  });
}

// capitalize the input string
// https://www.w3schools.com/java/ref_string_touppercase.asp
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Clears the input fields
const clearFields = () => {
  $("#brand").val("");
  $("#model").val("");
  $("#os").val("");
  $("#screensize").val("");
  $("#image").val("");
};
