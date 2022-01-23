const BASE_URL = "https://wt.ops.labs.vu.nl/api22/ca8317f0";

let phones = [];
fetchData();

$("#btnSubmit").on("click", (e) => {
    e.preventDefault();
    saveNewPhone();
  });

function refreshTable(){
    $("#table-phones tr:not(:first)").remove();
    console.log(phones.length);
    phones.forEach(phone => {
        const row = `<tr><td>${phone.brand}</td><td>${phone.model}</td><td>${phone.os}</td><td>${phone.screensize}</td><td><img src="${phone.image}" class="phone-img-table"/></td></tr>`;
        $("#table-phones").append(row);
    });
}

function saveNewPhone(){
    const brand = $("#brand").val();
    const model = $("#model").val();
    const os = $("#os").val();
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