// Style
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/style.css';
import '../assets/js/main.js'

// SVG
import logo from '../assets/img/images/logo.svg';
import menu from '../assets/img/icons/menu.svg';
import search from '../assets/img/icons/search.svg';
import notify from '../assets/img/icons/notify.svg';
import chat_box from '../assets/img/icons/chat_box.svg'
import dashboard from '../assets/img/icons/dashboard.svg';
import infor from '../assets/img/icons/infor.svg';
import income from '../assets/img/icons/income.svg';
import dropdown from '../assets/img/icons/dropdown.svg';
import danger from '../assets/img/icons/danger.svg';
import employee from '../assets/img/icons/employee.svg';
import users from '../assets/img/icons/users.svg';
import send_notify from '../assets/img/icons/send_notify.svg';
import restaurant from '../assets/img/icons/restaurant.svg';
import food from '../assets/img/icons/food.svg';
import history from '../assets/img/icons/history.svg';
import discount from '../assets/img/icons/discount.svg';
import error from '../assets/img/icons/error.svg';
import report from '../assets/img/icons/report.svg';
import dot from '../assets/img/icons/dot.svg';
import eye_open from '../assets/img/icons/eye-open.svg';
import eye_close from '../assets/img/icons/eye-close.svg';
// Image
import avatar from '../assets/img/images/ex_avatar.png';

// Conponent
import React, { useEffect, useReducer, useRef, useState } from 'react'
import { ReactSVG } from 'react-svg';
import ApexCharts from 'apexcharts';
import { Navigate, useNavigate, useHref } from 'react-router-dom';
import Swal from 'sweetalert2'
import AxiosInstance from '../helpers/AxiosInstance.js';


const Staffs = (prop) => {
    const { host, setID, adminID } = prop;
    document.title = 'Informations - Staffs';
    const chartRef = useRef(null);
    const navigate = useNavigate();
    const [color, setColor] = useState('#4154f1');

    const changePage = (link) => {
        navigate(link);
    };

    const logOut = () => {
        console.log("log out");
        setID('');
    }

    const jobList = ['Admin', 'Manager', 'Other'];

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const initialState = {
        allStaffs: [],
        reqPassChange: [],

        allStaffPage: 1,
        reqPassChangePage: 1,

        allStaffTotalPage: 1,
        reqPassChangeTotalPage: 1
    }

    const [data, dispatchData] = useReducer((state, action) => {
        switch (action.type) {
            case 'GET_ALL_STAFFS':
                return { ...state, allStaffs: action.payload };
            case 'GET_REQ_PASS_CHANGE':
                return { ...state, reqPassChange: action.payload };

            case 'SET_ALL_STAFF_PAGE':
                return { ...state, allStaffPage: action.payload };
            case 'SET_REQ_PASS_CHANGE_PAGE':
                return { ...state, reqPassChangePage: action.payload };

            case 'SET_ALL_STAFF_TOTAL_PAGE':
                return { ...state, allStaffTotalPage: action.payload };
            case 'SET_REQ_PASS_CHANGE_TOTAL_PAGE':
                return { ...state, reqPassChangeTotalPage: action.payload };

            default:
                return state;
        }
    }, initialState);


    {/** Get staff list */ }

    const loadAllStaffs = async () => {
        try {
            const response = await AxiosInstance().get('/get-all-staffs.php');
            // only take 5 users
            const length = response.staffs.length;

            let list = response.staffs.slice(data.allStaffPage * 5 - 5, data.allStaffPage * 5);

            dispatchData({ type: 'GET_ALL_STAFFS', payload: list });
            dispatchData({ type: 'SET_ALL_STAFF_TOTAL_PAGE', payload: (Math.ceil(length / 5)) });
        } catch (error) {
            console.log("Fail to get staffs because of: " + error);
        }
    }

    useEffect(() => {
        loadAllStaffs();
    }, [data.allStaffPage]);

    {/** End of get staff list */ }

    {/** Get staff list request password change */ }

    const loadAllStaffsReqPassChange = async () => {
        try {
            const response = await AxiosInstance().get('/get-staffs-req-pass-change.php');
            // only take 5 users
            const length = response.staffs.length;

            let list = response.staffs.slice(data.allStaffPage * 5 - 5, data.allStaffPage * 5);

            dispatchData({ type: 'GET_REQ_PASS_CHANGE', payload: list });
            dispatchData({ type: 'SET_REQ_PASS_CHANGE_TOTAL_PAGE', payload: (Math.ceil(length / 5)) });
        } catch (error) {
            console.log("Fail to get staffs because of: " + error);
        }
    }

    useEffect(() => {
        loadAllStaffsReqPassChange();
    }, [data.reqPassChangePage]);

    {/** End of get staff list request password change */ }

    const handleCreateAccount = async (event) => {
        event.preventDefault(); // prevent form submission
        console.log("press in")
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

        let name = document.getElementById('yourName').value;
        let email = document.getElementById('yourUsername').value;
        let password = document.getElementById('yourPassword').value;
        let job = document.getElementById('yourJob').value;
        console.log(email, password);
        const response = await AxiosInstance().post('/create-admin.php', { name, email, password, job });
        console.log(response.statusText);

        if (response.status) {
            console.log("success");
            Swal.fire({
                title: 'Success',
                text: 'Account successfully created',
                icon: 'success',
                confirmButtonText: 'OK'
            })
        } else {
            console.log("failed");
            Swal.fire({
                title: 'Failed',
                text: 'Account creation failed',
                icon: 'error',
                confirmButtonText: 'OK'
            })
        }
    }

    const handleResetPass = async (resetterId, resetRequesterId) => {
        const response = await AxiosInstance().post('/reset-pass-admin.php', { resetterId, resetRequesterId });
        console.log(response.statusText);

        if (response.status) {
            console.log("success");
            loadAllStaffsReqPassChange();
            Swal.fire({
                title: 'Success',
                text: 'Reset password successfully',
                icon: 'success',
                confirmButtonText: 'OK'
            })
        } else {
            console.log("failed");
            Swal.fire({
                title: 'Failed',
                text: 'Password reset failed',
                icon: 'error',
                confirmButtonText: 'OK'
            })
        }
    }

    return (
        <div className=''>
            {/* <!-- ======= Header ======= --> */}
            <header id="header" className="header fixed-top d-flex align-items-center">

                <div className="d-flex align-items-center justify-content-between">
                    <img src={logo} alt="" />
                    <a className="logo d-flex align-items-center">
                        <span className="d-none d-lg-block orange">Orangic</span>
                    </a>
                    <img src={menu} alt="" className='toggle-sidebar-btn' />
                </div>
                {/* <!-- End Logo --> */}

                <div className="search-bar">
                    <form className="search-form d-flex align-items-center" method="POST" action="#">
                        <input type="text" name="query" placeholder="Search" title="Enter search keyword" />
                        <button type="submit" title="Search"><img src={search} /></button>
                    </form>
                </div>
                {/* <!-- End Search Bar --> */}

                <nav className="header-nav ms-auto">
                    <ul className="d-flex align-items-center">

                        <li className="nav-item d-block d-lg-none">
                            <a className="nav-link nav-icon search-bar-toggle ">
                                <i className="bi bi-search"></i>
                            </a>
                        </li>
                        {/* <!-- End Search Icon--> */}

                        <li className="nav-item dropdown">

                            <a className="nav-link nav-icon" data-bs-toggle="dropdown">
                                <img src={notify} alt='Error notify icon' />
                                <span className="badge bg-primary badge-number">4</span>
                            </a>
                            {/* <!-- End Notification Icon --> */}

                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
                                <li className="dropdown-header">
                                    You have 4 new notifications
                                    <a><span className="badge rounded-pill bg-primary p-2 ms-2">View all</span></a>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li className="notification-item">
                                    <i className="bi bi-exclamation-circle text-warning"></i>
                                    <div>
                                        <h4>Lorem Ipsum</h4>
                                        <p>Quae dolorem earum veritatis oditseno</p>
                                        <p>30 min. ago</p>
                                    </div>
                                </li>

                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li className="notification-item">
                                    <i className="bi bi-x-circle text-danger"></i>
                                    <div>
                                        <h4>Atque rerum nesciunt</h4>
                                        <p>Quae dolorem earum veritatis oditseno</p>
                                        <p>1 hr. ago</p>
                                    </div>
                                </li>

                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li className="notification-item">
                                    <i className="bi bi-check-circle text-success"></i>
                                    <div>
                                        <h4>Sit rerum fuga</h4>
                                        <p>Quae dolorem earum veritatis oditseno</p>
                                        <p>2 hrs. ago</p>
                                    </div>
                                </li>

                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li className="notification-item">
                                    <i className="bi bi-info-circle text-primary"></i>
                                    <div>
                                        <h4>Dicta reprehenderit</h4>
                                        <p>Quae dolorem earum veritatis oditseno</p>
                                        <p>4 hrs. ago</p>
                                    </div>
                                </li>

                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li className="dropdown-footer">
                                    <a>Show all notifications</a>
                                </li>

                            </ul>
                            {/* <!-- End Notification Dropdown Items --> */}

                        </li>
                        {/* <!-- End Notification Nav --> */}

                        <li className="nav-item dropdown">

                            <a className="nav-link nav-icon" data-bs-toggle="dropdown">
                                <img src={chat_box} alt='Error notify icon' />
                                <span className="badge bg-success badge-number">3</span>
                            </a>
                            {/* <!-- End Messages Icon --> */}

                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow messages">
                                <li className="dropdown-header">
                                    You have 3 new messages
                                    <a><span className="badge rounded-pill bg-primary p-2 ms-2">View all</span></a>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li className="message-item">
                                    <a>
                                        <img src="assets/img/messages-1.jpg" alt="" className="rounded-circle" />
                                        <div>
                                            <h4>Maria Hudson</h4>
                                            <p>Velit asperiores et ducimus soluta repudiandae labore officia est ut...</p>
                                            <p>4 hrs. ago</p>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li className="message-item">
                                    <a>
                                        <img src="assets/img/messages-2.jpg" alt="" className="rounded-circle" />
                                        <div>
                                            <h4>Anna Nelson</h4>
                                            <p>Velit asperiores et ducimus soluta repudiandae labore officia est ut...</p>
                                            <p>6 hrs. ago</p>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li className="message-item">
                                    <a>
                                        <img src="assets/img/messages-3.jpg" alt="" className="rounded-circle" />
                                        <div>
                                            <h4>David Muldon</h4>
                                            <p>Velit asperiores et ducimus soluta repudiandae labore officia est ut...</p>
                                            <p>8 hrs. ago</p>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li className="dropdown-footer">
                                    <a>Show all messages</a>
                                </li>

                            </ul>
                            {/* <!-- End Messages Dropdown Items --> */}

                        </li>
                        {/* <!-- End Messages Nav --> */}

                        <li className="nav-item dropdown pe-3">

                            <a className="nav-link nav-profile d-flex align-items-center pe-0" data-bs-toggle="dropdown">
                                <img src={avatar} alt="Error Profile" className="rounded-circle" />
                                <span className="d-none d-md-block dropdown-toggle ps-2">Alex</span>
                            </a>
                            {/* <!-- End Profile Iamge Icon --> */}

                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                                <li className="dropdown-header">
                                    <h6>Kevin Anderson</h6>
                                    <span>Web Designer</span>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li>
                                    <a className="dropdown-item d-flex align-items-center" href="users-profile.html">
                                        <i className="bi bi-person"></i>
                                        <span>My Profile</span>
                                    </a>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li>
                                    <a className="dropdown-item d-flex align-items-center" href="users-profile.html">
                                        <i className="bi bi-gear"></i>
                                        <span>Account Settings</span>
                                    </a>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li>
                                    <a className="dropdown-item d-flex align-items-center" href="pages-faq.html">
                                        <i className="bi bi-question-circle"></i>
                                        <span>Need Help?</span>
                                    </a>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li>
                                    <a className="dropdown-item d-flex align-items-center" onClick={() => { logOut() }}>
                                        <i className="bi bi-box-arrow-right"></i>
                                        <span>Sign Out</span>
                                    </a>
                                </li>

                            </ul>
                            {/* <!-- End Profile Dropdown Items --> */}
                        </li>
                        {/* <!-- End Profile Nav --> */}

                    </ul>
                </nav>
                {/* <!-- End Icons Navigation --> */}

            </header>
            {/* <!-- End Header --> */}


            {/* <!-- ======= Sidebar ======= --> */}
            <aside id="sidebar" className="sidebar">

                <ul className="sidebar-nav" id="sidebar-nav">

                    <li className="nav-item">
                        <a className="nav-link collapsed" onClick={() => changePage('/')}>
                            <ReactSVG
                                src={dashboard}
                                className='nav-link-icon'
                            />
                            <span>Dashboard</span>
                        </a>
                    </li>
                    {/* <!-- End Dashboard Nav --> */}

                    <li className="nav-heading">Applications</li>

                    <li className="nav-item">
                        <a className="nav-link collapsed" data-bs-target="#components-nav" data-bs-toggle="collapse" aria-expanded="true">
                            <ReactSVG
                                src={infor}
                                className='nav-link-icon'
                            />
                            <span>Informations</span>
                            <ReactSVG
                                src={dropdown}
                                className='nav-link-icon ms-auto'
                            />
                        </a>
                        <ul id="components-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
                            <li>
                                <a onClick={() => changePage('/informations/users')}>
                                    <ReactSVG
                                        src={dot}
                                        className='nav-link-subicon dot'
                                    />
                                    <ReactSVG
                                        src={users}
                                        className='nav-link-subicon'
                                    />
                                    <span>Users</span>
                                </a>
                            </li>
                            <li>
                                <a onClick={() => changePage('/informations/notifications')}>
                                    <ReactSVG
                                        src={dot}
                                        className='nav-link-subicon dot'
                                    />
                                    <ReactSVG
                                        src={send_notify}
                                        className='nav-link-subicon'
                                    />
                                    <span>Notification</span>
                                </a>
                            </li>
                            <li>
                                <a onClick={() => changePage('/informations/restaurants')}>
                                    <ReactSVG
                                        src={dot}
                                        className='nav-link-subicon dot'
                                    />
                                    <ReactSVG
                                        src={restaurant}
                                        className='nav-link-subicon'
                                    />
                                    <span>Restaurants</span>
                                </a>
                            </li>
                            <li>
                                <a onClick={() => changePage('/informations/foods')}>
                                    <ReactSVG
                                        src={dot}
                                        className='nav-link-subicon dot'
                                    />
                                    <ReactSVG
                                        src={food}
                                        className='nav-link-subicon'
                                    />
                                    <span>Foods</span>
                                </a>
                            </li>
                            <li>
                                <a onClick={() => changePage('/informations/history-files')}>
                                    <ReactSVG
                                        src={dot}
                                        className='nav-link-subicon dot'
                                    />
                                    <ReactSVG
                                        src={history}
                                        className='nav-link-subicon'
                                    />
                                    <span>History Files</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                    {/* <!-- End Information Nav --> */}

                    <li className="nav-item">
                        <a className="nav-link collapsed" data-bs-target="#forms-nav" data-bs-toggle="collapse">
                            <ReactSVG
                                src={income}
                                className='nav-link-icon'
                            />
                            <span>Income</span>
                            <ReactSVG
                                src={dropdown}
                                className='nav-link-icon ms-auto'
                            />
                        </a>
                        <ul id="forms-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
                            <li>
                                <a onClick={() => changePage('/incomes/discount')}>
                                    <ReactSVG
                                        src={dot}
                                        className='nav-link-subicon dot'
                                    />
                                    <ReactSVG
                                        src={discount}
                                        className='nav-link-subicon'
                                    />
                                    <span>Discounts</span>
                                </a>
                            </li>
                            <li>
                                <a onClick={() => changePage('/incomes/orders')}>
                                    <ReactSVG
                                        src={dot}
                                        className='nav-link-subicon dot'
                                    />
                                    <ReactSVG
                                        src={discount}
                                        className='nav-link-subicon'
                                    />
                                    <span>Orders</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                    {/* <!-- End Income Nav --> */}

                    <li className="nav-item">
                        <a className="nav-link collapsed" data-bs-target="#tables-nav" data-bs-toggle="collapse">
                            <ReactSVG
                                src={danger}
                                className='nav-link-icon'
                            />
                            <span>Errors</span>
                            <ReactSVG
                                src={dropdown}
                                className='nav-link-icon ms-auto'
                            />
                        </a>
                        <ul id="tables-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
                            <li>
                                <a onClick={() => changePage('/reports/report-errors')}>
                                    <ReactSVG
                                        src={dot}
                                        className='nav-link-subicon dot'
                                    />
                                    <ReactSVG
                                        src={error}
                                        className='nav-link-subicon'
                                    />
                                    <span>Report Errors</span>
                                </a>
                            </li>
                            <li>
                                <a onClick={() => changePage('/reports/report-restaurants')}>
                                    <ReactSVG
                                        src={dot}
                                        className='nav-link-subicon dot'
                                    />
                                    <ReactSVG
                                        src={report}
                                        className='nav-link-subicon'
                                    />
                                    <span>Report Restaurants</span>
                                </a>
                            </li>
                            <li>
                                <a onClick={() => changePage('/reports/report-foods')}>
                                    <ReactSVG
                                        src={dot}
                                        className='nav-link-subicon dot'
                                    />
                                    <ReactSVG
                                        src={report}
                                        className='nav-link-subicon'
                                    />
                                    <span>Report Foods</span>
                                </a>
                            </li>
                            <li>
                                <a onClick={() => changePage('/reports/report-users')}>
                                    <ReactSVG
                                        src={dot}
                                        className='nav-link-subicon dot'
                                    />
                                    <ReactSVG
                                        src={report}
                                        className='nav-link-subicon'
                                    />
                                    <span>Report Users</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                    {/* <!-- End Errors Nav --> */}

                    <li className="nav-heading">Pages</li>

                    <li className="nav-item">
                        <a className="nav-link" onClick={() => changePage('/informations/staffs')}>
                            <ReactSVG
                                src={employee}
                                className='nav-link-icon'
                            />
                            <span>Employees</span>
                        </a>
                    </li>
                    {/* <!-- End Empployee Page Nav --> */}

                </ul>

            </aside>
            {/* <!-- End Sidebar--> */}

            {/* <!-- ======= Main ======= --> */}
            <main id="main" className="main">
                {/* <!-- ======= Main ======= --> */}
                <div className="pagetitle">
                    <h1>Staffs</h1>
                    <nav>
                        <ol className="breadcrumb">
                            {/* <li className="breadcrumb-item"><a href="#">Informations</a></li> */}
                            <li className="breadcrumb-item active">Employees</li>
                        </ol>
                    </nav>
                </div>
                {/* <!-- End Page Title --> */}

                {/* <!-- ======= Section ======= --> */}
                <section className="section dashboard">
                    <div className="row">


                        {/* <!-- Left side columns --> */}
                        <div className="col-lg-8">
                            <div className="row">

                                {/* <!-- Tab Bar --> */}
                                <div className="col-12">

                                    <div className="card">
                                        <div className="card-body pt-3">

                                            {/* <!-- Bordered Tabs --> */}
                                            <ul className="nav nav-tabs nav-tabs-bordered">

                                                <li className="nav-item">
                                                    <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#staffs-list">List</button>
                                                </li>

                                                <li className="nav-item">
                                                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#req-pass-change-list">Request Password Change</button>
                                                </li>

                                                <li className="nav-item">
                                                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#create-account">Create Account</button>
                                                </li>

                                            </ul>
                                            <div className="tab-content pt-2">

                                                {/* <!-- Restaurant List Table --> */}
                                                <div className="tab-pane fade show active staffs-list" id="staffs-list">
                                                    <div className="tab-title search nav">
                                                        <h5 className="card-title">Staffs List</h5>
                                                        <div className="datatable-search">
                                                            <input className="datatable-input" placeholder="Search..." type="search" title="Search within table" />
                                                        </div>

                                                        <nav aria-label="Page navigation example">
                                                            <ul className="pagination">
                                                                <li className="page-item">
                                                                    <a className="page-link" aria-label="Previous" style={{ cursor: 'pointer' }} onClick={() => {
                                                                        dispatchData({ type: 'SET_ALL_STAFF_PAGE', payload: 1 })
                                                                    }}>
                                                                        <span aria-hidden="true">«</span>
                                                                    </a>
                                                                </li>
                                                                {
                                                                    Array.from({ length: data.allStaffTotalPage }, (_, index) => {
                                                                        if (data.allStaffTotalPage > 10) {
                                                                            if ((index >= data.allStaffPage - 2 && index <= data.allStaffPage + 1) || // 2 pages before and after current page
                                                                                index >= data.allStaffTotalPage - 2) { // last 2 pages
                                                                                return (
                                                                                    <li className={`page-item ${data.allStaffPage === index + 1 ? 'active' : ''}`} key={index + 1} style={{ cursor: 'pointer' }}>
                                                                                        <a className="page-link" onClick={() => dispatchData({ type: 'SET_ALL_STAFF_PAGE', payload: index + 1 })}>{index + 1}</a>
                                                                                    </li>
                                                                                );
                                                                            }
                                                                        } else {
                                                                            return (
                                                                                <li className={`page-item ${data.allStaffPage === index + 1 ? 'active' : ''}`} key={index + 1} style={{ cursor: 'pointer' }}>
                                                                                    <a className="page-link" onClick={() => dispatchData({ type: 'SET_ALL_STAFF_PAGE', payload: index + 1 })}>{index + 1}</a>
                                                                                </li>
                                                                            );
                                                                        }
                                                                    })
                                                                }
                                                                <li className="page-item">
                                                                    <a className="page-link" aria-label="Next" style={{ cursor: 'pointer' }} onClick={() => { dispatchData({ type: 'SET_ALL_STAFF_PAGE', payload: data.allStaffTotalPage }) }}>
                                                                        <span aria-hidden="true">»</span>
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </nav>
                                                    </div>

                                                    <table className="table table-borderless"
                                                        style={{ textAlign: 'start' }}
                                                    >
                                                        <thead>
                                                            <tr>
                                                                <th scope="col" style={{ textAlign: 'center' }}>Avatar</th>
                                                                <th scope="col">Name</th>
                                                                <th scope="col">Email</th>
                                                                <th scope='col'>Job</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                data?.allStaffs?.map((item, index) => (
                                                                    <tr key={item.Id}>
                                                                        <th scope="row" style={{ textAlign: 'center' }}>
                                                                            <a><img src={item.Image ? `http://${host}/uploads/${item.Image}.jpg` : avatar} alt="" className="avatar" /></a>
                                                                        </th>
                                                                        <td style={{ justifyContent: 'center' }}>{item.Name}</td>
                                                                        <td className="fw-bold">{item.Email}</td>
                                                                        <td>{item.Job}</td>
                                                                    </tr>
                                                                ))
                                                            }
                                                        </tbody>
                                                    </table>

                                                </div>
                                                {/* <!-- End Restaurants List Tab --> */}

                                                {/* <!-- Request Password Change List Table --> */}
                                                <div className="tab-pane fade req-pass-change-list" id="req-pass-change-list">
                                                    <div className="tab-title search nav">
                                                        <h5 className="card-title">Staffs Request Password Change List</h5>
                                                        <div className="datatable-search">
                                                            <input className="datatable-input" placeholder="Search..." type="search" title="Search within table" />
                                                        </div>

                                                        <nav aria-label="Page navigation example">
                                                            <ul className="pagination">
                                                                <li className="page-item">
                                                                    <a className="page-link" aria-label="Previous" style={{ cursor: 'pointer' }} onClick={() => {
                                                                        dispatchData({ type: 'SET_REQ_PASS_CHANGE_PAGE', payload: 1 })
                                                                    }}>
                                                                        <span aria-hidden="true">«</span>
                                                                    </a>
                                                                </li>
                                                                {
                                                                    Array.from({ length: data.reqPassChangeTotalPage }, (_, index) => {
                                                                        if (data.reqPassChangeTotalPage > 10) {
                                                                            if ((index >= data.reqPassChangePage - 2 && index <= data.reqPassChangePage + 1) || // 2 pages before and after current page
                                                                                index >= data.reqPassChangeTotalPage - 2) { // last 2 pages
                                                                                return (
                                                                                    <li className={`page-item ${data.reqPassChangePage === index + 1 ? 'active' : ''}`} key={index + 1} style={{ cursor: 'pointer' }}>
                                                                                        <a className="page-link" onClick={() => dispatchData({ type: 'SET_REQ_PASS_CHANGE_PAGE', payload: index + 1 })}>{index + 1}</a>
                                                                                    </li>
                                                                                );
                                                                            }
                                                                        } else {
                                                                            return (
                                                                                <li className={`page-item ${data.reqPassChangePage === index + 1 ? 'active' : ''}`} key={index + 1} style={{ cursor: 'pointer' }}>
                                                                                    <a className="page-link" onClick={() => dispatchData({ type: 'SET_REQ_PASS_CHANGE_PAGE', payload: index + 1 })}>{index + 1}</a>
                                                                                </li>
                                                                            );
                                                                        }
                                                                    })
                                                                }
                                                                <li className="page-item">
                                                                    <a className="page-link" aria-label="Next" style={{ cursor: 'pointer' }} onClick={() => { dispatchData({ type: 'SET_REQ_PASS_CHANGE_PAGE', payload: data.reqPassChangeTotalPage }) }}>
                                                                        <span aria-hidden="true">»</span>
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </nav>
                                                    </div>

                                                    <table className="table table-borderless"
                                                        style={{ textAlign: 'start' }}
                                                    >
                                                        <thead>
                                                            <tr>
                                                                <th scope="col" style={{ textAlign: 'center' }}>Avatar</th>
                                                                <th scope="col">Name</th>
                                                                <th scope="col">Email</th>
                                                                <th scope='col'>Job</th>
                                                                <th scope='col'>Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                data?.reqPassChange?.map((item, index) => (
                                                                    <tr key={item.Id}>
                                                                        <th scope="row" style={{ textAlign: 'center' }}>
                                                                            <a><img src={item.Image ? `http://${host}/uploads/${item.Image}.jpg` : avatar} alt="" className="avatar" /></a>
                                                                        </th>
                                                                        <td style={{ justifyContent: 'center' }}>{item.Name}</td>
                                                                        <td className="fw-bold">{item.Email}</td>
                                                                        <td>{item.Job}</td>

                                                                        <td className="fw-bold">
                                                                            {/* <button type="button" className="btn btn-danger btn-sm"
                                                                                onClick={() => console.log("resetPass")}>Banned</button> */}
                                                                            <button onClick={() => {
                                                                                console.log("resetPass");
                                                                                handleResetPass(adminID, item.Id);
                                                                            }}
                                                                                type="button" className="btn btn-outline-warning btn-sm" >Reset Pass</button>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                                {/* <!-- End Request Password Change List Tab --> */}

                                                {/* <!-- Create Account Form --> */}
                                                <div className="tab-pane fade" id="create-account">
                                                    <div className="card-body">

                                                        <div className="pt-4 pb-2">
                                                            <h5 className="card-title text-center pb-0 fs-4">Create Account</h5>
                                                            <p className="text-center small">Enter your information to create</p>
                                                        </div>

                                                        <form className="row g-3 needs-validation">

                                                            <div className="col-12">
                                                                <label htmlFor="yourName" className="form-label">Name</label>
                                                                <div className="input-group has-validation">

                                                                    <input type="text" name="name" className="form-control" id="yourName" required defaultValue={'nguyen van teo'} />
                                                                    <div className="invalid-feedback">Please enter your name.</div>
                                                                </div>
                                                            </div>

                                                            <div className="col-12">
                                                                <label htmlFor="yourUsername" className="form-label">Email</label>
                                                                <div className="input-group has-validation">
                                                                    <input type="text" name="username" className="form-control" id="yourUsername" required defaultValue={'anhtt676@gmail.com'} />
                                                                    <div className="invalid-feedback">Please enter your username.</div>
                                                                </div>
                                                            </div>

                                                            <div className="col-12">
                                                                <label htmlFor="yourPassword" className="form-label">Password</label>
                                                                <div className="input-group">
                                                                    <input type={showPassword ? 'text' : 'password'} name="password" className="form-control" id="yourPassword" required defaultValue={'123456'} />
                                                                    <button type="button" id="togglePassword" className="btn btn-outline-secondary" onClick={togglePasswordVisibility}>
                                                                        {
                                                                            !showPassword ?
                                                                                <ReactSVG
                                                                                    src={eye_open}
                                                                                    className='show-pass-icon'
                                                                                /> : <ReactSVG
                                                                                    src={eye_close}
                                                                                    className='show-pass-icon'
                                                                                />
                                                                        }
                                                                    </button>
                                                                </div>
                                                                <div className="invalid-feedback">Please enter your password!</div>
                                                            </div>

                                                            <div className="col-12">
                                                                <label htmlFor="yourJob" className="form-label">Job</label>
                                                                <select className="form-select" id="yourJob" required>
                                                                    {
                                                                        jobList.map((item, index) => (
                                                                            <option key={index} value={item} defaultValue={index === 1}>{item}</option>
                                                                        ))
                                                                    }
                                                                </select>
                                                            </div>

                                                            <div className="col-12">
                                                                <button className="btn btn-primary w-100" type="button" style={{ background: '#fd7e14', marginTop: 50, borderWidth: 0 }}
                                                                    onClick={(event) => {
                                                                        console.log("press create admin");
                                                                        handleCreateAccount(event);

                                                                    }}>Create</button>
                                                            </div>
                                                        </form>

                                                    </div>
                                                </div>
                                                {/* <!-- End Create Account Form --> */}

                                            </div>
                                            {/* <!-- End Bordered Tabs --> */}

                                        </div>
                                    </div>

                                </div>
                                {/* <!-- End Tab Bar --> */}

                            </div>
                        </div>
                        {/* <!-- End Left side columns --> */}


                        {/* <!-- Right side columns --> */}
                        <div className="col-lg-4">

                        </div>
                        {/* <!-- End Right side columns --> */}

                    </div>
                </section>

            </main>
            {/* <!-- End Main --> */}
        </div>
    )
}

export default Staffs;