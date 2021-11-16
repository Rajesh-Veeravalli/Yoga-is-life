const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const phone = document.getElementById("phone");
const batch = document.getElementById("batch");
const age = document.getElementById("age");
const paid = document.getElementById("paid");
const errorFirstName = document.getElementById("errorFirstName");
const errorLastName = document.getElementById("errorLastName");
const errorPhone = document.getElementById("errorPhone");
const errorAge = document.getElementById("errorAge");
const usersTableBody = document.getElementById("usersTableBody");
const homeRoute = document.getElementById("homeRoute");
const registerRoute = document.getElementById("registerRoute");
const homeLink = document.getElementById("homeLink");
const newRegistrationLink = document.getElementById("newRegistrationLink");

const resetToDefaultForm = () => {
  firstName.value = "";
  lastName.value = "";
  age.value = "";
  phone.value = "";
  batch.value = 6;
  paid.checked = false;
};

const screens = [
  { route: "home", division: homeRoute },
  { route: "register", division: registerRoute },
];

const links = [
  { route: "home", anchor: homeLink },
  { route: "register", anchor: newRegistrationLink },
];

const displayScreen = (r) => {
  screens.forEach(({ route, division }) => {
    if (r === route) {
      division.classList.remove("d-none");
    } else {
      division.classList.add("d-none");
    }
  });
};

links.forEach(({ route, anchor }) => {
  anchor.addEventListener("click", () => displayScreen(route));
});

displayScreen("home");

firstName.addEventListener("change", () => {
  errorFirstName.textContent = "";
});

lastName.addEventListener("change", () => {
  errorLastName.textContent = "";
});

phone.addEventListener("change", () => {
  errorPhone.textContent = "";
});

age.addEventListener("change", () => {
  errorAge.textContent = "";
});

function formValidation() {
  let isValid = true;

  if (firstName.value === "") {
    errorFirstName.textContent = "required";
    isValid = false;
  }

  if (lastName.value === "") {
    console.log(lastName.value);
    errorLastName.textContent = "required";
    isValid = false;
  }

  if (age.value === "") {
    errorAge.textContent = "required";
    isValid = false;
  } else if (parseInt(age.value) > 65 || parseInt(age.value) < 18) {
    errorAge.textContent = "Age should be between 18 to 65";
    isValid = false;
  }

  if (phone.value === "") {
    errorPhone.textContent = "required";
    isValid = false;
  } else if (/^\d{10}$/.test(phone.value) !== true) {
    errorPhone.textContent = "Invalid Phone Number";
    isValid = false;
  }

  return isValid;
}

const submit = document.getElementById("submit");

const loadUsersTable = () => {
  usersTableBody.textContent = "";

  fetch("/users")
    .then((resp) => resp.json())
    .then((data) => {
      console.log("data", data);
      data.forEach((user, index) => {
        const tableRow = document.createElement("tr");
        const snoCol = document.createElement("td");
        snoCol.textContent = index + 1;
        const nameCol = document.createElement("td");
        nameCol.textContent = user.firstName + " " + user.lastName;
        const phoneCol = document.createElement("td");
        phoneCol.textContent = user.phone;
        const batchCol = document.createElement("td");
        const batches = {
          6: "6AM - 7AM",
          7: "7AM - 8AM",
          8: "8AM - 9AM",
          5: "5PM - 6PM",
        };
        batchCol.textContent = batches[user.batch];
        const paymentCol = document.createElement("td");
        const button = document.createElement("button");
        button.classList.add("btn", "btn-primary");
        button.addEventListener("click", () => {
          fetch("/pay", {
            method: "POST",
            body: JSON.stringify(user.id),
          })
            .then((resp) => {
              if (resp.ok) {
                loadUsersTable();
              }
            })
            .catch((err) => alert("Unable to complete payment request"));
        });
        button.textContent = "Pay Now";
        if (user.paidStatus) {
          paymentCol.textContent = "PAID";
        } else {
          paymentCol.appendChild(button);
        }
        [snoCol, nameCol, phoneCol, batchCol, paymentCol].forEach((ele) =>
          tableRow.appendChild(ele)
        );
        usersTableBody.appendChild(tableRow);
      });
    })
    .catch((err) => console.log("error", err));
};

submit.addEventListener("click", (event) => {
  const success = formValidation();
  console.log({
    firstName: firstName.value,
    lastName: lastName.value,
    phone: phone.value,
    age: age.value,
    batch: batch.value,
    paidStatus: paid.checked,
  });
  if (success) {
    fetch("/", {
      method: "POST",
      body: JSON.stringify({
        firstName: firstName.value,
        lastName: lastName.value,
        phone: phone.value,
        age: age.value,
        batch: batch.value,
        paidStatus: paid.checked,
      }),
    })
      .then((resp) => {
        if (resp.ok) {
          resetToDefaultForm();
          alert("registration success");
          displayScreen("home");
          loadUsersTable();
        }
      })
      .catch(() => alert("registration failed"));
  }
  event.preventDefault();
});
loadUsersTable();
