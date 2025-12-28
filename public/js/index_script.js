  let taxSwitch = document.getElementById("switchCheckDefault");

  taxSwitch.addEventListener("click", () => {
    let tax_info = document.getElementsByClassName("tax-info");

    for (let info of tax_info) {
      if (info.style.display !== "inline") {
        info.style.display = "inline";
      } else {
        info.style.display = "none";
      }
    }
  });