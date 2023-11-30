function submitForm() {
    let name = document.getElementById('name').value;
    let surname = document.getElementById('surname').value;
    let email = document.getElementById('email').value;
    let message = document.getElementById('message').value;

    if(validateForm(name, surname, email, message)){
        alert(name + ' ' + surname + ' ' + email + ' ' + message);

        document.getElementById('name').value = '';
        document.getElementById('name').removeAttribute("class", "error");
        document.getElementById('surname').value = '';
        document.getElementById('surname').removeAttribute("class", "error");
        document.getElementById('email').value = '';
        document.getElementById('email').removeAttribute("class", "error");
        document.getElementById('message').value = '';
        document.getElementById('message').removeAttribute("class", "error");
    };
    
};

function validateForm(name, surname, email, message) {
    if(name === null || name === undefined || name === ""){
        document.getElementById('name').setAttribute("class", "error");
        alert('Invalid Name!');
        return false;
    };
    if(surname === null || surname === undefined || surname === ""){
        document.getElementById('surname').setAttribute("class", "error");
        alert('Invalid Surname!');
        return false;
    };
    if(email === null || email === undefined || email === "" || !validateEmail(email)){
        document.getElementById('email').setAttribute("class", "error");
        alert('Invalid E-mail!');
        return false;
    };
    if(message === null || message === undefined || message === ""){
        document.getElementById('message').setAttribute("class", "error");
        alert('Invalid Message!');
        return false;
    };
    return true;
};

function validateEmail(email) {
    let emailPattern =  /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
    return emailPattern.test(email); 
};