export function ValidateEmail(email) {
    let emailError = "";
  
    if (!email) {
      emailError = "El correo electrónico es requerido";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      emailError = "Formato de correo inválido";
    }
  
    return emailError;
  }
  
  export function ValidatePassword(password) {
    let passwordError = "";
  
    if (!password) {
      passwordError = "La contraseña es requerida";
    } else if (password.length < 6) {
      passwordError = "La contraseña debe contener 6 caracteres como mínimo";
    }
  
    return passwordError;
  }

  export function ValidateName(name) {
    let nameError = null;

    if (!name){
      nameError = null;

    } else if(name.length < 2 ) {
      nameError = "El nombre debe contener mínimo 2 carácteres";
    }
    else if (name.length > 20) {
      nameError = "El nombre debe contener máximo 20 carácteres";
    }

    return nameError;
  }

  export function ValidateUserDescription(userDescription) {
    let descriptionError = null;

    if (!userDescription){
      descriptionError = null;
    } else if(userDescription.length < 2 ) {
      descriptionError = "La descrición debe contener mínimo 2 carácteres";
    }
    else if (userDescription.length > 200) {
      descriptionError = "La descrición debe contener máximo 200 carácteres";
    }

    return descriptionError;

  }
  export function ValidateLink(link) {
    let avatarError = null;
    
    if (!link){
      avatarError = null;
    }

    else if (!/^https?:\/\/.+/.test(link)) {
      avatarError = "Formato de link inválido"
  }
   return avatarError;
 }