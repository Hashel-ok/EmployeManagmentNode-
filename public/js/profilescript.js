
//................ACCESING THE ID FROM MAIN PAGE..................

const url = new URLSearchParams(document.location.search);
const id = url.get("id");
console.log("id is:", id);


let avatarchanged=false;
const fullname = document.getElementById("fullname");
const prfl_email = document.getElementById("prfl_email");
const prfl_gender = document.getElementById("prfl_gender");
const prfl_age = document.getElementById("prfl_age");
const prfl_dob = document.getElementById("prfl_dob");
const prfl_mob = document.getElementById("prfl_mob");
const prfl_qualification = document.getElementById("prfl_qualification");
const prfl_address = document.getElementById("prfl_address");
const prfl_username = document.getElementById("prfl_username");
const prfl_img = document.getElementById("prfl_img");


const edit_select = document.getElementById("edit_Select");
const edit_fname = document.getElementById("edit_fname");
const edit_lname = document.getElementById("edit_lname");
const edit_mobno = document.getElementById("edit_mobno");
const edit_email = document.getElementById("edit_email");
const edit_dateofbirth = document.getElementById("edit_dateofbirth");
const edit_maleradio = document.getElementById("edit_inlineRadio1");
const edit_femaleradio = document.getElementById("edit_inlineRadio2");
const edit_address = document.getElementById("edit_address");
const edit_country = document.getElementById("edit_country");
const edit_state = document.getElementById("edit_state");
const edit_city = document.getElementById("edit_city");
const edit_pincode = document.getElementById("edit_pincode");
const edit_image = document.getElementById("edit_image");
const edit_username = document.getElementById("edit_username");
const edit_password = document.getElementById("edit_password");
const edit_qualification = document.getElementById("edit_qualification");
const save_btn = document.getElementById("save-btn");
const change_btn = document.getElementsByClassName("change_btn");
const edit_upload = document.getElementById("edit_upload");
const edt_image = document.getElementById("edit_image");
const edit_EmployeForm = document.getElementsByClassName("edit_Employe_Form");
const errorMsg = document.getElementsByClassName("error_msg");


//.........FUNCTION FOR VIEWING THE DATAS OF EMPLOYESS...........

viewprofile(id);

async function viewprofile(id) {
  console.log(id);

  try {
    const response = await fetch(`http://localhost:5001/employees/${id}`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Error while recieving the id${response.status}`);
    }
    const data = await response.json();

    console.log(data);
  

    const dob = data.dob;

    let [day, month, year] = dob.split("-");  // SPLITING THE DATE FOR EMPLOYEE AGE CALCULATION...
    const newdob = `${year}-${month}-${day}`;


    prfl_img.src = `http://localhost:5001/images/${id}.png`;
    fullname.textContent =
      data.salutation + " " + data.firstname + " " + data.lastname;
    prfl_email.textContent = data.email;
    prfl_gender.textContent = data.gender;
    prfl_dob.textContent = data.dob;
    prfl_mob.textContent = data.phone;
    prfl_qualification.textContent = data.qualifications;
    prfl_address.textContent = data.address;
    prfl_username.textContent = data.username;
    prfl_age.textContent = calculateAge(newdob);
  } catch (error) {
    console.log("error " + error);
  }
}

// AGE CALCULATION FUNCTION

function calculateAge(dateOfBirth) {
  var today = new Date();
  var birthDate = new Date(dateOfBirth);
  var age = today.getFullYear() - birthDate.getFullYear();
  var monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}


//............EDIT EMPLOYEEE............

const overlay = document.querySelector(".overlay");
const edit_Employe_Form = document.querySelector(".edit_Employe_Form");
const prfl_editdetails = document.querySelector("#prfl_editdetails");
const edit_Employ_close_btn = document.querySelector(".edit_Employ_close_btn");
const edit_Employ_cancel_btn = document.querySelector( ".edit_Employ_cancel_btn");


//FUNCTION TO DISPLAY EDIT EMPLOYEE FORM

const edit_employe_open = function () {
  edit_Employe_Form.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

prfl_editdetails.addEventListener("click", (e) => {
  edit_employe_open(), editemployeeform(id);
});

//PREVIEWING THE IMAGE WHILE UPLOADING

edit_upload.onchange = function () {
  avatarchanged=true;
  edit_image.src = URL.createObjectURL(edit_upload.files[0]);
};


// VIEWING IN EDIT EMPLOYEE FORM

async function editemployeeform(id) {
  try {
    const response = await fetch(`http://localhost:5001/employees/${id}`);

    if (!response.ok) {
      throw new Error(`edit form not possible${response.status}`);
    }

    const data = await response.json();

    console.log(data);

    edit_select.value = data.salutation;
    edit_fname.value = data.firstname;
    edit_lname.value = data.lastname;
    edit_dateofbirth.value = editdob(data.dob);
    gender(data.gender);
    edit_username.value = data.username;
    edit_password.value = data.password;
    edit_qualification.value = data.qualifications;
    edit_mobno.value = data.phone;
    edit_email.value = data.email;
    edit_address.value = data.address;
    edit_country.value = data.country;
    edit_state.value = data.state;
    edit_city.value = data.city;
    edit_pincode.value = data.pincode;

    edit_image.src = `http://localhost:5001/images/${id}.png`;

    save_btn.addEventListener("click", (e) => {
      editvalidation();
      editemplychange(id);
      
    });
  } catch (error) {
    console.log(`response error ${error}`);
  }
}

function editdob(data) {
  let [day, month, year] = data.split("-");

  const db = year + "-" + month + "-" + day;

  return db;
}

function gender(data) {
  if (data === "Male") {
    edit_maleradio.checked = true;
  } else {
    edit_femaleradio.checked = true;
  }
}

//CHANGES HAPPENED IN EDIT EMPLOYEE FORM

async function editemplychange(id) {
  let newemply = {
    salutation: edit_select.value,
    firstname: edit_fname.value,
    lastname: edit_lname.value,
    email: edit_email.value,
    phone: edit_mobno.value,
    dob: dob(edit_dateofbirth.value),
    gender: edit_maleradio.checked == true ? "Male" : "Female",
    qualifications: edit_qualification.value,
    address: edit_address.value,
    city: edit_city.value,
    state: edit_state.value,
    country: edit_country.value,
    username: edit_username.value,
    password: edit_password.value,
    pincode: edit_pincode.value,
  };

  try {
    const response = await fetch(`http://localhost:5001/employees/${id}`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(newemply),
    });

    if (!response.ok) {
      throw new Error(
        `error while posting ${
          response.status
        },Message: ${await response.text()}`
      );
    }
    if(avatarchanged===true){

      const formdata = new FormData();

      formdata.append("avatar", edit_upload.files[0]);
  
      fetch(`http://localhost:5001/employees/${id}/avatar`, {
        method: "POST",
        body: formdata,
      });

    }

  window.location.href='http://localhost:5001/employees/dashboard';

  } catch (error) {
    console.log("Error in posting " + error);
  }
}

function dob(data) {
  let [year, month, day] = data.split("-");

  return day + "-" + month + "-" + year;
}

//....................EDIT VALIDATION................

function editvalidation()

{
  const validateInput = (input, serial, msg) => {
    if (input.value.trim() === "") {
      errorMsg[serial].innerHTML = msg;
    } else {
      errorMsg[serial].innerHTML = "";
    }
  };

  const validatePhoneno = (input, serial, msg) => {
    let mobnovalue = input.value.trim();

    if (mobnovalue === "") {
      errorMsg[serial].innerHTML = msg;
    } else if (mobnovalue.length != 10) {
      errorMsg[serial].innerHTML = "Invalid phone no";
    } else {
      errorMsg[serial].innerHTML = "";
    }
  };

  const validateEmail = (input, serial, msg) => {
    let emailvalue = input.value.trim();
    let emailregex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (emailvalue === "") {
      errorMsg[serial].innerHTML = msg;
    } else if (!emailvalue.match(emailregex)) {
      errorMsg[serial].innerHTML = "Invalid Email";
    } else {
      errorMsg[serial].innerHTML = "";
    }
  };

  validateInput(edit_fname, 0, "Please enter first Name");
  validateInput(edit_lname, 1, "Please enter last Name");
  validateEmail(edit_email, 2, "Please enter email");
  validatePhoneno(edit_mobno, 3, "Please enter phone no");
  validateInput(edit_username, 6, "Please enter username");
  validateInput(edit_password, 7, "Please enter password");
  validateInput(edit_qualification, 8, "Please enter qualifications");
  validateInput(edit_address, 9, "Please enter address");
  validateInput(edit_city, 12, "please enter city");
  validateInput(edit_pincode, 13, "please enter pincode");


  edit_fname.addEventListener("input", () => remove_validation_error(0));
  edit_lname.addEventListener("input", () => remove_validation_error(1));
  edit_email.addEventListener("input", () => remove_validation_error(2));
  edit_mobno.addEventListener("input", () => remove_validation_error(3));
  edit_username.addEventListener("input", () => remove_validation_error(6));
  edit_password.addEventListener("input", () => remove_validation_error(7));
  edit_qualification.addEventListener("input", () =>remove_validation_error(8));
  edit_address.addEventListener("input", () => remove_validation_error(9));
  edit_city.addEventListener("input", () => remove_validation_error(12));
  edit_pincode.addEventListener("input", () => remove_validation_error(13));

  function remove_validation_error(serial) {
    errorMsg[serial].innerHTML = "";
  }

}

//FUNCTION TO HIDE THE EDIT EMPLOYEE FORM

const edit_employe_close = function () {
  edit_Employe_Form.classList.add("hidden");
  overlay.classList.add("hidden");
};

edit_Employ_close_btn.addEventListener("click", edit_employe_close);
edit_Employ_cancel_btn.addEventListener("click", edit_employe_close);
overlay.addEventListener("click", edit_employe_close);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !edit_Employe_Form.classList.contains("hidden")) {
    edit_employe_close();
  }
});


// ...................DELETEION OF AN EMPLOYEE...................


const delete_dailog = document.querySelector(".delete_dailog");
const del_btn_prfl = document.getElementById("del_btn_prfl");
const delet_cancel_btn_prfl = document.getElementById("delet_cancel_btn_prfl");
const prfl_delet = document.getElementById("prfl_delet");
const delete_template_form = document.querySelector(".delete_template_form");

const delet_close_btn_prfl = document.getElementById("delet_close_btn_prfl");

const dele_dialog_open = function () {
  delete_template_form.classList.remove("hidden");
  overlay.classList.remove("hidden");
};
prfl_delet.addEventListener("click", dele_dialog_open);


//FUCTION TO HIDE DELETE EMPLOYEE DIALOGUE BOX

const dele_dialog_close = function () {
  delete_template_form.classList.add("hidden");
  overlay.classList.add("hidden");
};

delet_close_btn_prfl.addEventListener("click", dele_dialog_close);
delet_cancel_btn_prfl.addEventListener("click", dele_dialog_close);
overlay.addEventListener("click", dele_dialog_close);

document.addEventListener("keydown", (e) => {
  if (
    e.key === "Escape" &&
    !delete_template_form.classList.contains("hidden")
  ) {
    dele_dialog_close();
  }
});

del_btn_prfl.addEventListener("click", (e) => {
  view_delete_emply(id);
});

async function view_delete_emply(id) {
  try {
    const response = await fetch(`http://localhost:5001/employees/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error in deletion ${response.status}`);
    }

    window.location.href = "http://localhost:5001/employees/dashboard";
  } catch (error) {
    console.log(error);
  }
}
