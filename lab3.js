import { task1, task2, task3, task4, task5 } from "./lab2.js";
import { randomUserMock, additionalUsers } from "./FE4U-Lab2-mock.js";

const users = task1(randomUserMock, additionalUsers);
const validatedUsers = task2(users).valid;


const grid = document.querySelector('.teachers-grid');
const slider = document.querySelector(".slider");

function createTeacherCard(teacher) {
    const template = document.getElementById('teacher-card-template');
    const card = template.content.cloneNode(true);
    const cardEl = card.querySelector(".teather-card");

    card.querySelector(".teacher-photo").alt = `${teacher.full_name} photo`;
    card.querySelector('.name').innerHTML = teacher.full_name.replace(" ", "<br>");
    card.querySelector('.subj').textContent = teacher.course;
    card.querySelector('.country').textContent = teacher.country;

    const star = card.querySelector(".star");
    star.style.display = teacher.favorite ? "block" : "none";

    cardEl.onclick = () => showTeacherDialog(teacher, star);
    return card;
}

function addTeachersToList(teachers) {
    grid.innerHTML = "";
    teachers.forEach(t => {
        grid.appendChild(createTeacherCard(t));
    });
}

//========Favorites=========
function createFavoriteCard(teacher) {
    const template = document.getElementById("favorite-card-template");
    const card = template.content.cloneNode(true);

    card.querySelector(".teacher-photo").alt = `${teacher.full_name} photo`;
    card.querySelector(".name").textContent = teacher.full_name;
    card.querySelector(".country").textContent = teacher.country;

    return card;
}

function updateSlider() {
    slider.innerHTML = "";
    validatedUsers.filter(u => u.favorite).forEach(u => {
        slider.appendChild(createFavoriteCard(u));
    });
}

function showTeacherDialog(teacher, star) {
    const dialog = document.getElementById('teacher-info-dialog');

    dialog.querySelector(".short-info img").src = "teachers photo/ind.png";
    dialog.querySelector(".short-info img").alt = `${teacher.full_name} photo`;
    dialog.querySelector(".name-star h2:first-child").textContent = teacher.full_name;
    dialog.querySelector("#sub b").textContent = teacher.course;
    dialog.querySelector(".location").textContent = `${teacher.country}, ${teacher.city}`;
    dialog.querySelector(".age-sex").textContent = `${teacher.age}, ${teacher.gender}`;
    dialog.querySelector(".mail a").href = `mailto:${teacher.email}`;
    dialog.querySelector(".mail a").textContent = teacher.email;
    dialog.querySelector(".num").textContent = teacher.phone;
    dialog.querySelector(".dialog-footer").textContent = teacher.note;


    const favEl = dialog.querySelector("#fav");
    favEl.textContent = teacher.favorite ? "★" : "☆";

    favEl.onclick = () => {
        teacher.favorite = !teacher.favorite;
        favEl.textContent = teacher.favorite ? "★" : "☆";
        star.style.display = teacher.favorite ? "block" : "none";
        updateSlider();
    }

    dialog.showModal();
}

// ========== Filters ==========

function getFilters() {
    const selects = document.querySelectorAll(".filter-select");
    const checkboxes = document.querySelectorAll(".filter-checkbox");

    let filters = {};

    const ageVal = selects[0].value;
    if (ageVal === "18-31") filters.age = [18, 31];
    if (ageVal === "32-45") filters.age = [32, 45];
    if (ageVal === "46-60") filters.age = [46, 60];
    if (ageVal === "60+") filters.age = [60, 200];

    const countryVal = selects[1].value;
    filters.country = countryVal;

    const genderVal = selects[2].value;
    filters.gender = genderVal;

    const onlyWithPhoto = checkboxes[0].checked;
    if (!onlyWithPhoto) filters.picture_large = undefined;

    const onlyFavorites = document.getElementById("filter-favorites").checked;
    if (onlyFavorites) filters.favorite = true;

    return filters;
}

function applyFilters() {
    const filters = getFilters();
    const filtered = task3(validatedUsers, filters);
    addTeachersToList(filtered);
}

const filtersEls = document.querySelectorAll(".filter-select, .filter-checkbox");
filtersEls.forEach(el => {
    el.onchange = applyFilters;
});

//========== Statistics ============

function buildStatisticsTable(teachers) {
    const tbody = document.querySelector(".stat-table tbody");
    tbody.innerHTML = "";

    teachers.forEach(t => {
        const row = document.createElement("tr");
        row.innerHTML = `
                <td>${t.full_name}</td>
                <td>${t.course || "–"}</td>
                <td>${t.age || "–"}</td>
                <td>${t.gender || "–"}</td>
                <td>${t.country || "–"}</td>
            `;
        tbody.appendChild(row);
    });
}

const headers = document.querySelectorAll(".stat-table th");
let currentSort = { field: null, order: "abc" };

headers.forEach((th, index) => {
    th.onclick = () => {
        let field;
        switch (index) {
            case 0: field = "full_name"; break;
            case 1: field = "course"; break;
            case 2: field = "age"; break;
            case 3: field = "gender"; break;
            case 4: field = "country"; break;
            default: return;
        }

        if (currentSort.field === field) {
            currentSort.order = currentSort.order === "abc" ? "cba" : "abc";
        } else {
            currentSort.field = field;
            currentSort.order = "abc";
        }

        const sorted = task4(validatedUsers, field, currentSort.order);
        buildStatisticsTable(sorted);
    };
});

//========= Search =========
const searchInput = document.querySelector(".search-field");
const searchButton = document.querySelector(".search-button");

function applySearch() {
    const query = searchInput.value.trim();
    if (!query) {
        addTeachersToList(validatedUsers);
        return;
    }

    const results = task5(validatedUsers, query);
    addTeachersToList(results);
}


searchButton.onclick = applySearch;

searchInput.onkeydown = function (e) {
    if (e.key === "Enter") {
        applySearch();
    }
};

// ======== Ащкь ==========

const addTeacherDialog = document.getElementById("add-teacher");
const addTeacherForm = addTeacherDialog.querySelector("form");

addTeacherForm.onsubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(addTeacherForm);

    const newTeacher = {
        full_name: formData.get("name"),
        course: formData.get("course"),
        country: formData.get("country"),
        city: formData.get("city"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        b_day: formData.get("date"),
        age: formData.get("date") ? getAgeFromDate(formData.get("date")) : null,
        gender: formData.get("sex"),
        bg_color: formData.get("color") || "#ffffff",
        note: formData.get("note") || null,
        favorite: false
    };

    const result = task2([newTeacher]);
    if (result.invalid.length > 0) {
        const reasons = result.invalid[0].reasons;
        alert("Failed to add teacher:\n" + reasons.join("\n"));
    } else {

        validatedUsers.push(result.valid[0]);
        addTeachersToList(validatedUsers);
        updateSlider();

        addTeacherDialog.close();
        addTeacherForm.reset();
    }
};


function getAgeFromDate(birthDateStr) {
    const today = new Date();
    const birthDate = new Date(birthDateStr);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

buildStatisticsTable(validatedUsers);

addTeachersToList(validatedUsers);
updateSlider();






