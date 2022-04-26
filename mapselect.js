function setMapPL() {
    var selectedMap = "pl";
    sessionStorage.setItem("selectedMap", selectedMap);
    document.getElementById("btn_start").classList.remove("disabled");
    buttonSelected();
}

function setMapTR() {
    var selectedMap = "tr";
    sessionStorage.setItem("selectedMap", selectedMap);
    document.getElementById("btn_start").classList.remove("disabled");
    buttonSelected();
}

function setMapCZ() {
    var selectedMap = "cz";
    sessionStorage.setItem("selectedMap", selectedMap);
    document.getElementById("btn_start").classList.remove("disabled");
    buttonSelected();
}

function buttonSelected() {
    var selectedMapButtonName = sessionStorage.getItem("selectedMap");

    if (selectedMapButtonName == "pl") {
    document.getElementById("btn_pl").style.backgroundColor = "#fa3a45";
    document.getElementById("btn_pl").style.color = "#ffffff";
    } else {
    document.getElementById("btn_pl").style.backgroundColor = "#ffffff";
    document.getElementById("btn_pl").style.color = "#000000";
    }
    if (selectedMapButtonName == "tr") {
        document.getElementById("btn_tr").style.backgroundColor = "#fa3a45";
        document.getElementById("btn_tr").style.color = "#ffffff";
    } else {
        document.getElementById("btn_tr").style.backgroundColor = "#ffffff";
        document.getElementById("btn_tr").style.color = "#000000";
    }

    if (selectedMapButtonName == "cz") {
        document.getElementById("btn_cz").style.backgroundColor = "#fa3a45";
        document.getElementById("btn_cz").style.color = "#ffffff";
    } else {
        document.getElementById("btn_cz").style.backgroundColor = "#ffffff";
        document.getElementById("btn_cz").style.color = "#000000";
    }
    
}