function accountValidator({password, passwordConfirmation, email, displayName})
{
    const errors = [];
    if(password.length < 8)
    {
        errors.push("Password is too short");
    }
    if(password !== passwordConfirmation)
    {
        errors.push("Password strings don't match");
    }
    if(!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/))
    {
        errors.push("Email is invalid");
    }
    if(!displayName.match(/^[a-zA-Z0-9_-]{5,20}$/))
    {
        errors.push("Display names can only contain the letters a-z, upper and lower case, numbers and _ or - and must be between 5 and 20 (inclusive) characters.");
    }
    return errors;
}

export default accountValidator;

