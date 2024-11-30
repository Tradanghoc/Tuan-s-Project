
function createID(prefix) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = prefix;
    for (let i = 0; i < 17; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

const lastName = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Vũ',
    'Võ', 'Phan', 'Trương', 'Bùi', 'Đặng', 'Đỗ', 'Ngô', 'Hồ', 'Dương', 'Đinh'];

const middleName = ['Thị', 'Văn', 'Đình', 'Đức', 'Quốc', 
    'Văn', 'Thành', 'Hữu', 'Văn', 'Minh', 'Thế']

const firstName = [
    'Hồng', 'Dũng', 'Tùng', 'Hưng', 'Hải', 'Hào', 'Huy', 'Hùng',
    'Hà', 'Hạnh', 'Hoa', 'Hương', 'Huyền', 'Hàm',
    'Duy', 'Tuấn', 'Tú', 'An', 'Anh', 'Bình', 'Bảo', 'Cường', 'Chí', 'Chinh',
    'Danh', 'Dương', 'Đạt', 'Đức', 'Đăng', 'Đông', 'Điền', 'Định',
    'Đồng', 'Đường', 'Đan', 'Đào', 'Đinh', 'Đoàn', 'Giang', 'Giao', 'Ngọc',
    'Phúc', 'Phú', 'Phong', 'Quân', 'Quang', 'Quyền', 'Sơn', 'Tâm', 'Tân',
];

function randomAdminName() {
    const first = firstName[Math.floor(Math.random() * firstName.length)];
    let middle = '';
    let last = '';

    while (middle.length < 2 || middle === last || middle === first) {
        middle = middleName[Math.floor(Math.random() * middleName.length)];
    }

    while (last.length < 2 || middle === last || last === first) {
        last = lastName[Math.floor(Math.random() * lastName.length)];
    }
    return last.concat(' ', middle, ' ', first);
}

function randomDate() {
    let startDate = new Date('2023-01-01T00:00:00');
    let endDate = new Date('2024-06-30T23:59:59');
    return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
}

function conditionDate(start) {
    let endDate = new Date('2024-06-30T23:59:59');
    return new Date(start.getTime() + Math.random() * (endDate.getTime() - start.getTime()));
}

function formatDate(date) {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    let seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

let createAdmin = (num) => {
    let query = "INSERT INTO admin ( `Id`,`Name`,`Email`,`Password`,`Job`,`CreateAt`,`UpdateAt`,`DeleteAt`) VALUES";
    let imgQuery = "INSERT INTO images ( `Id`,`OwnerID`) VALUES";
    for (let i = 0; i < num; i++) {
        const name = randomAdminName();
        const id = createID('USR');
        const imageID = createID('IMG');
        const normalizeName = name.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
        const email = normalizeName.toLowerCase() + '@gmail.com';
        const job = Math.floor(Math.random() * 20 ) <= 15 ? 'Admin' : 'Manager';
        const date = randomDate();
        const createAt = formatDate(date);
        const updateAt = formatDate(conditionDate(date));
        query = query.concat(`('${id}','${name}','${email}','123456', '${job}', '${createAt}', '${updateAt}', NULL)`);
        imgQuery = imgQuery.concat(`('${imageID}','${id}')`);
        if (i < num - 1) {
            query = query.concat(',')
            imgQuery = imgQuery.concat(`, `);
        };
    }
    console.log(query + ';')
    return imgQuery + ';';
}

console.log(createAdmin(50));