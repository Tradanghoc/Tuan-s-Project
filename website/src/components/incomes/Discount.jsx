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
import dropup from '../assets/img/icons/dropup.svg';
import danger from '../assets/img/icons/danger.svg';
import employee from '../assets/img/icons/employee.svg';
import users from '../assets/img/icons/users.svg';
import send_notify from '../assets/img/icons/send_notify.svg';
import restaurant from '../assets/img/icons/restaurant.svg';
import food from '../assets/img/icons/food.svg';
import history from '../assets/img/icons/history.svg';
import payment from '../assets/img/icons/payment.svg';
import discount from '../assets/img/icons/discount.svg';
import error from '../assets/img/icons/error.svg';
import report from '../assets/img/icons/report.svg';
import dot from '../assets/img/icons/dot.svg';
import new_user from '../assets/img/icons/new_user.svg';
import partnership from '../assets/img/icons/partnership.svg';
import user_banned from '../assets/img/icons/user_banned.svg';
import more from '../assets/img/icons/more.svg';

import Swal from 'sweetalert2'

// Image
import avatar from '../assets/img/images/ex_avatar.png';

// Conponent
import React, { useEffect, useReducer, useRef, useState } from 'react'
import ApexCharts from 'apexcharts'
import { ReactSVG } from 'react-svg';
import { Navigate, useNavigate, useHref } from 'react-router-dom';
import AxiosInstance from '../helpers/AxiosInstance.js';


const Discounts = (prop) => {
    const {host} = prop
    document.title = 'Informations - Users';
    const chartRef = useRef(null);

    const navigate = useNavigate();
    let currentTime = new Date();

    const changePage = (link) => {
        navigate(link);
    };

    const Swal = require('sweetalert2');

    {/** declare user storage */ }

    const initialState = {
        
        users: [],
        topUsers: [],
        bannedUsers: [],
        usersComment: [],
        blackUser: [],
        newUser: [],

        userPage: 1,
        topUsersPage: 1,
        bannedUsersPage: 1,
        usersCommentPage: 1,

        userTotalPage: 1,
        topUsersTotalPage: 1,
        bannedUsersTotalPage: 1,
        usersCommentTotalPage: 1,
    };

    const [data, dispatchData] = useReducer((state, action) => {
        switch (action.type) {
            case 'GET_USERS':
                return { ...state, users: action.payload };
            case 'GET_TOP_USERS':
                return { ...state, topUsers: action.payload };
            case 'GET_BANNED_USERS':
                return { ...state, bannedUsers: action.payload };
            case 'GET_USERS_COMMENT':
                return { ...state, usersComment: action.payload };
            case 'GET_BLACK_USER':
                return { ...state, blackUser: action.payload };
            case 'GET_NEW_USERS':
                return { ...state, newUser: action.payload };

            case 'SET_USERS_PAGE':
                return { ...state, userPage: action.payload };
            case 'SET_TOP_USERS_PAGE':
                return { ...state, topUsersPage: action.payload };
            case 'SET_BANNED_USERS_PAGE':
                return { ...state, bannedUsersPage: action.payload };
            case 'SET_USERS_COMMENT_PAGE':
                return { ...state, usersCommentPage: action.payload };

            case 'SET_USERS_TOTAL_PAGE':
                return { ...state, userTotalPage: action.payload };
            case 'SET_TOP_USERS_TOTAL_PAGE':
                return { ...state, topUsersTotalPage: action.payload };
            case 'SET_BANNED_USERS_TOTAL_PAGE':
                return { ...state, bannedUsersTotalPage: action.payload };
            case 'SET_USERS_COMMENT_TOTAL_PAGE':
                return { ...state, usersCommentTotalPage: action.payload };

            default:
                return state;
        }
    }, initialState)

    {/** End of declare user storage */ }

    {/** Get user's list */ }

    const loadUsers = async () => {
        try {
            const response = await AxiosInstance().get('/get-all-users.php');
            // only take 5 users
            const length = response.users.length;
            // const list = response.users.slice(length - 5, page * 5);
            let list = response.users.slice(data.userPage * 5 - 5, data.userPage * 5);
            dispatchData({ type: 'GET_USERS', payload: list });
            dispatchData({ type: 'SET_USERS_TOTAL_PAGE', payload: (Math.ceil(length / 5)) });
        } catch (error) {
            console.log("Fail to get users because of: " + error);
        }
    }

    useEffect(() => {

        loadUsers();
    }, [data.userPage]);

    {/** End of get user's list */ }

    {/** Get top user's list */ }

    const loadTopUsers = async () => {
        try {
            const response = await AxiosInstance().get('/get-top-users.php');
            const length = response.users.length;
            let list = response.users.slice(data.topUsersPage * 5 - 5, data.topUsersPage * 5);
            dispatchData({ type: 'GET_TOP_USERS', payload: list });
            dispatchData({ type: 'SET_TOP_USERS_TOTAL_PAGE', payload: (Math.ceil(length / 5)) });
        } catch (error) {
            console.log("Fail to get top users because of: " + error);
        }
    }

    useEffect(() => {
        loadTopUsers();
    }, [data.topUsersPage]);


    {/** End of get top user's list */ }

    {/** Get Banned user's list */ }

    const loadBannedUser = async () => {
        const response = await AxiosInstance().get('/get-banned-users.php');
        const length = response.users.length;
        let list = response.users.slice(data.topUsersPage * 5 - 5, data.topUsersPage * 5);
        dispatchData({ type: 'GET_BANNED_USERS', payload: list });
        dispatchData({ type: 'SET_BANNED_USERS_TOTAL_PAGE', payload: (Math.ceil(length / 5)) });
    }

    useEffect(() => {
        loadBannedUser();
    }, [data.bannedUsersPage])

    const unBannedUsers = async (reportID, userID, name, updateAt) => {
        Swal.fire({
            title: `Did you really want to enable ${name}`,
            text: `This user has been banned since ${updateAt}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            preConfirm: async () => {
                try {
                    const response = await AxiosInstance().post('/post-update-user-status.php', { id: userID });
                    loadBannedUser();
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        text: `Request failed: ${error}`
                    })
                }
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: 'success',
                    text: `${name} has been removed out of banned users`
                })
            }
        })
    }

    {/** End of banned user's list */ }

    {/** Get new users */ }

    const loadNewUsers = async () => {
        const response = await AxiosInstance().get('/get-new-users.php');
        dispatchData({ type: 'GET_NEW_USERS', payload: response.users })
    }

    useEffect(() => {
        loadNewUsers();
    }, [])

    {/** End get new users */ }

    {/** Get reports */ }

    const loadReports = async () => {
        const response = await AxiosInstance().get('/get-report-users.php');
        dispatchData({ type: 'GET_BLACK_USER', payload: response.users });
    }


    const ignoreReports = async (adminID, reportID) => {
        Swal.fire({
            title: 'Your reason ?!',
            text: 'This message is gonna show to the customer so response respectfully.',
            icon: 'question',
            input: "textarea",
            inputPlaceholder: "Type your message here...",
            inputAttributes: {
                "aria-label": "Type your message here"
            },
            showLoaderOnConfirm: true,
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return "Please our customer need reason.!";
                }
            },
            confirmButtonText: 'Send',
            preConfirm: async (resp) => {
                try {
                    const response = await AxiosInstance().post('/response-user-report.php', {
                        id: reportID,
                        reply: resp,
                        replyBy: adminID,
                    });
                    loadReports();

                } catch (error) {
                    Swal.showValidationMessage(`
                    Request failed: ${error}
                  `);
                }
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: 'success',
                    text: 'Your Reply has been successed send to the customer'
                })
            }
        })
    }


    const bannedUser = async (adminID, reportID, targetID) => {
        Swal.fire({
            title: 'Your reason ?!',
            text: 'This message is gonna show to the customer so response respectfully.',
            icon: 'warning',
            input: "textarea",
            inputPlaceholder: "Type your message here...",
            inputAttributes: {
                "aria-label": "Type your message here"
            },
            showLoaderOnConfirm: true,
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return "Please our customer need reason.!";
                }
            },
            confirmButtonText: 'Send',
            preConfirm: async (resp) => {
                try {
                    const response = await AxiosInstance().post('/response-user-report.php', {
                        id: reportID,
                        reply: resp,
                        replyBy: adminID,
                    });
                    const banned = await AxiosInstance().post('/banned-user.php', { id: targetID })
                    loadReports();

                } catch (error) {
                    Swal.showValidationMessage(`
                    Request failed: ${error}
                  `);
                }
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: 'success',
                    text: 'Your Reply has been successed send to the customer'
                })
            }
        })
    }

    useEffect(() => {
        loadReports();
    }, [])

    {/** End get reports */ }

    {/** Data board */ }
    useEffect(() => {
        let chart;
        if (chartRef.current) {
            chart = new ApexCharts(document.getElementById("reportsChart"), {
                series: [{
                    name: 'New Users',
                    data: [31, 40, 28, 51, 42, 82, 56],
                }, {
                    name: 'Partnership',
                    data: [11, 32, 45, 32, 34, 52, 41]
                }, {
                    name: 'Banned',
                    data: [15, 11, 32, 18, 9, 24, 11]
                }],
                chart: {
                    height: 350,
                    type: 'area',
                    toolbar: {
                        show: false
                    },
                },
                markers: {
                    size: 4
                },
                colors: ['#4154f1', '#2eca6a', '#ff771d'],
                fill: {
                    type: "gradient",
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.3,
                        opacityTo: 0.4,
                        stops: [0, 90, 100]
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth',
                    width: 2
                },
                xaxis: {
                    type: 'datetime',
                    categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
                },
                tooltip: {
                    x: {
                        format: 'dd/MM/yy HH:mm'
                    },
                }
            });
            chart.render();
        }
        return () => {
            if (chart) {
                chart.destroy();
            }
        };
    }, []);
    {/** End data board */ }

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
                                    <a className="dropdown-item d-flex align-items-center">
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
                        <a className="nav-link" data-bs-target="#forms-nav" data-bs-toggle="collapse">
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
                        <ul id="forms-nav" className="nav-content collapse show" data-bs-parent="#sidebar-nav">
                            <li>
                                <a onClick={() => changePage('/incomes/discount')} className='active'>
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
                        <a className="nav-link collapsed" href="users-profile.html">
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

            <main id="main" className="main">

                {/* <!-- ======= Main ======= --> */}
                <div className="pagetitle">
                    <h1>Users Dashboard</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a>Informations</a></li>
                            <li className="breadcrumb-item active">Users</li>
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
                                                    {/** The button will re render item if it getting press at another tab */}
                                                    <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#list-users-overview" onMouseDown={(e) => {
                                                        if (!e.target.classList.contains('active')) {
                                                            loadUsers();
                                                        }
                                                    }}>List</button>
                                                </li>

                                                <li className="nav-item">
                                                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#users-leaderboard" onMouseDown={(e) => {
                                                        if (e.target.classList.contains('active')) {
                                                            loadTopUsers()
                                                        }
                                                    }} >Leader Board</button>
                                                </li>

                                                <li className="nav-item">
                                                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#user-comments" onMouseDown={(e) => {
                                                        if (e.target.classList.contains('active')) {
                                                        }
                                                    }} >Comments</button>
                                                </li>

                                                <li className="nav-item">
                                                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#banned-users" onMouseDown={(e) => {
                                                        if (e.target.classList.contains('active')) {
                                                            loadBannedUser();
                                                        }
                                                    }} >Banned</button>
                                                </li>

                                            </ul>
                                            <div className="tab-content pt-2">

                                                <div className="tab-pane fade show active profile-overview" id="list-users-overview">

                                                    <div className="tab-title search nav">
                                                        <h5 className="card-title">Users List</h5>
                                                        <div className="datatable-search">
                                                            <input className="datatable-input" placeholder="Search..." type="search" title="Search within table" />
                                                        </div>

                                                        <nav aria-label="Page navigation example">
                                                            <ul className="pagination">
                                                                <li className="page-item">
                                                                    <a className="page-link" aria-label="Previous" style={{ cursor: 'pointer' }} onClick={() => {
                                                                        dispatchData({ type: 'SET_USERS_PAGE', payload: 1 })
                                                                    }}>
                                                                        <span aria-hidden="true">«</span>
                                                                    </a>
                                                                </li>
                                                                {
                                                                    Array.from({ length: data.userTotalPage }, (_, index) => {
                                                                        if (data.userTotalPage > 10) {
                                                                            if ((index >= data.userPage - 3 && index <= data.userPage + 1) || // 2 pages before and after current page
                                                                                index >= data.userTotalPage - 2) { // last 2 pages
                                                                                return (
                                                                                    <li className={`page-item ${data.userPage === index + 1 ? 'active' : ''}`} key={index + 1} style={{ cursor: 'pointer' }}>
                                                                                        <a className="page-link" onClick={() => data.userPage !== 1 ? dispatchData({ type: 'SET_USERS_PAGE', payload: index + 1 }) : null}>{index + 1}</a>
                                                                                    </li>
                                                                                );
                                                                            }
                                                                        } else {
                                                                            return (
                                                                                <li className={`page-item ${data.userPage === index + 1 ? 'active' : ''}`} key={index + 1} style={{ cursor: 'pointer' }}>
                                                                                    <a className="page-link" onClick={() => data.userPage !== data.userTotalPage ? dispatchData({ type: 'SET_USERS_PAGE', payload: index + 1 }) : null}>{index + 1}</a>
                                                                                </li>
                                                                            );
                                                                        }
                                                                    })
                                                                }
                                                                <li className="page-item">
                                                                    <a className="page-link" aria-label="Next" style={{ cursor: 'pointer' }} onClick={() => { dispatchData({ type: 'SET_USERS_PAGE', payload: data.userTotalPage }) }}>
                                                                        <span aria-hidden="true">»</span>
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </nav>
                                                    </div>

                                                    <table className="table table-borderless"
                                                    >
                                                        <thead>
                                                            <tr>
                                                                <th scope="col" style={{ textAlign: 'center' }}>Avatar</th>
                                                                <th scope="col">Name</th>
                                                                <th scope="col">Email</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {data.users.map((item, index) => (
                                                                <tr key={item.Id}>
                                                                    <th scope="row" style={{ textAlign: 'center' }}>
                                                                        <a><img src={item.Image ? `http://${host}/uploads/${item.Image}.jpg` : avatar} alt="" className="avatar" /></a>
                                                                    </th>
                                                                    <td>{item.Name}</td>
                                                                    <td className="fw-bold">{item.Email}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                {/* <!-- End List Users Overview Tab --> */}

                                                <div className="tab-pane fade profile-edit pt-3" id="users-leaderboard">

                                                    {/* <!-- Users LeaderBoard table --> */}
                                                    <div className="tab-title search nav">
                                                        <h5 className="card-title">Leader Board</h5>
                                                        <div className="datatable-search">
                                                            <input className="datatable-input" placeholder="Search..." type="search" title="Search within table" />
                                                        </div>

                                                        <nav aria-label="Page navigation example">
                                                            <ul className="pagination">
                                                                <li className="page-item">
                                                                    <a className="page-link" aria-label="Previous" style={{ cursor: 'pointer' }} onClick={() => {
                                                                        if (data.topUsersPage !== 1) {
                                                                            dispatchData({ type: 'SET_TOP_USERS_PAGE', payload: 1 });
                                                                        }
                                                                    }}>
                                                                        <span aria-hidden="true">«</span>
                                                                    </a>
                                                                </li>

                                                                {
                                                                    Array.from({ length: data.topUsersTotalPage }, (_, index) => {
                                                                        if (data.topUsersTotalPage > 10) {
                                                                            if ((index >= data.topUsersPage - 3 && index <= data.topUsersPage + 1) || // 2 pages before and after current page
                                                                                index >= data.topUsersTotalPage - 2) { // last 2 pages
                                                                                return (
                                                                                    <li className={`page-item ${data.topUsersPage === index + 1 ? 'active' : ''}`} key={index + 1} style={{ cursor: 'pointer' }}>
                                                                                        <a className="page-link" onClick={() => dispatchData({ type: 'SET_TOP_USERS_PAGE', payload: index + 1 })}>{index + 1}</a>
                                                                                    </li>
                                                                                );
                                                                            }
                                                                        } else {
                                                                            return (
                                                                                <li className={`page-item ${data.userPage === index + 1 ? 'active' : ''}`} key={index + 1} style={{ cursor: 'pointer' }}>
                                                                                    <a className="page-link" onClick={() => dispatchData({ type: 'SET_TOP_USERS_PAGE', payload: index + 1 })}>{index + 1}</a>
                                                                                </li>
                                                                            );
                                                                        }
                                                                    })
                                                                }

                                                                <li className="page-item">
                                                                    <a className="page-link" aria-label="Next" style={{ cursor: 'pointer' }} onClick={() => {
                                                                        if (data.topUsersPage !== data.topUsersTotalPage) {
                                                                            dispatchData({ type: 'SET_TOP_USERS_PAGE', payload: data.topUsersTotalPage });
                                                                        }
                                                                    }}>
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
                                                                <th scope="col">Rank</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {data.topUsers.map((item, index) => (
                                                                <tr key={index}>
                                                                    <th scope="row" style={{ textAlign: 'center' }}>
                                                                        <a><img src={item.Image ? `http://${host}/uploads/${item.Image}.jpg` : avatar} alt="" className="avatar" /></a>
                                                                    </th>
                                                                    <td>{item.Name}</td>
                                                                    <td>{item.Email}</td>
                                                                    <td className="fw-bold">{item.Rank}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                    {/* <!-- Users LeaderBoard table --> */}

                                                </div>

                                                <div className="tab-pane fade pt-3" id="user-comments">

                                                    {/* <!-- Comment Table --> */}
                                                    <div className="tab-title search nav">
                                                        <div className="datatable-search">
                                                            <input className="datatable-input" placeholder="Search..." type="search" title="Search within table" />
                                                        </div>

                                                        <nav aria-label="Page navigation example">
                                                            <ul className="pagination">
                                                                <li className="page-item">
                                                                    <a className="page-link" aria-label="Previous">
                                                                        <span aria-hidden="true">«</span>
                                                                    </a>
                                                                </li>
                                                                <li className="page-item active"><a className="page-link">1</a></li>
                                                                <li className="page-item"><a className="page-link">2</a></li>
                                                                <li className="page-item"><a className="page-link">3</a></li>
                                                                <li className="page-item"><a className="page-link">4</a></li>
                                                                <li className="page-item"><a className="page-link">5</a></li>
                                                                <li className="page-item"><a className="page-link">6</a></li>
                                                                <li className="page-item"><a className="page-link">7</a></li>
                                                                <li className="page-item">
                                                                    <a className="page-link" aria-label="Next">
                                                                        <span aria-hidden="true">»</span>
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </nav>
                                                    </div>
                                                    {/* <!-- End Comment Table --> */}

                                                    <h5 className="card-title">Nothing</h5>

                                                </div>

                                                <div className="tab-pane fade pt-3" id="banned-users">

                                                    {/* <!-- Users Banned List table --> */}
                                                    <div className="tab-title search nav">
                                                        <h5 className="card-title">Banned Users</h5>
                                                        <div className="datatable-search">
                                                            <input className="datatable-input" placeholder="Search..." type="search" title="Search within table" />
                                                        </div>

                                                        <nav aria-label="Page navigation example">
                                                            <ul className="pagination">
                                                                <li className="page-item">
                                                                    <a className="page-link" style={{ cursor: 'pointer' }} aria-label="Previous" onClick={() => {
                                                                        if (data.bannedUsersPage !== 1) {
                                                                            dispatchData({ type: 'SET_BANNED_USERS_PAGE', payload: data.bannedUsersPage - 1 })
                                                                        }
                                                                    }}>
                                                                        <span aria-hidden="true">«</span>
                                                                    </a>
                                                                </li>

                                                                {
                                                                    Array.from({ length: data.bannedUsersTotalPage }, (_, index) => {
                                                                        if (data.userTotalPage > 10) {
                                                                            if ((index >= data.bannedUsersPage - 2 && index <= data.bannedUsersPage + 1) || // 2 pages before and after current page
                                                                                index >= data.bannedUsersTotalPage - 3) { // last 2 pages
                                                                                return (
                                                                                    <li className={`page-item ${data.bannedUsersPage === index + 1 ? 'active' : ''}`} key={index + 1} style={{ cursor: 'pointer' }}>
                                                                                        <a className="page-link" onClick={() => dispatchData({ type: 'SET_BANNED_USERS_PAGE', payload: index + 1 })}>{index + 1}</a>
                                                                                    </li>
                                                                                );
                                                                            }
                                                                        } else {
                                                                            return (
                                                                                <li className={`page-item ${data.bannedUsersPage === index + 1 ? 'active' : ''}`} key={index + 1} style={{ cursor: 'pointer' }}>
                                                                                    <a className="page-link" onClick={() => dispatchData({ type: 'SET_BANNED_USERS_PAGE', payload: index + 1 })}>{index + 1}</a>
                                                                                </li>
                                                                            );
                                                                        }
                                                                    })
                                                                }
                                                                <li className="page-item">
                                                                    <a className="page-link" style={{ cursor: 'pointer' }} aria-label="Next" onClick={() => {
                                                                        if (data.bannedUsersPage !== 1) {
                                                                            dispatchData({ type: 'SET_BANNED_USERS_PAGE', payload: data.bannedUsersPage})
                                                                        }
                                                                    }}>
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
                                                                <th scope="col">Get Banned Since</th>
                                                                <th scope="col">Action</th>
                                                            </tr>
                                                        </thead>
                                                        {data.bannedUser ? <tbody>

                                                            {data.bannedUsers.map((item, index) => (
                                                                <tr key={index}>
                                                                    <th scope="row" style={{ textAlign: 'center' }}>
                                                                        <a><img src={item.avatar || avatar} alt="" className="avatar" /></a>
                                                                    </th>
                                                                    <td>{item.Name}</td>
                                                                    <td>{item.UpdateAt}</td>
                                                                    <td>
                                                                        <button type="button" className="btn btn-danger btn-sm" onClick={() => unBannedUsers(item.Id, item.Name, item.UpdateAt)}>Enable User</button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody> 
                                                        :
                                                        <tbody>
                                                                <tr>
                                                                    <td colSpan="4">No banned users found.</td>
                                                                </tr>
                                                        </tbody>}
                                                    </table>
                                                    {/* <!-- Users Banned List table --> */}

                                                </div>

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


                            {/* <!-- Recent Activity --> */}
                            <div className="card">
                                <div className="filter">
                                    <a className="icon" data-bs-toggle="dropdown">
                                        <ReactSVG
                                            src={more}
                                        />
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                        <li className="dropdown-header text-start">
                                            <h6>Filter</h6>
                                        </li>

                                        <li><a className="dropdown-item">Today</a></li>
                                        <li><a className="dropdown-item">This Month</a></li>
                                        <li><a className="dropdown-item">This Year</a></li>
                                    </ul>
                                </div>

                                <div className="card-body">
                                    <h5 className="card-title">Recent Activity <span>| Today</span></h5>

                                    <div className="activity">

                                        <div className="activity-item d-flex">
                                            <div className="activite-label">32 min</div>
                                            <div className="activity-content">
                                                Quia quae rerum <a className="fw-bold text-dark">explicabo officiis</a> beatae
                                            </div>
                                        </div>
                                        {/* <!-- End activity item--> */}

                                        <div className="activity-item d-flex">
                                            <div className="activite-label">56 min</div>
                                            <div className="activity-content">
                                                Voluptatem blanditiis blanditiis eveniet
                                            </div>
                                        </div>
                                        {/* <!-- End activity item--> */}

                                        <div className="activity-item d-flex">
                                            <div className="activite-label">2 hrs</div>
                                            <div className="activity-content">
                                                Voluptates corrupti molestias voluptatem
                                            </div>
                                        </div>
                                        {/* <!-- End activity item--> */}

                                        <div className="activity-item d-flex">
                                            <div className="activite-label">1 day</div>
                                            <div className="activity-content">
                                                Tempore autem saepe <a className="fw-bold text-dark">occaecati voluptatem</a> tempore
                                            </div>
                                        </div>
                                        {/* <!-- End activity item--> */}

                                        <div className="activity-item d-flex">
                                            <div className="activite-label">2 days</div>
                                            <div className="activity-content">
                                                Est sit eum reiciendis exercitationem
                                            </div>
                                        </div>
                                        {/* <!-- End activity item--> */}

                                        <div className="activity-item d-flex">
                                            <div className="activite-label">4 weeks</div>
                                            <div className="activity-content">
                                                Dicta dolorem harum nulla eius. Ut quidem quidem sit quas
                                            </div>
                                        </div>
                                        {/* <!-- End activity item--> */}

                                    </div>

                                </div>
                            </div>
                            {/* <!-- End Recent Activity --> */}


                        </div>
                        {/* <!-- End Right side columns --> */}

                    </div>
                </section>
                {/* <!-- End Secion --> */}

            </main>
            {/* <!-- End Main --> */}
        </div >
    )
}

export default Discounts