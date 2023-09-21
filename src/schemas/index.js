import React from 'react'
import * as Yup from "yup"


export const ForgetPasswordSchema = Yup.object({
    email:Yup.string().email().required("Please enter your email")
})
