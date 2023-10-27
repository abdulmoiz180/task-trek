import * as Yup from "yup";
export const RegistrationSchema = Yup.object({
  firstName: Yup.string()
    .min(2)
    .max(25)
    .required("Please enter your first name"),
  lastName: Yup.string().min(2).max(25).required("Please enter your last name"),
  Company: Yup.string()
    .min(2)
    .max(25)
    .required("Please enter your Compnay name"),
  email: Yup.string().email().required("Please enter your email"),
  password: Yup.string().min(8).required("Please enter your password"),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password"), null], "Password must match"),
});
