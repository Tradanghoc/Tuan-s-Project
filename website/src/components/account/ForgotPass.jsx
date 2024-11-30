import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../assets/img/images/logo.svg';
import AxiosInstance from '../helpers/AxiosInstance'
import { ReactSVG } from 'react-svg';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ForgotPass = (prop) => {
    const navigation = useNavigate();
    async function handleSubmit(event) {
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
        let ex = document.getElementById('yourPassword').value;

        const response = await AxiosInstance().post('/post-admin-forgot-password-notification.php', { email, ex });
        if (response.status) {
            Swal.fire({
                title: 'Success',
                text: 'Your request has been sent to the admin',
                icon: 'success',
                confirmButtonText: 'OK'
            })
        } else {
            Swal.fire({
                title: 'Failed',
                text: 'Your request has not been sent to the admin',
                icon: 'error',
                confirmButtonText: 'OK'
            })
        
        }
    }
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
                                                <h5 className="card-title text-center pb-0 fs-4">Retrieve Accound</h5>
                                                <p className="text-center small">Enter your ID & reason for loosing password</p>
                                            </div>

                                            <form className="row g-3 needs-validation">

                                                <div className="col-12">
                                                    <label htmlFor="yourUsername" className="form-label">Username's Email</label>
                                                    <div className="input-group has-validation">
                                                        <span className="input-group-text" id="inputGroupPrepend">@</span>
                                                        <input type="text" name="username" className="form-control" id="yourUsername" required maxLength={20} minLength={20} value={'OliviaRamirez@gmail.com'} />
                                                        <div className="invalid-feedback">Please enter your username.</div>
                                                    </div>
                                                </div>

                                                <div className="col-12">
                                                    <label htmlFor="yourPassword" className="form-label">Excuse</label>
                                                    <textarea type="text" name="password" className="form-control" id="yourPassword" required value={'123456'} maxLength={200} minLength={5} style={{ height: 200, width: 400 }} />
                                                    <div className="invalid-feedback">Please enter your reason!</div>
                                                </div>


                                                <div className="col-12">
                                                    <button className="btn btn-primary w-100" type="button" style={{ background: '#fd7e14', marginTop: 50, borderWidth: 0 }}
                                                        onClick={(event) => handleSubmit(event)}>Submit</button>
                                                </div>
                                                <div className="col-12">
                                                    <p className="small mb-0">Remember your password? <a className='text-primary' onClick={() => { navigation('/login/signin') }} style={{ cursor: 'pointer' }}>Then let login and start working</a></p>
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

export default ForgotPass