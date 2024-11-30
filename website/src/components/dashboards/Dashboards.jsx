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

function changeFilter(event, id = 'new-user-card-title-span') {
    document.getElementById(id).innerText = event.target.innerText;
}

const Dashboards = (prop) => {
    const { host, adminID } = prop;
    document.title = 'Informations - Users';
    const chartRef = useRef(null);
    const navigate = useNavigate();
    const [color, setColor] = useState('#4154f1');

    const changePage = (link) => {
        navigate(link);
    };

    {/** declare user storage */ }

    const initialGrowthState = {
        userState: '',
        revenueState: '',
        bannedState: '',

        userGrowth: 0,
        revenueGrowth: 0,
        bannedGrowth: 0,

        userTime: 'Today',
        revenueTime: 'Today',
        bannedTime: 'Today',

        userNumber: 0,
        revenueNumber: 0,
        bannedNumber: 0,

        xaxis: [],
        userSeries: [],
        revenueSeries: [],
        bannedSeries: [],
        dataBoardTime: 'Today',
        dataMin: 0,
        dataMax: 0,

        recentOrders: [],
    }

    const [growth, dispatchGrowth] = useReducer((state, action) => {
        switch (action.type) {
            case 'USER_STATE':
                return { ...state, userState: action.payload };
            case 'REVENUE_STATE':
                return { ...state, revenueState: action.payload };
            case 'BANNED_STATE':
                return { ...state, bannedState: action.payload };

            case 'USER_GROWTH':
                return { ...state, userGrowth: action.payload };
            case 'REVENUE_GROWTH':
                return { ...state, revenueGrowth: action.payload };
            case 'BANNED_GROWTH':
                return { ...state, bannedGrowth: action.payload };

            case 'USER_TIME':
                return { ...state, userTime: action.payload };
            case 'REVENUE_TIME':
                return { ...state, revenueTime: action.payload };
            case 'BANNED_TIME':
                return { ...state, bannedTime: action.payload };

            case 'USER_NUMBER':
                return { ...state, userNumber: action.payload };
            case 'REVENUE_NUMBER':
                return { ...state, revenueNumber: action.payload };
            case 'BANNED_NUMBER':
                return { ...state, bannedNumber: action.payload };

            case 'DATA_BOARD_TIME':
                return { ...state, dataBoardTime: action.payload };
            case 'X_AXIS':
                return { ...state, xaxis: action.payload };
            case 'USER_SERIES':
                return { ...state, userSeries: action.payload };
            case 'REVENUE_SERIES':
                return { ...state, revenueSeries: action.payload };
            case 'BANNED_SERIES':
                return { ...state, bannedSeries: action.payload };
            case 'DATA_MIN':
                return { ...state, dataMin: action.payload };
            case 'DATA_MAX':
                return { ...state, dataMax: action.payload };

            case 'RECENT_ORDERS':
                return { ...state, recentOrders: action.payload };
            default:
                return state;
        }
    }, initialGrowthState);

    {/** End of declare user storage */ }

    const calculateGrowthRate = (present, previous) => {
        if (previous != 0 && previous != present) {
            return Math.round(((present - previous) / previous) * 100);
        } else {
            if (previous == 0) {
                return 100;
            }
            else {
                return 0;
            }
        }
    }

    {/** Start of getting user statistics */ }

    async function getNewUsersStatistic() {
        const response = await AxiosInstance().get('/get-new-users-statistics.php');
        if (response.status) {
            const statistic = response.statistics;
            switch (growth.userTime) {
                case 'Today':
                    const cal = calculateGrowthRate(statistic.TODAY, statistic.PRE_DAY);
                    dispatchGrowth({ type: 'USER_STATE', payload: cal < 0 ? 'Decrease' : 'Increase' });
                    dispatchGrowth({ type: 'USER_GROWTH', payload: cal });
                    dispatchGrowth({ type: 'USER_NUMBER', payload: statistic.TODAY });
                    break;
                case 'This Month':
                    const cal1 = calculateGrowthRate(statistic.THIS_MONTH, statistic.PRE_MONTH);
                    dispatchGrowth({ type: 'USER_STATE', payload: cal1 < 0 ? 'Decrease' : 'Increase' });
                    dispatchGrowth({ type: 'USER_GROWTH', payload: cal1 });
                    dispatchGrowth({ type: 'USER_NUMBER', payload: statistic.THIS_MONTH });
                    break;
                case 'This Year':
                    const cal2 = calculateGrowthRate(statistic.THIS_YEAR, statistic.PRE_YEAR);
                    dispatchGrowth({ type: 'USER_STATE', payload: cal2 < 0 ? 'Decrease' : 'Increase' });
                    dispatchGrowth({ type: 'USER_GROWTH', payload: cal2 });
                    dispatchGrowth({ type: 'USER_NUMBER', payload: statistic.THIS_YEAR });
                    break;
            }
        } else {
            dispatchGrowth({ type: 'USER_STATE', payload: 'No record' });
            dispatchGrowth({ type: 'USER_GROWTH', payload: 0 });
            dispatchGrowth({ type: 'USER_NUMBER', payload: 0 });
        }

    }

    useEffect(() => {
        getNewUsersStatistic();
    }, [growth.userTime])

    {/** End of getting user statistics */ }

    {/** Start of getting revenue statistics */ }

    async function getRevenueStatistic() {
        const response = await AxiosInstance().get('/get-partnership-revenue-statistics.php');
        if (response.status) {
            const statistic = response.revenue;
            switch (growth.revenueTime) {
                case 'Today':
                    const cal = calculateGrowthRate(statistic.TODAY, statistic.PRE_DAY);
                    dispatchGrowth({ type: 'REVENUE_STATE', payload: cal < 0 ? 'Decrease' : 'Increase' });
                    dispatchGrowth({ type: 'REVENUE_GROWTH', payload: cal });
                    dispatchGrowth({ type: 'REVENUE_NUMBER', payload: statistic.TODAY });
                    break;
                case 'This Month':
                    const cal1 = calculateGrowthRate(statistic.THIS_MONTH, statistic.PRE_MONTH);
                    dispatchGrowth({ type: 'REVENUE_STATE', payload: cal1 < 0 ? 'Decrease' : 'Increase' });
                    dispatchGrowth({ type: 'REVENUE_GROWTH', payload: cal1 });
                    dispatchGrowth({ type: 'REVENUE_NUMBER', payload: statistic.THIS_MONTH });
                    break;
                case 'This Year':
                    const cal2 = calculateGrowthRate(statistic.THIS_YEAR, statistic.PRE_YEAR);
                    dispatchGrowth({ type: 'REVENUE_STATE', payload: cal2 < 0 ? 'Decrease' : 'Increase' });
                    dispatchGrowth({ type: 'REVENUE_GROWTH', payload: cal2 });
                    dispatchGrowth({ type: 'REVENUE_NUMBER', payload: statistic.THIS_YEAR });
                    break;
            }
        } else {
            dispatchGrowth({ type: 'REVENUE_STATE', payload: 'No record' });
            dispatchGrowth({ type: 'REVENUE_GROWTH', payload: 0 });
            dispatchGrowth({ type: 'REVENUE_NUMBER', payload: 0 });
        }
    }

    useEffect(() => {
        getRevenueStatistic();
    }, [growth.revenueTime])

    {/** End of getting revenue statistics */ }

    {/** Start of getting banned statistics */ }

    async function getBannedStatistic() {
        const response = await AxiosInstance().get('/get-all-banned-statistics.php');

        if (response.status) {
            const statistic = response.banned;
            switch (growth.bannedTime) {
                case 'Today':
                    const cal = calculateGrowthRate(statistic.TODAY, statistic.PRE_DAY);
                    dispatchGrowth({ type: 'BANNED_STATE', payload: cal < 0 ? 'Decrease' : 'Increase' });
                    dispatchGrowth({ type: 'BANNED_GROWTH', payload: cal });
                    dispatchGrowth({ type: 'BANNED_NUMBER', payload: statistic.TODAY });
                    break;
                case 'This Month':
                    const cal1 = calculateGrowthRate(statistic.THIS_MONTH, statistic.PRE_MONTH);
                    dispatchGrowth({ type: 'BANNED_STATE', payload: cal1 < 0 ? 'Decrease' : 'Increase' });
                    dispatchGrowth({ type: 'BANNED_GROWTH', payload: cal1 });
                    dispatchGrowth({ type: 'BANNED_NUMBER', payload: statistic.THIS_MONTH });
                    break;
                case 'This Year':
                    const cal2 = calculateGrowthRate(statistic.THIS_YEAR, statistic.PRE_YEAR);
                    dispatchGrowth({ type: 'BANNED_STATE', payload: cal2 < 0 ? 'Decrease' : 'Increase' });
                    dispatchGrowth({ type: 'BANNED_GROWTH', payload: cal2 });
                    dispatchGrowth({ type: 'BANNED_NUMBER', payload: statistic.THIS_YEAR });
                    break;
                case 'Total':
                    dispatchGrowth({ type: 'BANNED_STATE', payload: 'All of the banned' });
                    dispatchGrowth({ type: 'BANNED_GROWTH', payload: 0 });
                    dispatchGrowth({ type: 'BANNED_NUMBER', payload: Object.values(statistic).reduce((a, b) => a + b, 0) });
            }
        } else {
            dispatchGrowth({ type: 'BANNED_STATE', payload: 'No record' });
            dispatchGrowth({ type: 'BANNED_GROWTH', payload: 0 });
            dispatchGrowth({ type: 'BANNED_NUMBER', payload: 0 });
        }
    }

    useEffect(() => {
        getBannedStatistic();
    }, [growth.bannedTime])

    {/** End of getting banned statistics */ }

    {/** Start of getting orders by status */ }

    const getOrdersByStatus = async (status) => {
        try {
            const response = await AxiosInstance().post('/get-all-orders-by-status.php', { status });
            if (response.status) {
                dispatchGrowth({ type: 'RECENT_ORDERS', payload: response.data });
            } else {
            }
        } catch (error) {
            console.log(error)
        }
    }

    {/** End of getting orders by status */ }

    {/** Start of getting data for data board */ }

    const getBoardData = async () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const timeLine = growth.dataBoardTime;
        let timePoints = [];
        switch (growth.dataBoardTime) {
            case 'Today':
                timePoints = Array.from({ length: today.getHours() + 1 }, (_, i) => `${i}:00`);
                break;
            case 'This Month':
                timePoints = Array.from({ length: today.getDate() + 1 }, (_, i) => `${year}-${month + 1}-${i + 1}`);
                break;
            case 'This Year':
                timePoints = Array.from({ length: month + 1 }, (_, i) => `${year}-${i + 1}-1`);
                break;
        }
        const body = {
            timeLine: timeLine,
            timePoints
        }
        const response = await AxiosInstance().post('/get-all-databoard-statistics.php', body);
        console.log("319 response:",response)
        const result = await response.data;
        console.log(result)
        dispatchGrowth({ type: 'DATA_MIN', payload: result.min });
        dispatchGrowth({ type: 'DATA_MAX', payload: result.max });
        dispatchGrowth({ type: 'USER_SERIES', payload: result.output.users });
        dispatchGrowth({ type: 'REVENUE_SERIES', payload: result.output.revenues });
        dispatchGrowth({ type: 'BANNED_SERIES', payload: result.output.banneds });
        dispatchGrowth({ type: 'X_AXIS', payload: timePoints });

        ApexCharts.exec('dashboard', 'updateOptions', {
            series: [{
                name: 'New Users',
                data: result.output.users,
            }, {
                name: 'Partnership',
                data: result.output.revenues
            }, {
                name: 'Banned',
                data: result.output.banneds
            }],
            xaxis: {
                categories: timePoints
            },
        })
    }

    {/** End of getting data for data board */ }


    {/** Data board */ }
    useEffect(() => {
        getOrdersByStatus('Waiting');
        let chart;
        if (chartRef.current) {
            chart = new ApexCharts(document.getElementById("reportsChart"), {
                series: [{
                    name: 'New Users',
                    data: growth.userSeries,
                }, {
                    name: 'Partnership',
                    data: growth.revenueSeries
                }, {
                    name: 'Banned',
                    data: growth.bannedSeries
                }],
                chart: {
                    id: 'dashboard',
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
                        // stops: [0,100,200]
                        stops: [growth.dataMin, growth.dataMax, growth.dataMax + 10]
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
                    categories: growth.xaxis
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

    useEffect(() => {
        getBoardData()

    }, [growth.dataBoardTime]);
    {/** End data board */ }

    function changeDotColor(status) {
        switch (status) {
            case 'Waiting':
                return '#a39a00';
            case 'Done':
                return '#0d80ff';
            case 'Delivering':
                return 'bg-warning';
            case 'Delivered':
                return '#ff7f00';
            case 'Cancelled':
            case 'Denied':
                return '#dc3545';
            default:
                return '#dc3545';
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
                        <a className="nav-link">
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
                    <h1>Admin Dashboard</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item active">Dashboard</li>
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

                                {/* <!-- New User Card --> */}
                                <div className="col-xxl-4 col-md-6">
                                    <div className="card info-card left-card">

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

                                                <li><a className="dropdown-item" onClick={(event) => {
                                                    changeFilter(event, 'new-user-card-title-span')
                                                    dispatchGrowth({ type: 'USER_TIME', payload: 'Today' })
                                                }}>Today</a></li>
                                                <li><a className="dropdown-item" onClick={(event) => {
                                                    changeFilter(event, 'new-user-card-title-span')
                                                    dispatchGrowth({ type: 'USER_TIME', payload: 'This Month' })
                                                }}>This Month</a></li>
                                                <li><a className="dropdown-item" onClick={(event) => {
                                                    changeFilter(event, 'new-user-card-title-span')
                                                    dispatchGrowth({ type: 'USER_TIME', payload: 'This Year' })
                                                }}>This Year</a></li>
                                            </ul>
                                        </div>

                                        <div className="card-body">
                                            <h5 className="card-title">New Users | <span id='new-user-card-title-span'>Today</span></h5>

                                            <div className="d-flex align-items-center">
                                                <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                                    <ReactSVG
                                                        src={new_user}
                                                        className='left-icon'
                                                    />
                                                </div>
                                                <div className="ps-3">
                                                    <h6>{growth.userNumber}</h6>
                                                    <span className={`small pt-1 fw-bold ${growth.userGrowth < 0 ? 'text-danger' : 'text-success'}`}>{growth.userGrowth}%</span>
                                                    <span className="text-muted small pt-2 ps-1">{growth.userState}</span>

                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                {/* <!-- End New User Card --> */}


                                {/* <!-- Partnership Card --> */}
                                <div className="col-xxl-4 col-md-6">
                                    <div className="card info-card middle-card">

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

                                                <li><a className="dropdown-item"
                                                    onClick={(event) => {
                                                        changeFilter(event, 'partnership-card-title-span')
                                                        dispatchGrowth({ type: 'REVENUE_TIME', payload: 'Today' })
                                                    }}
                                                >Today</a></li>
                                                <li><a className="dropdown-item"
                                                    onClick={(event) => {
                                                        changeFilter(event, 'partnership-card-title-span')
                                                        dispatchGrowth({ type: 'REVENUE_TIME', payload: 'This Month' })
                                                    }}
                                                >This Month</a></li>
                                                <li><a className="dropdown-item"
                                                    onClick={(event) => {
                                                        changeFilter(event, 'partnership-card-title-span')
                                                        dispatchGrowth({ type: 'REVENUE_TIME', payload: 'This Year' })
                                                    }}
                                                >Year</a></li>
                                            </ul>
                                        </div>

                                        <div className="card-body">
                                            <h5 className="card-title">Partnership | <span id='partnership-card-title-span'>Today</span></h5>

                                            <div className="d-flex align-items-center">
                                                <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                                    <ReactSVG
                                                        src={partnership}
                                                        className='middle-icon'
                                                    />
                                                </div>
                                                <div className="ps-3">
                                                    <h6>${growth.revenueNumber}</h6>
                                                    <span className={`text-success small pt-1 fw-bold ${growth.revenueGrowth < 0 ? 'text-danger' : 'text-success'}`}>{growth.revenueGrowth}%</span>
                                                    <span className="text-muted small pt-2 ps-1">{growth.revenueState}</span>

                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                {/* <!-- End Partnership Card --> */}


                                {/* <!-- Users Banned Card --> */}
                                <div className="col-xxl-4 col-xl-12">

                                    <div className="card info-card right-card">

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

                                                <li><a className="dropdown-item"
                                                    onClick={(event) => {
                                                        changeFilter(event, 'banned-card-title-span')
                                                        dispatchGrowth({ type: 'BANNED_TIME', payload: 'Today' })
                                                    }}
                                                >Today</a></li>
                                                <li><a className="dropdown-item"
                                                    onClick={(event) => {
                                                        changeFilter(event, 'banned-card-title-span')
                                                        dispatchGrowth({ type: 'BANNED_TIME', payload: 'This Month' })
                                                    }}
                                                >This Month</a></li>
                                                <li><a className="dropdown-item"
                                                    onClick={(event) => {
                                                        changeFilter(event, 'banned-card-title-span')
                                                        dispatchGrowth({ type: 'BANNED_TIME', payload: 'This Year' })
                                                    }}
                                                >This Year</a></li>
                                                <li><a className="dropdown-item"
                                                    onClick={(event) => {
                                                        changeFilter(event, 'banned-card-title-span')
                                                        dispatchGrowth({ type: 'BANNED_TIME', payload: 'Total' })
                                                    }}
                                                >Total</a></li>
                                            </ul>
                                        </div>

                                        <div className="card-body">
                                            <h5 className="card-title">Banned | <span id='banned-card-title-span'>Today</span></h5>

                                            <div className="d-flex align-items-center">
                                                <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                                    <ReactSVG
                                                        src={user_banned}
                                                        className='right-icon'
                                                    />
                                                </div>
                                                <div className="ps-3">
                                                    <h6>{growth.bannedNumber}</h6>
                                                    <span className="text-danger small pt-1 fw-bold">{growth.bannedGrowth}%</span> <span className="text-muted small pt-2 ps-1">{growth.bannedState}</span>

                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                </div>
                                {/* <!-- End Users Banned Card --> */}


                                {/* <!-- Reports --> */}
                                <div className="col-12">
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

                                                <li><a className="dropdown-item" onClick={(event) => {
                                                    changeFilter(event, 'reports-card-title-span')
                                                    dispatchGrowth({ type: 'DATA_BOARD_TIME', payload: 'Today' })
                                                }}>Today</a></li>
                                                <li><a className="dropdown-item" onClick={(event) => {
                                                    changeFilter(event, 'reports-card-title-span')
                                                    dispatchGrowth({ type: 'DATA_BOARD_TIME', payload: 'This Month' })
                                                }}>This Month</a></li>
                                                <li><a className="dropdown-item" onClick={(event) => {
                                                    changeFilter(event, 'reports-card-title-span')
                                                    dispatchGrowth({ type: 'DATA_BOARD_TIME', payload: 'This Year' })
                                                }}>This Year</a></li>
                                            </ul>
                                        </div>

                                        <div className="card-body">
                                            <h5 className="card-title">Reports / <span id='reports-card-title-span'>Today</span></h5>


                                            {/* <!-- Line Chart --> */}
                                            <div id="reportsChart" ref={chartRef}></div>

                                            {/* <!-- End Line Chart --> */}

                                        </div>

                                    </div>
                                </div>
                                {/* <!-- End Reports --> */}
                            </div>
                        </div>
                        {/* <!-- End Left side columns --> */}


                        {/* <!-- Right side columns --> */}
                        <div className="col-lg-4">


                            {/* <!-- Recent Activity Orders --> */}
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

                                        <li><a className="dropdown-item" onClick={(event) => {
                                            changeFilter(event, 'recent-activity-order-card-title-span', 'Waiting')
                                            getOrdersByStatus('Waiting')

                                        }}>Waiting</a></li>
                                        <li><a className="dropdown-item" onClick={(event) => {
                                            changeFilter(event, 'recent-activity-order-card-title-span', 'In Process')
                                            getOrdersByStatus('In Process')
                                        }}>In Process</a></li>
                                        <li><a className="dropdown-item" onClick={(event) => {
                                            changeFilter(event, 'recent-activity-order-card-title-span', 'Approve')
                                            getOrdersByStatus('Approve')
                                        }}>Approve</a></li>
                                        <li><a className="dropdown-item" onClick={(event) => {
                                            changeFilter(event, 'recent-activity-order-card-title-span', 'Denied')
                                            getOrdersByStatus('Denied')
                                        }}>Denied</a></li>
                                        <li><a className="dropdown-item" onClick={(event) => {
                                            changeFilter(event, 'recent-activity-order-card-title-span', 'Made')
                                            getOrdersByStatus('Made')
                                        }}>Made</a></li>
                                        <li><a className="dropdown-item" onClick={(event) => {
                                            changeFilter(event, 'recent-activity-order-card-title-span', 'In Delivery')
                                            getOrdersByStatus('In Delivery')
                                        }}>In Delivery</a></li>
                                        <li><a className="dropdown-item" onClick={(event) => {
                                            changeFilter(event, 'recent-activity-order-card-title-span', 'Done')
                                            getOrdersByStatus('Done')
                                        }}>Done</a></li>
                                    </ul>
                                </div>

                                <div className="card-body">
                                    <h5 className="card-title">Recent Activity Orders | <span id='recent-activity-order-card-title-span'>Waiting</span>
                                    </h5>

                                    <div className="activity">

                                        {
                                            growth.recentOrders.length !== 0 ?
                                                growth.recentOrders.map((order, index) => {

                                                    return (
                                                        <div className="activity-item d-flex" key={index}>
                                                            <div className="activite-label" style={{
                                                                '--dot-background': changeDotColor(order.Status)
                                                            }}>{order.Status}</div>
                                                            <div className="activity-content">
                                                                {order.OrderItems}
                                                            </div>
                                                        </div>
                                                    )
                                                }) :
                                                <div className="activity-item d-flex">
                                                    <div className="activite-label">No record</div>
                                                </div>

                                        }
                                        {/* <!-- End activity item--> */}

                                    </div>

                                </div>
                            </div>
                            {/* <!-- End Recent Activity Orders --> */}


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

export default Dashboards