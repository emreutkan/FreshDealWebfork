import * as yup from 'yup';
const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;

export const registerSchema = yup.object().shape({
    name_surname: yup.string().required('Ad girmek zorunludur'),
    email: yup.string().email('Geçerli bir email giriniz').required('Email girmek zorunludur'),
    phone: yup.number().positive('Pozitif bir değer giriniz').integer('Tam sayı giriniz').required(''),
    password: yup.string().min(5, 'En az 5 karakter giriniz').matches(passwordRules, {
        message: 'Lütfen en az 1 büyük harf, 1 küçük harf ve 1 sayı giriniz'
    }).required('Şifre girmek zorunludur'),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'Şifreler eşleşmiyor').required('Şifrenizi tekrar giriniz'),
});

export const loginSchema = yup.object().shape({
    email: yup.string().email('Geçerli bir email giriniz'),//.required('Email girmek zorunludur'),//req
    phone: yup.number().integer('Tam sayı giriniz'),//.required(''),//req
    password: yup.string().required('Şifrenizi giriniz'),
})

export const contactSchema = yup.object().shape({
    name: yup.string().required('İsim girmek zorunludur'),
    email: yup.string().email('Geçerli bir email giriniz').required('Email girmek zorunludur'),
    phone: yup.number().positive('Pozitif bir değer giriniz').integer('Tam sayı giriniz').required(''),
    comment: yup.string().required('Lütfen doldurunuz'),
})