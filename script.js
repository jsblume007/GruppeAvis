function klikk() {
    const dropdownEl = document.querySelector(".dropdown-content");
    if (dropdownEl.style.display === "flex") {
        dropdownEl.style.display = "none";

    } else {
        dropdownEl.style.display = "flex";
        
    }

}