import { body, validationResult } from "express-validator";

export const validateUser = [
    body("username").trim()
        .isLength({min: 1, max: 30})
        .withMessage("Username must be between 1 and 30 characters"),
    body("email").trim()
        .isEmail()
        .withMessage("Email is invalid. Please follow the format 'example@domain.com'"),
    body("password").trim()
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 0,
        })
        .withMessage("Password must contain at least 1 lowercase letter, uppercase letter, and number"),
    body("confirm-password").trim()
        .exists({checkFalsy: true}).withMessage("You must confirm your password")
        .custom((value, {req}) => value === req.body.password).withMessage("Passwords do not match"),
]

export const validateSignup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { 
        return res.status(400).render("/sign-up", {
            errors: errors.array(),
            data: { username: req.body.username, password: req.body.password, email: req.body.email }
        })
    } 
    next();
}