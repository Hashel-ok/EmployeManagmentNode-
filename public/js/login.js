const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});


const signup_name=document.getElementById('signup_name')
const signup_email=document.getElementById('signup_email')
const signup_password=document.getElementById('signup_password')
const signup_btn=document.getElementById('signup_btn')

const error_msg=document.getElementsByClassName("error_msg")
function vanish(){
  $('#myAlert').fadeOut('fast');
 }

 $(document).ready(function () {   
	setTimeout(function () {
		vanish()
	}, 5000);
});






	function signup_validation(){


		const validate_name=(input,serial,msg) => {

			const inputname=input.value.trim();
			
		
			if(inputname === ""){

				error_msg[serial].innerHTML = msg;

				input.focus()
			
			}
		
			else {
				error_msg[serial].innerHTML = "";
				
			}
		
		}

			const validateEmail = (input, serial, msg) => {
				let emailvalue = input.value.trim();
				let emailregex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		
				if (emailvalue === "") {
					error_msg[serial].innerHTML = msg;
					input.focus()
				
					
				}
		
				else if (!(emailvalue.match(emailregex))) {
					error_msg[serial].innerHTML = "Invalid Email";
					input.focus()
				
				}
		
				else {
					error_msg[serial].innerHTML = "";
				
				}
		
			}
	
			const validate_password= (input,serial,msg) => {

				if(input.value.trim()===""){

					error_msg[serial].innerHTML = msg;
					input.focus()
			
					
				}
			
				else {
					error_msg[serial].innerHTML= "";
			
				}
		

			}


			validate_name(signup_name, 0 ,"Please enter Name");

			validateEmail(signup_email, 1 ,"Please enter email");
			validate_password(signup_password, 2 ,"Please enter password");



			signup_name.addEventListener("input", () => remove_validation_error(0));
			signup_email.addEventListener("input", () => remove_validation_error(1))
			signup_password.addEventListener("input", () => remove_validation_error(2))


			function remove_validation_error(serial) {

				error_msg[serial].innerHTML= "";
			}
		

	}

	signup_btn.addEventListener("click",(e) =>{


		signup_validation();

	
	})