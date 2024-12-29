import { useState, useEffect } from 'react';
import { Form, Formik } from 'formik';
import './LoginPage.css'
import axios from 'axios';
import Response from './components/Response';
import Banner from './Banner';
import Footer from './Footer';
import { loginSchema } from './schemas';
import LoginInput from './components/LoginInput';

function LoginPage() {


    /*const { values, errors, isSubmitting, handleChange, handleSubmit } = useFormik({
        initialValues: {
            email: '',
            phone: '',
            password: '',
        },
        validationSchema: loginSchema,
        onSubmit: async (values, actions) => {
            if (loginOption === "email") {
                setUserLoginResponse(await userLogin(values.email, '', values.password, loginOption, true)); // will change in future versions
            } else {
                setUserLoginResponse(await userLogin('', values.phone, values.password, loginOption, true)); // will change in future versions
            }
            actions.resetForm();
        },
    });*/

    const [loginOption, setLoginOption] = useState("email")
    /*const [formData, setFormData] = useState({
        email: "",
        phone: "",
        password: "",
    })*/
    const [userLoginResponse, setUserLoginResponse] = useState(null)
    const [loginData, setLoginData] = useState(null);

    useEffect(() => {

        if (userLoginResponse) {
            loginResponse(userLoginResponse);
        }

    }, [userLoginResponse])

    const loginResponse = (data) => {
        setLoginData(data);
    }

    const userLogin = async (email, phone_number, password, login_type, password_login) => {
        const response = await axios.post("https://freshdealapi-fkfaajfaffh4c0ex.uksouth-01.azurewebsites.net/v1/login", {
            email,
            phone_number,
            password,
            login_type,
            password_login,
        });
        console.log(response.data)
        return response.data;
    }

    /*const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };*/

    /*const handleLogin = async () => {
        //event.preventDefault();
        if (loginOption === "email") {
            setUserLoginResponse(await userLogin(formData.email, '', formData.password, loginOption, true)); // will change in future versions
        } else {
            setUserLoginResponse(await userLogin('', formData.phone, formData.password, loginOption, true)); // will change in future versions
        }
    }*/

    return (
        <>
            <Banner />
            <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
                <div style={{ marginBottom: "20px" }}>
                    <button onClick={() => setLoginOption("email")} style={{
                        marginRight: "10px",
                        padding: "10px",
                        backgroundColor: loginOption === "email" ? "#007BFF" : "#f0f0f0",
                        color: loginOption === "email" ? "white" : "black",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}>
                        Email Login
                    </button>
                    <button onClick={() => setLoginOption("phone_number")} style={{
                        padding: "10px",
                        backgroundColor: loginOption === "phone_number" ? "#007BFF" : "#f0f0f0",
                        color: loginOption === "phone_number" ? "white" : "black",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}>
                        Phone Login
                    </button>
                </div>

                <Formik
                    initialValues={{
                        email: '',
                        phone: '',
                        password: ''
                    }}
                    onSubmit={async (values, actions) => {
                        if (loginOption === "email") {
                            setUserLoginResponse(await userLogin(values.email, '', values.password, loginOption, true)); // will change in future versions
                        } else {
                            setUserLoginResponse(await userLogin('', values.phone, values.password, loginOption, true)); // will change in future versions
                        }
                        actions.resetForm();
                    }}
                    validationSchema={loginSchema}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            {loginOption === "email" ? (
                                <div style={{ marginBottom: "15px" }}>
                                    <LoginInput
                                    label="E-mail:"
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Name"
                                    required
                                    style={{ width: "100%", padding: "10px", marginTop: "5px" }}
                                 />
                                </div>
                            ) : (
                                <div style={{ marginBottom: "15px" }}>
                                    <LoginInput
                                    label="Phone Number:"
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="Name"
                                    required
                                    style={{ width: "100%", padding: "10px", marginTop: "5px" }}
                                 />
                                </div>
                            )}

                            <div>
                            <LoginInput
                                    label="Password:"
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Name"
                                    required
                                    style={{ width: "100%", padding: "10px", marginTop: "5px" }}
                                 />
                            </div>

                            <button disabled={isSubmitting} type='submit' style={{
                                padding: "10px 20px",
                                backgroundColor: "#007BFF",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}>
                                Login
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
            {loginData && <Response loginData={loginData} />}
            <Footer />
        </>
    );
}

export default LoginPage