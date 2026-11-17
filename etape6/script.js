"use strict";

let lignes = 0;
let total_points = 0;
let sort_ascending = true;

const persons = [
    { nom: "nom-1", prenom: "prenom-1", points: 5 },
    { nom: "nom-2", prenom: "prenom-2", points: 10 },
    { nom: "nom-3", prenom: "prenom-3", points: 15 }
];

init();

document.getElementById("form_container").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        doNewData();
    }
});

function init() {
    for (const person of persons) {
        doInsert(person.nom, person.prenom, person.points);
    }
}

function doInsert(nom, prenom, points) {
    lignes++;
    total_points += points;
    doInsertRowTable(lignes, nom, prenom, points);
    update_summary();
}

function doInsertRowTable(num, nom, prenom, points) {
    const table = document.getElementById("person_body");

    const row = document.createElement("tr");
    row.setAttribute("class", "row");

    const col1 = document.createElement("td");
    const col2 = document.createElement("td");
    const col3 = document.createElement("td");
    const col4 = document.createElement("td");
    const col5 = document.createElement("td");

    col1.innerText = num;
    col2.innerText = nom;
    col3.innerText = prenom;
    col4.innerText = points;

    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    col5.append(checkbox);

    col1.setAttribute("class", "col_number");
    col2.setAttribute("class", "col_text");
    col3.setAttribute("class", "col_text");
    col4.setAttribute("class", "col_number");
    col5.setAttribute("class", "col_chkbox");

    row.append(col1, col2, col3, col4, col5);
    table.append(row);
}

function consoleTableau() {
    console.log(persons);
}

function update_summary() {
    const element_lignes = document.getElementById("p1");
    const element_points = document.getElementById("p3");

    element_lignes.innerText = `${lignes} ligne(s)`;
    element_points.innerText = `Total point(s)= ${total_points}`;
}

function doNewData() {
    const elt_nom = document.getElementById("form_nom");
    const elt_prenom = document.getElementById("form_prenom");
    const elt_points = document.getElementById("form_points");

    const nom = elt_nom.value.trim();
    const prenom = elt_prenom.value.trim();
    const points = parseInt(elt_points.value);

    if (nom === "" || prenom === "" || Number.isNaN(points)) {
        alert("Formulaire incomplet !");
    } else {
        doInsert(nom, prenom, points);
        persons.push({ nom: nom, prenom: prenom, points: points });

        elt_nom.value = "";
        elt_prenom.value = "";
        elt_points.value = "";
    }
}

function deleteRow() {
    if (lignes === 0) {
        alert("Le tableau est vide !");
        return;
    }

    const table = document.getElementById("person_body");
    const checked = table.querySelectorAll(".col_chkbox input:checked");

    if (checked.length === 0) {
        alert("Sélectionnez au moins une ligne !");
        return;
    }

    if (!confirm("Voulez-vous supprimer les lignes sélectionnées ?")) {
        return;
    }

    const rows = Array.from(table.rows);

    for (let i = rows.length - 1; i >= 0; i--) {
        const checkbox = rows[i].querySelector(".col_chkbox input");
        if (checkbox.checked) {
            total_points -= parseInt(rows[i].cells[3].innerText);
            lignes--;
            rows[i].remove();
            persons.splice(i, 1);
        }
    }

    renumberRows();
    document.getElementById("select_all").checked = false;
    update_summary();
    alert("Suppression effectuée avec succès !");
}

function renumberRows() {
    const rows = document.getElementById("person_body").rows;
    for (let i = 0; i < rows.length; i++) {
        rows[i].cells[0].innerText = i + 1;
    }
}

function toggleAll() {
    const state = document.getElementById("select_all").checked;
    const checkboxes = document.querySelectorAll("#person_body .col_chkbox input");
    for (const checkbox of checkboxes) {
        checkbox.checked = state;
    }
}

function sortByPoints() {
    persons.sort(function (a, b) {
        return sort_ascending ? a.points - b.points : b.points - a.points;
    });

    sort_ascending = !sort_ascending;
    document.getElementById("btn_sort").innerText = sort_ascending ? "Trier par points ▲" : "Trier par points ▼";

    document.getElementById("person_body").innerHTML = "";
    document.getElementById("select_all").checked = false;
    lignes = 0;
    total_points = 0;
    init();
}