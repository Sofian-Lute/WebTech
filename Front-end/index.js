const BASE_URL = "http://localhost:3000/api/phones";

let activeId = 0;
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

let isAscendingBrand = true;
let isAscendingModel = true;
let isAscendingOs = true;
let isAscendingScreensize = true;

//Code for sorter, table is able to sort in two ways:
const ascending = (a, b) => (a > b ? 1 : -1);
const descending = (a, b) => (a > b ? -1 : 1);

// capitalize the input string
// https://www.w3schools.com/java/ref_string_touppercase.asp
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

$(document).ready(function () {
  //On start-up: refresh the tables and get data from API
  refreshProducts();
  fetchData();

  //Main buttons on the front: Submit and Reset data
  $("#btnSubmit").on("click", (e) => {
    e.preventDefault();
    saveNewPhone();
  });

  $("#btnReset").on("click", () => {
    $.ajax({
      url: `${BASE_URL}/reset`,
      type: "DELETE",
      success: function (result) {
        phones = [];
        refreshTable();
      },
    });
  });

  $("#btnDelete").on("click", () => {
    deletePhone();
  });
  $("#btnUpdate").on("click", () => {
    updatePhone();
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

  /**
   * REFRESH THE TABLES
   * found how to skip first row on:
   * https://stackoverflow.com/questions/370013/jquery-delete-all-table-rows-except-first
   */
  function refreshTable() {
    $("#table-phones tr:not(:first)").remove();
    phones.forEach((phone) => {
      const row = `<tr id="${phone.id}" class="phone-from-table"><td>${phone.brand}</td><td>${phone.model}</td><td>${phone.os}</td><td>${phone.screensize}</td><td><img src="${phone.image}" alt="${phone.brand} - ${phone.model}" class="phone-img-table"/></td></tr>`;
      $("#table-phones").append(row);
    });

    // When clicking on a row, set the active id equal to the clicked phone id is given
    // and the row itself is given a lightgray color
    $(".phone-from-table").each(function (i, phone) {
      $(`#${phone.id}`).on("click", () => {
        resetColor();
        activeId = phone.id;
        $(`#${phone.id} > td`).css("background-color", "lightgray");
        if (activeId) {
          const phone = phones.find((x) => x.id == activeId);
          if (phone) {
            $("#brand").val(phone.brand);
            $("#model").val(phone.model);
            $("#os").val(phone.os);
            $("#screensize").val(phone.screensize);
            $("#image").val(phone.image);
          }
        }
      });
    });
  }
  // set color of table to white
  function resetColor() {
    $(`#${activeId} > td`).css("background-color", "white");
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
    const screensize = Math.round($("#screensize").val());
    const image = $("#image").val();

    if (brand && model && os && screensize) {
      let phone = { brand, model, os, screensize, image };
      $.ajax({
        url: BASE_URL,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(phone),
        dataType: "json",
        success: function (data) {
          const ids = phones.map((x) => x.id).sort((a, b) => a - b); //Sort the phone id's
          phone.id = ids[ids.length - 1] + 1; //Set new phone's id to the highest id in the array + 1
          phones.push(phone);
          refreshTable();
          clearFields();
        },
      });
    } else {
      alert("One or more of your inputs were empty");
    }
  }

  // Get data from API and refresh the table with new content if there is new content
  // We capitalize the first letter using capitalize() so we can sort easier
  function fetchData() {
    phones = [];
    $.get(BASE_URL, (data) => {
      data.forEach((phone) => {
        phones.push({
          id: phone.id,
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
  // delete the phone with the active id
  function deletePhone() {
    if (activeId) {
      $.ajax({
        url: `${BASE_URL}/${activeId}`,
        type: "DELETE",
        success: function (result) {
          fetchData();
          activeId = 0;
        },
      });
    } else {
      alert("Please click on a row!");
    }
  }

  // update the phone with active id
  function updatePhone() {
    if (activeId) {
      const brand = capitalize($("#brand").val());
      const model = capitalize($("#model").val());
      const os = capitalize($("#os").val());
      const screensize = Math.round($("#screensize").val());
      const image = $("#image").val();
      let phone = { brand, model, os, screensize, image };
      $.ajax({
        url: `${BASE_URL}/${activeId}`,
        type: "PUT",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(phone),
        success: function (result) {
          fetchData();
          activeId = 0;
        },
      });
    } else {
      alert("Please click on a row!");
    }
  }

  // Clears the input fields
  const clearFields = () => {
    $("#brand").val("");
    $("#model").val("");
    $("#os").val("");
    $("#screensize").val("");
    $("#image").val("");
  };

  //SORTER of both tables
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
});
