const btnReset = document.getElementById("btnReset");

btnReset.addEventListener("click", (e) => {
    e.preventDefault();
    $.get("https://wt.ops.labs.vu.nl/api22/9775c5a7/reset", data => {
        console.log(data.Success);
        alert(data.Success);
    });
});
