import { z } from 'zod'

export const otpFormSchema = z.object({
    mobileNo: z
        .string()
        .min(10, 'Enter correct Mobile Number')
        .max(10, 'Enter correct Mobile Number')
        .regex(/^[6-9]\d{9}$/, 'Enter correct Mobile Number'),
    program: z.string().min(1, 'This field is required'),
    lender: z.string().min(1, 'This field is required'),
    termsAgreed: z.boolean().refine(val => val === true, {
        message: 'You must agree to the Terms & Conditions',
    }),
    whatsappAgreed: z.boolean().refine(val => val === true, {
        message: 'You must agree to be contacted',
    }),
})