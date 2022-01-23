const BASE_URL = "https://wt.ops.labs.vu.nl/api22/ca8317f0";

let phones = [];

$("#btnSubmit").on("click", (e)=> {
    e.preventDefault();
    saveNewPhone();
});

function saveNewPhone(){
    const brand = $("#btnBrand").val();
    const model = $("#btnModel").val();
    const os = $("#btnOs").val();
    const screensize = $("#btnScreensize").val();
    const image = $("#btnImage").va();

    const phone = {brand, model, os, screensize, image};

    $.post(BASE_URL, phone, data => {
        console.log(data);
    });
}

function fetchData(){
    $.get(BASE_URL, (data) => {
        console.log(data);
    })
}