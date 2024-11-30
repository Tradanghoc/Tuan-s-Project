import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../assets/img/images/logo.svg';
import AxiosInstance from '../helpers/AxiosInstance'
import { ReactSVG } from 'react-svg';
import { Navigate, useNavigate, useHref } from 'react-router-dom';

const Login = (prop) => {
    const { setID } = prop;
    async function handleLogin(event) {
        event.preventDefault(); // prevent form submission
        let signIn = true;
        var needsValidation = document.querySelectorAll('.needs-validation');
        Array.prototype.slice.call(needsValidation)
            .forEach(function (form) {
                if (!form.checkValidity()) {
                    event.stopPropagation();
                    form.classList.add('was-validated');
                    signIn = false;
                }
            });

        if (!signIn) return;
        let email = document.getElementById('yourUsername').value;
        let password = document.getElementById('yourPassword').value;

        const response = await AxiosInstance().post('/sign-in-admin.php', { email, password });
        if (response.status) {
            setID(response.data.Id);
            console.log("success")
        } else console.log("failed")
    }

    const navigate = useNavigate();
    return (
        <div>
            <main>
                <div className="container">

                    <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center">
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">

                                    <div className="d-flex justify-content-center py-4">
                                        <a href="index.html" className="logo d-flex align-items-center w-auto">
                                            <ReactSVG
                                                src={logo}
                                                className='nav-link-icon'
                                            />
                                            <span className="d-none d-lg-block">Orangic</span>
                                        </a>
                                    </div>
                                    <div className="card mb-3">

                                        <div className="card-body">

                                            <div className="pt-4 pb-2">
                                                <h5 className="card-title text-center pb-0 fs-4">Login to Your Account</h5>
                                                <p className="text-center small">Enter your ID & password to login</p>
                                            </div>

                                            <form className="row g-3 needs-validation">

                                                <div className="col-12">
                                                    <label htmlFor="yourUsername" className="form-label">Username's Email</label>
                                                    <div className="input-group has-validation">
                                                        <span className="input-group-text" id="inputGroupPrepend">@</span>
                                                        <input type="text" name="username" className="form-control" id="yourUsername" required maxLength={20} minLength={20} defaultValue={'anhtt676@gmail.com'}/>
                                                        <div className="invalid-feedback">Please enter your username.</div>
                                                    </div>
                                                </div>

                                                <div className="col-12">
                                                    <label htmlFor="yourPassword" className="form-label">Password</label>
                                                    <input type="password" name="password" className="form-control" id="yourPassword" required defaultValue={'123456'}/>
                                                    <div className="invalid-feedback">Please enter your password!</div>
                                                </div>


                                                <div className="col-12">
                                                    <button className="btn btn-primary w-100" type="button" style={{ background: '#fd7e14', marginTop: 50, borderWidth: 0 }}
                                                        onClick={(event) => {
                                                            console.log("press")
                                                            handleLogin(event)}}>Login</button>
                                                </div>
                                                <div className="col-12">
                                                    <p className="small mb-0 ">Forget your password? <a className='text-primary' onClick={()=>{
                                                        navigate('/login/forgot-password')
                                                    }} style={{cursor: 'pointer'}}>Then let get it back</a></p>
                                                </div>
                                            </form>

                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>

                    </section>

                </div>
            </main>
        </div>
    )
}

export default Login