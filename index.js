const BASE_URL = "https://wt.ops.labs.vu.nl/api22/ca8317f0";

let phones = [];
fetchData();

$("#btnSubmit").on("click", (e) => {
    e.preventDefault();
    saveNewPhone();
    clearFields();
});
$("#btnReset").on("click", (e) => {
    $.get(`${BASE_URL}/reset`, () =>{
        phones = [];
        fetchData();
    })
});

$("#btnBrand").on("click", () => sortTable("brand"));
$("#btnModel").on("click", () => sortTable("model"));
$("#btnOs").on("click", () => sortTable("os"));
$("#btnScreensize").on("click", () => sortTable("screensize"));
$("#btnImage").on("click", () => sortTable("image"));

function sortTable(type){
    switch(type){
        case "brand":
            phones.sort((a, b) => ascending(a.brand, b.brand));
            break;
        case "model":
            phones.sort((a, b) => ascending(a.model, b.model));
            break;
        case "os":
            phones.sort((a, b) => ascending(a.os, b.os));
            break;
        case "screensize": 
            phones.sort((a, b) => ascending(a.screensize, b.screensize));
            break;
        default:
            phones.sort((a, b) => ascending(a.brand, b.brand));
            break;
    }
    refreshTable();
}

function ascending(a, b){
    return a > b ? 1 : -1;
}

function refreshTable(){
    $("#table-phones tr:not(:first)").remove();
    phones.forEach(phone => {
        const row = `<tr><td>${phone.brand}</td><td>${phone.model}</td><td>${phone.os}</td><td>${phone.screensize}</td><td><img src="${phone.image}" class="phone-img-table"/></td></tr>`;
        $("#table-phones").append(row);
    });
}

function saveNewPhone(){
    const brand = capitalize($("#brand").val());
    const model = capitalize($("#model").val());
    const os = capitalize($("#os").val());
    const screensize = parseFloat($("#screensize").val());
    const image = $("#image").val();

    const phone = {brand, model, os, screensize, image};

    $.post(BASE_URL, phone, data => {
        phones.push(phone)
        refreshTable();
    });
}

function fetchData(){
    $.get(BASE_URL, (data) => {
        data.forEach(phone => {
            phones.push(phone);
        });
        refreshTable();
    });
}
// capitalize the input string
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Clears the input fields
const clearFields = () => {
  $("#brand").val("");
  $("#model").val("");
  $("#os").val("");
  $("#screensize").val("");
  $("#image").val("");
};