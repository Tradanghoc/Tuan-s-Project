const fs = require('fs');

function createID(prefix) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = prefix;
    for (let i = 0; i < 17; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

const createBy = [
    "ADMkdnMcKr0k5MRinyi4",
    "ADMLNMmHy6jURybJOLdz",
    "ADMHlTvrfozUc7oJVlT0",
    "ADM7yovk1KCswp3CY4h0",
    "ADMGpZQaFlZDlmz66HnT",
    "ADMSRlNhPajeVEHTVV1E",
    "ADM2SoZFtj1H29QvtDas",
    "ADMdUXKHTziyt1dmmKgo",
    "ADMX8uvEW7lrCnV9YV7S",
    "ADMGEPhUIZUMU5p6EfqA",
    "ADMwDdQ3zvCqttN5NSBB",
    "ADMp2kRdhw5yBiRtDlUZ",
    "ADMdCUTc28JcgTaXNcHY",
    "ADMnwHKhSMRf5E5lsDJG",
    "ADMj0Vm95Uu2EFBzOVeQ",
    "ADMrFzQqANlHnqeyNg45",
    "ADMQPMBntqGV6tBBulOC",
    "ADMTktyX5KqOlGVDTrFl",
    "ADMzg5dQRenPR7vBJb1V",
    "ADMXnxUd6Fgib30Cx8f5",
    "ADMyxvFhfIyqe03FhHTa",
    "ADMLFp9O3yqTr8iMc3Rg",
    "ADMPD641wvK14TDsrFF4",
    "ADMWKRNpuon1EM1Ep0ry",
    "ADMZzlM7Lo6hcFSk1acm",
    "ADMqlP4PLXgehtu16WUR",
    "ADMf3vOzz35wB7yyoQjA",
    "ADMGW7RKhtMhE3SwgzD8",
    "ADM6Wjunhc6pmy9LqXim",
    "ADMnQqNhJtzPFFW2kXtV",
    "ADMoKjTaB63DaClaJcBv",
    "ADMU0pQWIV28c3UADW57",
    "ADMLVYkqvb5QiGYKyaVz",
    "ADMVgeMsbRuwDq7t5zU9",
    "ADMiXLmsMo1eczdksdhl",
    "ADMNR2dSnpobnKHz95KN",
    "ADM41UzWkFBe49GzRock",
    "ADMKnMohiDg0B2RnGsar",
    "ADMu69sOU1FBlv3bL27u",
    "ADMNLC2crUjlyWN9fCTs",
    "ADMoNHPGBPTQhX2PuSXk",
    "ADM7DsGjgRahjpvjN8OS",
    "ADMnDU5cubMTOy7j48DU",
    "ADMquTv5hh8SDkyPlOLw",
    "ADMUcZyAxTot80ZnJO9u",
    "ADM16hBFlXksiDb1Sarb",
    "ADMcpsK31xDPcrE6lkmE",
    "ADMyCS5pofsXT7s6COxk",
    "ADM8qdaHNoYXKWdRQACL",
    "ADMV9v8qczEuKfkLcCy0",
]

function createCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < 6; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

function randomDate() {
    let startDate = new Date('2023-01-01T00:00:00');
    let endDate = new Date('2024-06-30T23:59:59');
    return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
}

function conditionDate(start) {
    let date = new Date(start.replace(' ', 'T') + '.000Z');
    let endDate = new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000);
    return new Date(date.getTime() + Math.random() * (endDate.getTime() - date.getTime()));
}

function conditionDate2(start, end) {
    let date = new Date(start.replace(' ', 'T') + '.000Z');
    let endDate = new Date(end.replace(' ', 'T') + '.000Z');
    return new Date(date.getTime() + Math.random() * (endDate.getTime() - date.getTime()));
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

const createDataArray = (array) => {
    let query = "INSERT INTO coupons (Id, Code, Discount, Type, Amount, Start," +
        "End, CreateAt, CreateBy, UpdateAt, UpdateBy) VALUES";
    let arr = [];
    for (let i = 0; i < 100; i++) {
        const id = createID('CPN');
        let code = '';
        const startDate = formatDate(randomDate());
        const endDate = formatDate(conditionDate(startDate));
        const updateDate = formatDate(conditionDate2(startDate, endDate));
        do {
            code = createCode();
        } while (arr.find(item => item.code === code && item.endDate === endDate));
        const discount = Math.floor(Math.random() * 100);
        const hasUpdate = Math.floor(Math.random() * 1) == 1 ? true : false;
        const createBy = array[Math.floor(Math.random() * array.length)];
        const updateBy = array[Math.floor(Math.random() * array.length)];
        const data = {
            id,
            code,
            startDate,
            endDate,
            updateDate,
            discount,
            hasUpdate,
            createBy,
            updateBy
        }
        arr.push(data);
    }
    let queryParts = arr.map(item => `('${item.id}', '${item.code}', ${item.discount}, 'Time', NULL, '${item.startDate}', '${item.endDate}', '${item.startDate}', '${item.createBy}', ${item.hasUpdate ? item.updateDate : 'NULL'}, ${item.hasUpdate ? `'${item.updateBy}'` : 'NULL'})`);
    query += queryParts.join(",") + ";";
    fs.writeFile('output.sql', JSON.stringify(arr), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
    fs.writeFile('query.sql', query, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
    return query;
}

const cp = [
    { "id": "CPNWkjDwHuYSN657FT9m", "code": "8CL72B", "startDate": "2024-04-26 22:29:04", "endDate": "2024-05-13 15:57:55", "updateDate": "2024-05-04 07:54:42", "discount": 19, "hasUpdate": false, "createBy": "ADMNLC2crUjlyWN9fCTs", "updateBy": "ADMp2kRdhw5yBiRtDlUZ" },
    { "id": "CPNSFceM7tlmLcF8u1pz", "code": "AOSOYS", "startDate": "2023-06-06 10:32:33", "endDate": "2023-06-23 14:51:59", "updateDate": "2023-06-13 17:31:59", "discount": 15, "hasUpdate": false, "createBy": "ADM41UzWkFBe49GzRock", "updateBy": "ADMU0pQWIV28c3UADW57" },
    { "id": "CPNoMtoEJ5EhpW3JKrau", "code": "GT7B6R", "startDate": "2023-07-03 17:22:41", "endDate": "2023-07-16 21:13:33", "updateDate": "2023-07-12 14:01:46", "discount": 2, "hasUpdate": false, "createBy": "ADMkdnMcKr0k5MRinyi4", "updateBy": "ADMGW7RKhtMhE3SwgzD8" },
    { "id": "CPN6Gk1ju8UsF0lKh0BN", "code": "HVDDJB", "startDate": "2024-06-07 07:53:34", "endDate": "2024-06-08 04:17:00", "updateDate": "2024-06-08 05:14:59", "discount": 66, "hasUpdate": false, "createBy": "ADMQPMBntqGV6tBBulOC", "updateBy": "ADM16hBFlXksiDb1Sarb" },
    { "id": "CPNEhFv3AAsQ77nRi5hv", "code": "MWL0N5", "startDate": "2023-09-20 13:13:16", "endDate": "2023-09-30 01:32:34", "updateDate": "2023-09-26 00:37:56", "discount": 72, "hasUpdate": false, "createBy": "ADMU0pQWIV28c3UADW57", "updateBy": "ADMdCUTc28JcgTaXNcHY" },
    { "id": "CPN4j3CoHune0CTGxm4h", "code": "SNRL0M", "startDate": "2024-04-04 11:39:38", "endDate": "2024-05-04 10:03:01", "updateDate": "2024-05-03 15:39:35", "discount": 96, "hasUpdate": false, "createBy": "ADM41UzWkFBe49GzRock", "updateBy": "ADMHlTvrfozUc7oJVlT0" },
    { "id": "CPNaN3mEK1Ti3TRoPH9K", "code": "4DV16M", "startDate": "2024-06-26 04:48:23", "endDate": "2024-06-29 07:28:44", "updateDate": "2024-06-28 10:58:31", "discount": 30, "hasUpdate": false, "createBy": "ADMdUXKHTziyt1dmmKgo", "updateBy": "ADMj0Vm95Uu2EFBzOVeQ" },
    { "id": "CPNddWG1WmX2PiGSXUZ0", "code": "4MRWBO", "startDate": "2024-06-09 12:37:21", "endDate": "2024-06-30 21:18:41", "updateDate": "2024-06-14 13:48:31", "discount": 67, "hasUpdate": false, "createBy": "ADMj0Vm95Uu2EFBzOVeQ", "updateBy": "ADMnDU5cubMTOy7j48DU" },
    { "id": "CPNUfd1h5XVXP3ciQp1T", "code": "QVIQK9", "startDate": "2023-04-08 10:18:08", "endDate": "2023-04-11 18:51:48", "updateDate": "2023-04-10 00:02:11", "discount": 39, "hasUpdate": false, "createBy": "ADM2SoZFtj1H29QvtDas", "updateBy": "ADMyxvFhfIyqe03FhHTa" },
    { "id": "CPNapVBfgCSPeMPot6yZ", "code": "ZMLM8I", "startDate": "2023-10-27 12:51:15", "endDate": "2023-11-01 04:07:39", "updateDate": "2023-10-31 11:18:30", "discount": 18, "hasUpdate": false, "createBy": "ADMQPMBntqGV6tBBulOC", "updateBy": "ADMyxvFhfIyqe03FhHTa" },
    { "id": "CPNEqLV0UuqhAPUauwpU", "code": "B8FONG", "startDate": "2023-07-24 15:57:24", "endDate": "2023-08-15 05:06:42", "updateDate": "2023-08-08 16:30:33", "discount": 98, "hasUpdate": false, "createBy": "ADMGpZQaFlZDlmz66HnT", "updateBy": "ADMwDdQ3zvCqttN5NSBB" },
    { "id": "CPNcXlnz9ARCb68oMCHw", "code": "H54UKM", "startDate": "2024-01-02 05:15:32", "endDate": "2024-01-19 17:58:05", "updateDate": "2024-01-19 12:36:04", "discount": 85, "hasUpdate": false, "createBy": "ADMzg5dQRenPR7vBJb1V", "updateBy": "ADMp2kRdhw5yBiRtDlUZ" },
    { "id": "CPNEPjpJpWyQLKpMnZlb", "code": "WDI86Q", "startDate": "2023-07-07 16:35:51", "endDate": "2023-07-09 00:15:22", "updateDate": "2023-07-08 04:57:31", "discount": 26, "hasUpdate": false, "createBy": "ADMWKRNpuon1EM1Ep0ry", "updateBy": "ADMVgeMsbRuwDq7t5zU9" },
    { "id": "CPNjjpMxxEiupr4W6StZ", "code": "CNVYO8", "startDate": "2023-05-23 19:44:39", "endDate": "2023-05-30 16:47:35", "updateDate": "2023-05-25 19:48:52", "discount": 53, "hasUpdate": false, "createBy": "ADMwDdQ3zvCqttN5NSBB", "updateBy": "ADMoKjTaB63DaClaJcBv" },
    { "id": "CPNFUMH6BQ39TAX1i3YY", "code": "K4CAY0", "startDate": "2024-01-07 12:06:14", "endDate": "2024-01-24 08:15:47", "updateDate": "2024-01-13 08:05:12", "discount": 46, "hasUpdate": false, "createBy": "ADMZzlM7Lo6hcFSk1acm", "updateBy": "ADMu69sOU1FBlv3bL27u" },
    { "id": "CPNwcGxQq9B2WY8L7dlY", "code": "PB3OB5", "startDate": "2024-03-17 11:05:01", "endDate": "2024-04-01 12:40:55", "updateDate": "2024-04-01 07:55:17", "discount": 34, "hasUpdate": false, "createBy": "ADMX8uvEW7lrCnV9YV7S", "updateBy": "ADMf3vOzz35wB7yyoQjA" },
    { "id": "CPNMilvmEyeXzl2gb0F9", "code": "K9SZO4", "startDate": "2024-06-15 04:32:15", "endDate": "2024-07-02 11:44:48", "updateDate": "2024-06-19 06:18:28", "discount": 64, "hasUpdate": false, "createBy": "ADMGpZQaFlZDlmz66HnT", "updateBy": "ADMnQqNhJtzPFFW2kXtV" },
    { "id": "CPNiwRAOb6IfJIvi8PMW", "code": "FIBLS7", "startDate": "2023-01-03 08:46:46", "endDate": "2023-01-10 20:31:29", "updateDate": "2023-01-09 05:37:32", "discount": 64, "hasUpdate": false, "createBy": "ADMXnxUd6Fgib30Cx8f5", "updateBy": "ADMnwHKhSMRf5E5lsDJG" },
    { "id": "CPNGdQ8UxPcnJ7BwjL2c", "code": "P2XHT5", "startDate": "2024-01-21 03:07:56", "endDate": "2024-02-16 12:04:52", "updateDate": "2024-02-08 08:35:36", "discount": 83, "hasUpdate": false, "createBy": "ADM6Wjunhc6pmy9LqXim", "updateBy": "ADMLNMmHy6jURybJOLdz" },
    { "id": "CPNuKkmd0UcQQwb3zL85", "code": "WEOCKZ", "startDate": "2023-12-21 21:50:36", "endDate": "2023-12-27 00:54:56", "updateDate": "2023-12-24 16:55:17", "discount": 25, "hasUpdate": false, "createBy": "ADMTktyX5KqOlGVDTrFl", "updateBy": "ADM16hBFlXksiDb1Sarb" },
    { "id": "CPN1xby0pl4Qw2HPZJsW", "code": "LNW959", "startDate": "2023-04-11 01:30:27", "endDate": "2023-04-12 19:34:00", "updateDate": "2023-04-12 22:47:56", "discount": 21, "hasUpdate": false, "createBy": "ADMp2kRdhw5yBiRtDlUZ", "updateBy": "ADMnDU5cubMTOy7j48DU" },
    { "id": "CPNrkCPwvuaFceEuUp7M", "code": "ACJSKV", "startDate": "2024-03-30 18:25:37", "endDate": "2024-04-01 20:31:45", "updateDate": "2024-04-01 06:56:49", "discount": 16, "hasUpdate": false, "createBy": "ADMp2kRdhw5yBiRtDlUZ", "updateBy": "ADMLVYkqvb5QiGYKyaVz" },
    { "id": "CPNP1PNGjtAcNUJe3hpC", "code": "0RA22S", "startDate": "2024-06-11 05:22:29", "endDate": "2024-06-21 20:55:16", "updateDate": "2024-06-20 21:04:28", "discount": 96, "hasUpdate": false, "createBy": "ADMPD641wvK14TDsrFF4", "updateBy": "ADMPD641wvK14TDsrFF4" },
    { "id": "CPNEP4DydprK0O7SWfVo", "code": "MKUZFP", "startDate": "2023-04-22 01:36:54", "endDate": "2023-04-29 14:10:44", "updateDate": "2023-04-22 16:49:40", "discount": 99, "hasUpdate": false, "createBy": "ADMoNHPGBPTQhX2PuSXk", "updateBy": "ADMKnMohiDg0B2RnGsar" },
    { "id": "CPNLUfRoMwFBI9P5iW34", "code": "E8OM9D", "startDate": "2023-07-16 10:35:09", "endDate": "2023-07-27 10:31:19", "updateDate": "2023-07-23 21:25:55", "discount": 23, "hasUpdate": false, "createBy": "ADMPD641wvK14TDsrFF4", "updateBy": "ADMWKRNpuon1EM1Ep0ry" },
    { "id": "CPNwsLWC0tCUOmHTeuIF", "code": "WPWP31", "startDate": "2023-08-25 10:28:54", "endDate": "2023-09-17 15:13:34", "updateDate": "2023-09-07 16:11:22", "discount": 24, "hasUpdate": false, "createBy": "ADMSRlNhPajeVEHTVV1E", "updateBy": "ADMp2kRdhw5yBiRtDlUZ" },
    { "id": "CPNJH22raxCIsnBAsYbp", "code": "9PS3HJ", "startDate": "2023-10-05 20:07:06", "endDate": "2023-10-08 14:46:05", "updateDate": "2023-10-07 15:16:07", "discount": 43, "hasUpdate": false, "createBy": "ADMLVYkqvb5QiGYKyaVz", "updateBy": "ADM8qdaHNoYXKWdRQACL" },
    { "id": "CPN1iZ23wq5bwf9sYIZq", "code": "N39OB6", "startDate": "2023-09-18 07:03:46", "endDate": "2023-09-28 05:53:17", "updateDate": "2023-09-24 22:21:33", "discount": 16, "hasUpdate": false, "createBy": "ADMUcZyAxTot80ZnJO9u", "updateBy": "ADMXnxUd6Fgib30Cx8f5" },
    { "id": "CPNcNfiA8Cbkytw1mKW9", "code": "RMVLNN", "startDate": "2023-01-05 22:05:50", "endDate": "2023-01-31 18:38:12", "updateDate": "2023-01-06 17:50:17", "discount": 56, "hasUpdate": false, "createBy": "ADM7yovk1KCswp3CY4h0", "updateBy": "ADM8qdaHNoYXKWdRQACL" },
    { "id": "CPNMHxfPrj4pWReisgFH", "code": "5RDYNF", "startDate": "2024-05-17 05:29:49", "endDate": "2024-05-20 19:26:13", "updateDate": "2024-05-18 10:20:30", "discount": 67, "hasUpdate": false, "createBy": "ADMTktyX5KqOlGVDTrFl", "updateBy": "ADMHlTvrfozUc7oJVlT0" },
    { "id": "CPNVB38KbwoCyq8Q6FPg", "code": "OY8PVP", "startDate": "2024-01-16 23:14:50", "endDate": "2024-01-23 19:01:49", "updateDate": "2024-01-19 16:13:51", "discount": 57, "hasUpdate": false, "createBy": "ADM7yovk1KCswp3CY4h0", "updateBy": "ADMLNMmHy6jURybJOLdz" },
    { "id": "CPNZQWtVCSBNDyld6szn", "code": "YS0TF5", "startDate": "2023-09-29 15:25:11", "endDate": "2023-10-21 10:16:35", "updateDate": "2023-10-15 03:44:24", "discount": 61, "hasUpdate": false, "createBy": "ADMnQqNhJtzPFFW2kXtV", "updateBy": "ADMHlTvrfozUc7oJVlT0" },
    { "id": "CPNfa5zTRp4p9lfdIc5g", "code": "TEZHGU", "startDate": "2023-09-22 11:41:41", "endDate": "2023-10-11 12:00:22", "updateDate": "2023-09-27 16:13:24", "discount": 35, "hasUpdate": false, "createBy": "ADMHlTvrfozUc7oJVlT0", "updateBy": "ADMqlP4PLXgehtu16WUR" },
    { "id": "CPNUGKKM27raBiJEWXmX", "code": "ZN5UHT", "startDate": "2023-03-14 14:24:37", "endDate": "2023-04-10 17:56:55", "updateDate": "2023-04-04 01:57:35", "discount": 85, "hasUpdate": false, "createBy": "ADMu69sOU1FBlv3bL27u", "updateBy": "ADMZzlM7Lo6hcFSk1acm" },
    { "id": "CPNJBgSo3IbtLHdoDTCp", "code": "D5B7IU", "startDate": "2023-06-07 04:04:00", "endDate": "2023-06-10 18:57:36", "updateDate": "2023-06-08 14:43:51", "discount": 36, "hasUpdate": false, "createBy": "ADMLFp9O3yqTr8iMc3Rg", "updateBy": "ADMX8uvEW7lrCnV9YV7S" },
    { "id": "CPNv18B33Fr6dCWt8zeh", "code": "J4HU1L", "startDate": "2023-02-14 00:08:08", "endDate": "2023-03-05 15:13:02", "updateDate": "2023-03-05 05:07:31", "discount": 30, "hasUpdate": false, "createBy": "ADMLVYkqvb5QiGYKyaVz", "updateBy": "ADMSRlNhPajeVEHTVV1E" },
    { "id": "CPNlUDbUZHUWpyodCNgT", "code": "NVMQ55", "startDate": "2023-05-12 06:25:21", "endDate": "2023-05-31 02:19:30", "updateDate": "2023-05-26 05:17:38", "discount": 57, "hasUpdate": false, "createBy": "ADM7yovk1KCswp3CY4h0", "updateBy": "ADMj0Vm95Uu2EFBzOVeQ" },
    { "id": "CPNvB3eLSNAR2erCLd45", "code": "PGN7E3", "startDate": "2023-12-28 10:39:15", "endDate": "2024-01-15 21:34:59", "updateDate": "2024-01-14 19:15:55", "discount": 11, "hasUpdate": false, "createBy": "ADM7DsGjgRahjpvjN8OS", "updateBy": "ADMLFp9O3yqTr8iMc3Rg" },
    { "id": "CPNUMjHHlXpbPjie8huo", "code": "QRGGMJ", "startDate": "2024-05-04 11:28:46", "endDate": "2024-06-01 16:30:27", "updateDate": "2024-05-25 02:52:19", "discount": 3, "hasUpdate": false, "createBy": "ADMPD641wvK14TDsrFF4", "updateBy": "ADMLFp9O3yqTr8iMc3Rg" },
    { "id": "CPNBOqVhGJRG1DfviAZI", "code": "TBXHID", "startDate": "2023-01-26 12:28:48", "endDate": "2023-02-21 05:43:01", "updateDate": "2023-02-01 22:18:56", "discount": 41, "hasUpdate": false, "createBy": "ADM2SoZFtj1H29QvtDas", "updateBy": "ADMGEPhUIZUMU5p6EfqA" },
    { "id": "CPNHiZcznqi7qURYnQpr", "code": "KGCG47", "startDate": "2023-04-15 16:19:19", "endDate": "2023-04-25 04:22:39", "updateDate": "2023-04-23 19:15:21", "discount": 25, "hasUpdate": false, "createBy": "ADM6Wjunhc6pmy9LqXim", "updateBy": "ADMcpsK31xDPcrE6lkmE" },
    { "id": "CPNG68Z5WuDytp0sB4o6", "code": "6K5C5G", "startDate": "2024-06-09 19:40:30", "endDate": "2024-06-21 11:18:04", "updateDate": "2024-06-10 13:28:16", "discount": 98, "hasUpdate": false, "createBy": "ADMQPMBntqGV6tBBulOC", "updateBy": "ADMX8uvEW7lrCnV9YV7S" },
    { "id": "CPNvdAf1c9NqKJnm69y8", "code": "U1W8R9", "startDate": "2023-04-23 22:34:10", "endDate": "2023-05-20 05:26:42", "updateDate": "2023-05-20 11:44:38", "discount": 99, "hasUpdate": false, "createBy": "ADMSRlNhPajeVEHTVV1E", "updateBy": "ADM41UzWkFBe49GzRock" },
    { "id": "CPNN28hK4q9QbhwhwCD0", "code": "B8KVMB", "startDate": "2024-05-16 02:08:02", "endDate": "2024-06-12 15:57:53", "updateDate": "2024-05-17 21:37:57", "discount": 84, "hasUpdate": false, "createBy": "ADMoKjTaB63DaClaJcBv", "updateBy": "ADMnwHKhSMRf5E5lsDJG" },
    { "id": "CPNXNmuHADtFwOVnQbSH", "code": "IIUGZU", "startDate": "2023-01-20 10:03:55", "endDate": "2023-02-11 05:46:59", "updateDate": "2023-02-06 12:23:26", "discount": 54, "hasUpdate": false, "createBy": "ADMj0Vm95Uu2EFBzOVeQ", "updateBy": "ADMLVYkqvb5QiGYKyaVz" },
    { "id": "CPNraytJRnyf0k18kDAn", "code": "ZIO0XY", "startDate": "2023-07-30 06:29:20", "endDate": "2023-08-02 00:52:21", "updateDate": "2023-07-31 03:55:23", "discount": 2, "hasUpdate": false, "createBy": "ADMcpsK31xDPcrE6lkmE", "updateBy": "ADMquTv5hh8SDkyPlOLw" },
    { "id": "CPN2kEYGlkKf8nz5G4EP", "code": "NUI18N", "startDate": "2023-12-05 08:30:50", "endDate": "2023-12-14 05:45:03", "updateDate": "2023-12-13 02:36:57", "discount": 5, "hasUpdate": false, "createBy": "ADMTktyX5KqOlGVDTrFl", "updateBy": "ADMkdnMcKr0k5MRinyi4" },
    { "id": "CPN2uIrvuFIufTQ25ipI", "code": "SF8EBZ", "startDate": "2024-01-17 09:41:26", "endDate": "2024-02-15 14:59:47", "updateDate": "2024-01-19 11:13:54", "discount": 84, "hasUpdate": false, "createBy": "ADM6Wjunhc6pmy9LqXim", "updateBy": "ADMTktyX5KqOlGVDTrFl" },
    { "id": "CPNYkE7al7g9C73itzBo", "code": "LO6MEU", "startDate": "2023-02-13 17:06:25", "endDate": "2023-02-21 16:54:28", "updateDate": "2023-02-17 20:14:07", "discount": 6, "hasUpdate": false, "createBy": "ADMqlP4PLXgehtu16WUR", "updateBy": "ADMkdnMcKr0k5MRinyi4" },
    { "id": "CPNqdOLKI4LpSg2AqjlL", "code": "JTH6Z1", "startDate": "2023-05-03 23:41:01", "endDate": "2023-05-27 22:05:51", "updateDate": "2023-05-05 08:27:49", "discount": 32, "hasUpdate": false, "createBy": "ADMHlTvrfozUc7oJVlT0", "updateBy": "ADM41UzWkFBe49GzRock" },
    { "id": "CPNODHiLRzHQmndrb71V", "code": "JVN9WK", "startDate": "2023-03-05 11:39:14", "endDate": "2023-03-26 07:17:51", "updateDate": "2023-03-17 21:38:26", "discount": 49, "hasUpdate": false, "createBy": "ADMyxvFhfIyqe03FhHTa", "updateBy": "ADM8qdaHNoYXKWdRQACL" },
    { "id": "CPNz4nHY6Op0FoCC5wD9", "code": "P65R9C", "startDate": "2024-06-12 17:22:30", "endDate": "2024-07-09 11:38:30", "updateDate": "2024-06-27 10:36:55", "discount": 59, "hasUpdate": false, "createBy": "ADMzg5dQRenPR7vBJb1V", "updateBy": "ADM41UzWkFBe49GzRock" },
    { "id": "CPNZ5ETmNEUIv3caWi3L", "code": "JJHK5L", "startDate": "2023-01-10 11:38:12", "endDate": "2023-01-22 02:01:47", "updateDate": "2023-01-14 12:52:24", "discount": 57, "hasUpdate": false, "createBy": "ADM6Wjunhc6pmy9LqXim", "updateBy": "ADMzg5dQRenPR7vBJb1V" },
    { "id": "CPNYE3mQk4Gd8pE3sOdE", "code": "UFB3DW", "startDate": "2023-02-09 12:23:15", "endDate": "2023-02-11 01:14:24", "updateDate": "2023-02-10 21:27:14", "discount": 88, "hasUpdate": false, "createBy": "ADM16hBFlXksiDb1Sarb", "updateBy": "ADMU0pQWIV28c3UADW57" },
    { "id": "CPNLEUldre27vz0DwdRF", "code": "HAODS2", "startDate": "2023-12-08 16:57:25", "endDate": "2023-12-23 21:40:08", "updateDate": "2023-12-18 13:36:58", "discount": 50, "hasUpdate": false, "createBy": "ADMZzlM7Lo6hcFSk1acm", "updateBy": "ADMGpZQaFlZDlmz66HnT" },
    { "id": "CPNXiomVrbWw1bAxN2DE", "code": "9OHXOQ", "startDate": "2023-08-11 12:19:50", "endDate": "2023-08-18 14:55:05", "updateDate": "2023-08-13 23:46:11", "discount": 77, "hasUpdate": false, "createBy": "ADM2SoZFtj1H29QvtDas", "updateBy": "ADM6Wjunhc6pmy9LqXim" },
    { "id": "CPNWvzLW8YjpZt4ZiK4R", "code": "E78EJH", "startDate": "2023-07-24 00:18:49", "endDate": "2023-08-13 14:12:19", "updateDate": "2023-07-29 04:07:23", "discount": 92, "hasUpdate": false, "createBy": "ADM7DsGjgRahjpvjN8OS", "updateBy": "ADMzg5dQRenPR7vBJb1V" },
    { "id": "CPNYg09xlZXT00QqQzuB", "code": "60H3XQ", "startDate": "2023-03-18 23:54:13", "endDate": "2023-03-21 06:22:22", "updateDate": "2023-03-21 03:08:22", "discount": 96, "hasUpdate": false, "createBy": "ADMUcZyAxTot80ZnJO9u", "updateBy": "ADMj0Vm95Uu2EFBzOVeQ" },
    { "id": "CPNIYGGFtLzOWAW5i8jx", "code": "2SSD6F", "startDate": "2024-01-31 10:22:59", "endDate": "2024-02-25 06:07:58", "updateDate": "2024-02-19 06:05:32", "discount": 95, "hasUpdate": false, "createBy": "ADMZzlM7Lo6hcFSk1acm", "updateBy": "ADMV9v8qczEuKfkLcCy0" },
    { "id": "CPN2rPu12xbXXEv6o7yv", "code": "PEHM0C", "startDate": "2024-03-08 11:02:05", "endDate": "2024-03-30 18:04:10", "updateDate": "2024-03-26 22:49:24", "discount": 48, "hasUpdate": false, "createBy": "ADMquTv5hh8SDkyPlOLw", "updateBy": "ADMj0Vm95Uu2EFBzOVeQ" },
    { "id": "CPNf0GLdUTRRC6Ld1Sy6", "code": "YNLVN7", "startDate": "2024-02-01 04:53:52", "endDate": "2024-03-02 01:06:39", "updateDate": "2024-02-21 16:23:20", "discount": 13, "hasUpdate": false, "createBy": "ADM16hBFlXksiDb1Sarb", "updateBy": "ADMoNHPGBPTQhX2PuSXk" },
    { "id": "CPN8265Y1kfGMoDkTOxU", "code": "8OIB3U", "startDate": "2023-08-02 16:46:44", "endDate": "2023-08-18 10:35:41", "updateDate": "2023-08-15 22:44:14", "discount": 57, "hasUpdate": false, "createBy": "ADMyxvFhfIyqe03FhHTa", "updateBy": "ADM2SoZFtj1H29QvtDas" },
    { "id": "CPN98VVrotjIbyg17zgp", "code": "OMP3MV", "startDate": "2023-11-29 17:34:47", "endDate": "2023-12-16 18:52:19", "updateDate": "2023-12-11 17:11:49", "discount": 64, "hasUpdate": false, "createBy": "ADMdCUTc28JcgTaXNcHY", "updateBy": "ADMNR2dSnpobnKHz95KN" },
    { "id": "CPNNSJ5NDVFMPVSz6SeP", "code": "I6N293", "startDate": "2023-05-09 08:21:19", "endDate": "2023-05-30 12:35:00", "updateDate": "2023-05-12 15:48:55", "discount": 25, "hasUpdate": false, "createBy": "ADMVgeMsbRuwDq7t5zU9", "updateBy": "ADMGEPhUIZUMU5p6EfqA" },
    { "id": "CPNbiUHsBp0qyvNyxBNg", "code": "9AAXFF", "startDate": "2023-08-19 23:44:49", "endDate": "2023-09-06 23:34:44", "updateDate": "2023-08-31 05:10:57", "discount": 10, "hasUpdate": false, "createBy": "ADMGpZQaFlZDlmz66HnT", "updateBy": "ADMoNHPGBPTQhX2PuSXk" },
    { "id": "CPNb3jG9mbaUwM9z6I2p", "code": "4QPGZE", "startDate": "2024-02-03 13:28:03", "endDate": "2024-02-11 07:07:16", "updateDate": "2024-02-11 06:51:54", "discount": 36, "hasUpdate": false, "createBy": "ADMcpsK31xDPcrE6lkmE", "updateBy": "ADMTktyX5KqOlGVDTrFl" },
    { "id": "CPNXhQFQcD1bzu4IXLvO", "code": "MTXGOE", "startDate": "2023-09-13 17:59:12", "endDate": "2023-10-10 18:46:35", "updateDate": "2023-10-02 22:30:40", "discount": 64, "hasUpdate": false, "createBy": "ADMLFp9O3yqTr8iMc3Rg", "updateBy": "ADMU0pQWIV28c3UADW57" },
    { "id": "CPNRKnW53JtqwgrEG6Rx", "code": "Z1G0XA", "startDate": "2024-01-18 13:35:39", "endDate": "2024-02-03 04:04:06", "updateDate": "2024-01-30 13:42:02", "discount": 50, "hasUpdate": false, "createBy": "ADMj0Vm95Uu2EFBzOVeQ", "updateBy": "ADMWKRNpuon1EM1Ep0ry" },
    { "id": "CPNppaoHT9WjWV8yyXuq", "code": "KU9W7G", "startDate": "2024-06-14 01:48:44", "endDate": "2024-07-12 09:14:20", "updateDate": "2024-07-07 19:05:20", "discount": 90, "hasUpdate": false, "createBy": "ADMNR2dSnpobnKHz95KN", "updateBy": "ADMdCUTc28JcgTaXNcHY" },
    { "id": "CPNFsZPYAj9datxMyDPR", "code": "BO1HTV", "startDate": "2024-05-30 16:00:38", "endDate": "2024-06-11 12:35:22", "updateDate": "2024-06-01 06:04:49", "discount": 16, "hasUpdate": false, "createBy": "ADMGEPhUIZUMU5p6EfqA", "updateBy": "ADMGEPhUIZUMU5p6EfqA" },
    { "id": "CPNVCeeKlzeEOOL18Mbh", "code": "UFW81D", "startDate": "2023-10-08 05:18:56", "endDate": "2023-11-02 07:05:38", "updateDate": "2023-10-11 02:24:12", "discount": 6, "hasUpdate": false, "createBy": "ADMUcZyAxTot80ZnJO9u", "updateBy": "ADMf3vOzz35wB7yyoQjA" },
    { "id": "CPNQiSLwQnz5xxpN6mNr", "code": "XVBZVJ", "startDate": "2023-03-21 16:23:59", "endDate": "2023-04-04 08:02:30", "updateDate": "2023-03-27 22:06:27", "discount": 84, "hasUpdate": false, "createBy": "ADMPD641wvK14TDsrFF4", "updateBy": "ADMkdnMcKr0k5MRinyi4" },
    { "id": "CPNND3h92pzw9uRzmKYt", "code": "SEM1NZ", "startDate": "2023-12-18 11:04:44", "endDate": "2024-01-11 04:22:05", "updateDate": "2023-12-28 08:28:22", "discount": 93, "hasUpdate": false, "createBy": "ADMVgeMsbRuwDq7t5zU9", "updateBy": "ADMLFp9O3yqTr8iMc3Rg" },
    { "id": "CPN2pnKnBfniDqUl1SFs", "code": "ZTUOD5", "startDate": "2024-03-02 13:29:50", "endDate": "2024-03-27 22:22:52", "updateDate": "2024-03-12 19:48:53", "discount": 67, "hasUpdate": false, "createBy": "ADMzg5dQRenPR7vBJb1V", "updateBy": "ADMU0pQWIV28c3UADW57" },
    { "id": "CPNAQRQ8gremHCVRTLCt", "code": "6QVENE", "startDate": "2024-01-02 17:31:46", "endDate": "2024-01-10 11:27:59", "updateDate": "2024-01-03 07:36:55", "discount": 57, "hasUpdate": false, "createBy": "ADMdCUTc28JcgTaXNcHY", "updateBy": "ADMXnxUd6Fgib30Cx8f5" },
    { "id": "CPNMDAxMnIbNNNo0tEaU", "code": "2MQONV", "startDate": "2023-06-11 06:04:39", "endDate": "2023-06-25 12:24:13", "updateDate": "2023-06-22 17:21:47", "discount": 8, "hasUpdate": false, "createBy": "ADM7yovk1KCswp3CY4h0", "updateBy": "ADMGEPhUIZUMU5p6EfqA" },
    { "id": "CPN3B5fxcHezoQl7CzkY", "code": "DYTQX0", "startDate": "2023-01-23 00:39:28", "endDate": "2023-01-23 18:01:44", "updateDate": "2023-01-23 11:03:10", "discount": 89, "hasUpdate": false, "createBy": "ADMj0Vm95Uu2EFBzOVeQ", "updateBy": "ADM16hBFlXksiDb1Sarb" },
    { "id": "CPNMW8WBGNSkk0r0iWFb", "code": "5ALH24", "startDate": "2024-01-03 10:25:16", "endDate": "2024-01-14 11:17:11", "updateDate": "2024-01-04 14:41:35", "discount": 78, "hasUpdate": false, "createBy": "ADMnwHKhSMRf5E5lsDJG", "updateBy": "ADMyxvFhfIyqe03FhHTa" },
    { "id": "CPNPxX1Y0HzJ0Uj1HyzL", "code": "I1AA25", "startDate": "2023-01-17 08:28:01", "endDate": "2023-02-16 11:02:12", "updateDate": "2023-02-07 01:35:10", "discount": 3, "hasUpdate": false, "createBy": "ADM2SoZFtj1H29QvtDas", "updateBy": "ADMZzlM7Lo6hcFSk1acm" },
    { "id": "CPNk6KMgst4pix1Asbdc", "code": "308U5U", "startDate": "2023-10-29 02:40:43", "endDate": "2023-11-18 09:24:34", "updateDate": "2023-11-12 02:53:40", "discount": 60, "hasUpdate": false, "createBy": "ADMPD641wvK14TDsrFF4", "updateBy": "ADMoNHPGBPTQhX2PuSXk" },
    { "id": "CPNZsvt6Uy0zDxRMiESy", "code": "OC7E1V", "startDate": "2023-01-04 16:03:43", "endDate": "2023-01-19 01:35:28", "updateDate": "2023-01-10 19:32:19", "discount": 44, "hasUpdate": false, "createBy": "ADMrFzQqANlHnqeyNg45", "updateBy": "ADMX8uvEW7lrCnV9YV7S" },
    { "id": "CPNZzU3jjzR0dhoOLhMG", "code": "UEN9ES", "startDate": "2023-03-12 23:31:21", "endDate": "2023-03-22 10:34:59", "updateDate": "2023-03-15 09:00:00", "discount": 18, "hasUpdate": false, "createBy": "ADMoNHPGBPTQhX2PuSXk", "updateBy": "ADMXnxUd6Fgib30Cx8f5" },
    { "id": "CPNvnOLbi8xl24J5ugbK", "code": "2USA6W", "startDate": "2023-07-20 21:46:09", "endDate": "2023-07-23 06:54:32", "updateDate": "2023-07-22 01:30:03", "discount": 63, "hasUpdate": false, "createBy": "ADM8qdaHNoYXKWdRQACL", "updateBy": "ADMGEPhUIZUMU5p6EfqA" },
    { "id": "CPNN0aK6EHk13XOKU0vq", "code": "I4AP7E", "startDate": "2024-04-26 12:24:38", "endDate": "2024-05-16 11:59:26", "updateDate": "2024-05-08 17:34:08", "discount": 72, "hasUpdate": false, "createBy": "ADM41UzWkFBe49GzRock", "updateBy": "ADMp2kRdhw5yBiRtDlUZ" },
    { "id": "CPN96geXaNNbqAvbld75", "code": "FPWIEW", "startDate": "2024-02-25 21:29:36", "endDate": "2024-03-18 06:00:42", "updateDate": "2024-03-07 21:12:14", "discount": 16, "hasUpdate": false, "createBy": "ADMNR2dSnpobnKHz95KN", "updateBy": "ADMGEPhUIZUMU5p6EfqA" },
    { "id": "CPNNZ6YBEjS4lh3rkQx9", "code": "18CZHD", "startDate": "2024-05-12 08:14:55", "endDate": "2024-05-30 00:58:42", "updateDate": "2024-05-21 03:31:53", "discount": 19, "hasUpdate": false, "createBy": "ADMwDdQ3zvCqttN5NSBB", "updateBy": "ADMu69sOU1FBlv3bL27u" },
    { "id": "CPNFuoeN2JvWTD6rdJpI", "code": "U665ST", "startDate": "2023-07-29 11:05:11", "endDate": "2023-08-17 14:31:55", "updateDate": "2023-08-09 07:03:16", "discount": 2, "hasUpdate": false, "createBy": "ADMoKjTaB63DaClaJcBv", "updateBy": "ADMV9v8qczEuKfkLcCy0" },
    { "id": "CPNxe1nNY0UwCvOpipeK", "code": "2N2AC7", "startDate": "2024-01-26 18:16:43", "endDate": "2024-01-28 14:47:10", "updateDate": "2024-01-28 13:28:53", "discount": 94, "hasUpdate": false, "createBy": "ADMGW7RKhtMhE3SwgzD8", "updateBy": "ADMSRlNhPajeVEHTVV1E" },
    { "id": "CPNKcfRqs1Bew8AqjP3i", "code": "WU2161", "startDate": "2023-06-07 14:46:29", "endDate": "2023-06-25 13:29:17", "updateDate": "2023-06-13 14:18:09", "discount": 88, "hasUpdate": false, "createBy": "ADMUcZyAxTot80ZnJO9u", "updateBy": "ADMXnxUd6Fgib30Cx8f5" },
    { "id": "CPNcGCssmJUOgyUr3Yj5", "code": "O0R0MM", "startDate": "2023-10-04 23:51:10", "endDate": "2023-10-19 22:10:01", "updateDate": "2023-10-11 00:12:27", "discount": 59, "hasUpdate": false, "createBy": "ADMPD641wvK14TDsrFF4", "updateBy": "ADMquTv5hh8SDkyPlOLw" },
    { "id": "CPN4O7b1VM7WmuBm3NWP", "code": "SVQBWO", "startDate": "2024-01-15 06:00:12", "endDate": "2024-02-05 12:58:54", "updateDate": "2024-01-25 21:41:29", "discount": 15, "hasUpdate": false, "createBy": "ADMp2kRdhw5yBiRtDlUZ", "updateBy": "ADMQPMBntqGV6tBBulOC" },
    { "id": "CPNRqCKuAv1gsDEUCwzP", "code": "G1HKIF", "startDate": "2023-11-27 06:43:34", "endDate": "2023-12-18 05:11:18", "updateDate": "2023-12-12 00:31:37", "discount": 50, "hasUpdate": false, "createBy": "ADMu69sOU1FBlv3bL27u", "updateBy": "ADMXnxUd6Fgib30Cx8f5" },
    { "id": "CPN2igQyWfauc3Vv4tSb", "code": "V8WT81", "startDate": "2023-06-29 02:31:53", "endDate": "2023-07-16 00:45:10", "updateDate": "2023-07-10 00:38:43", "discount": 23, "hasUpdate": false, "createBy": "ADMHlTvrfozUc7oJVlT0", "updateBy": "ADMVgeMsbRuwDq7t5zU9" },
    { "id": "CPNfPAkM3uoNDqgtJg7W", "code": "WQGIM1", "startDate": "2023-05-11 08:47:27", "endDate": "2023-05-22 00:25:34", "updateDate": "2023-05-17 12:24:14", "discount": 23, "hasUpdate": false, "createBy": "ADM7DsGjgRahjpvjN8OS", "updateBy": "ADMu69sOU1FBlv3bL27u" },
    { "id": "CPNAE6XXBS68l6bDnvyB", "code": "L07ICX", "startDate": "2024-05-25 18:29:11", "endDate": "2024-06-13 14:13:30", "updateDate": "2024-05-27 04:01:04", "discount": 58, "hasUpdate": false, "createBy": "ADMj0Vm95Uu2EFBzOVeQ", "updateBy": "ADMyCS5pofsXT7s6COxk" },
    { "id": "CPNRvL8Qa0qTf5T4UPzd", "code": "FFQYK9", "startDate": "2024-03-22 08:50:11", "endDate": "2024-04-17 21:38:10", "updateDate": "2024-04-02 09:13:02", "discount": 16, "hasUpdate": false, "createBy": "ADMdUXKHTziyt1dmmKgo", "updateBy": "ADMGEPhUIZUMU5p6EfqA" },
    { "id": "CPNME1qXViekNOGKT5hM", "code": "TPCZAM", "startDate": "2023-01-25 06:37:44", "endDate": "2023-02-08 09:47:31", "updateDate": "2023-02-07 06:55:14", "discount": 60, "hasUpdate": false, "createBy": "ADMZzlM7Lo6hcFSk1acm", "updateBy": "ADMZzlM7Lo6hcFSk1acm" },
    { "id": "CPNtRuV5cqq4X2HrLfyV", "code": "Y5C3SK", "startDate": "2024-03-02 13:30:29", "endDate": "2024-03-17 21:38:07", "updateDate": "2024-03-16 17:52:12", "discount": 64, "hasUpdate": false, "createBy": "ADM6Wjunhc6pmy9LqXim", "updateBy": "ADMoNHPGBPTQhX2PuSXk" },
    { "id": "CPN4EVF7StYmO2Af0qe0", "code": "L7QNOG", "startDate": "2024-01-23 23:05:51", "endDate": "2024-02-05 11:57:40", "updateDate": "2024-01-25 09:39:36", "discount": 48, "hasUpdate": false, "createBy": "ADMu69sOU1FBlv3bL27u", "updateBy": "ADMf3vOzz35wB7yyoQjA" },
    { "id": "CPNyxTRNpyIt3qJqRCbH", "code": "KETST7", "startDate": "2024-01-11 14:49:35", "endDate": "2024-01-15 16:50:54", "updateDate": "2024-01-14 10:19:26", "discount": 26, "hasUpdate": false, "createBy": "ADMyCS5pofsXT7s6COxk", "updateBy": "ADMTktyX5KqOlGVDTrFl" }
]

const cpItem = [
{id: "FOD0N3k0s6xrtlx2zhaD", date:	"2024-04-11 12:58:31"},
{id: "FOD161eK0wEDgJ4f7bw5", date:	"2024-05-03 04:13:59"},
{id: "FOD1dncXStQgn2waSmlF", date:	"2024-03-15 17:59:54"},
{id: "FOD1eoobwpi5hCvvpgLv", date:	"2024-05-08 15:07:08"},
{id: "FOD1mZFs6VqtvL1V4SJF", date:	"2024-01-15 17:25:52"},
{id: "FOD1RuE1TgbotsRLEJr3", date:	"2023-11-15 20:08:12"},
{id: "FOD1wjn2VGVNo8IoINgZ", date:	"2024-03-24 21:43:10"},
{id: "FOD270u5ja4ZgHrsHg63", date:	"2024-04-08 07:06:30"},
{id: "FOD2fVs8fPRyPMcCbg5h", date:	"2024-03-03 13:05:55"},
{id: "FOD2jsbwHHBVKlEIfwGE", date:	"2024-03-10 17:08:17"},
{id: "FOD2oFFzazWMGgB7Sp2q", date:	"2024-05-09 07:33:14"},
{id: "FOD2yKFNsluOxRNP0FsS", date:	"2024-05-06 00:13:46"},
{id: "FOD32ep9GzgryXFO3Zh7", date:	"2024-03-17 14:44:53"},
{id: "FOD3aosZKHJ23y1wp7JE", date:	"2023-10-22 06:44:44"},
{id: "FOD3ChSd6qP4lpW2XUoY", date:	"2024-04-08 13:13:16"},
{id: "FOD3EiGTTIuXAqhXVqa6", date:	"2024-04-20 20:29:13"},
{id: "FOD3rVVm0mtvIiELsDyz", date:	"2024-05-06 13:43:30"},
{id: "FOD3tO9gAr9ztTed3u8g", date:	"2023-12-18 17:22:57"},
{id: "FOD3X9wHdzERTcYrGX7S", date:	"2024-02-23 01:44:32"},
{id: "FOD46BSUuZRh6taN8L6L", date:	"2024-04-26 20:36:08"},
{id: "FOD4IT8bhZ2OkYeDbmTl", date:	"2024-04-11 10:01:03"},
{id: "FOD4RxZzSLiG2eKAWUwk", date:	"2024-01-18 22:53:14"},
{id: "FOD5b4Sm5oI4XcIjZinG", date:	"2024-04-06 02:18:00"},
{id: "FOD5CweiQX9PiJD32Af4", date:	"2024-02-04 04:44:05"},
{id: "FOD6edK122bKt8NnYHna", date:	"2024-04-05 10:47:59"},
{id: "FOD6eVdEQ6MvcDB0fIGa", date:	"2024-05-09 23:45:59"},
{id: "FOD6OMjDP8ncuJJ5xCs8", date:	"2024-05-07 21:05:58"},
{id: "FOD6OrXfqd6OrSedlqYi", date:	"2024-04-24 14:40:25"},
{id: "FOD73sUygfbOhAZdx0pY", date:	"2024-04-02 08:52:34"},
{id: "FOD74m2EZ6LMIQxEfVMH", date:	"2024-02-01 23:47:11"},
{id: "FOD7cddOad0xUw2bgpgE", date:	"2024-04-01 15:25:37"},
{id: "FOD7ZDjRdgn98Q4O7Eg9", date:	"2024-04-18 16:32:28"},
{id: "FOD8DyFuB5hHplap5aZk", date:	"2024-04-26 16:17:49"},
{id: "FOD8KYPJ8VIoXNoZk0hs", date:	"2024-04-09 03:45:36"},
{id: "FOD8ZS9Yf6emMY1yWyQE", date:	"2024-04-08 17:52:19"},
{id: "FOD90gjtz1Vt4nYP3n9x", date:	"2024-01-21 21:24:35"},
{id: "FOD9cAvvZDesAow8aNeU", date:	"2024-03-19 22:52:30"},
{id: "FOD9CCF8xkV208FwGH3t", date:	"2023-11-09 13:59:08"},
{id: "FOD9dZT9NFN43MU6cueD", date:	"2023-12-27 18:20:25"},
{id: "FOD9I22VM2nKe12IrmpO", date:	"2024-05-08 23:37:00"},
{id: "FOD9k9qSGGIM9KHxNhnt", date:	"2024-05-14 09:22:14"},
{id: "FOD9SG1qTZdAVatxYgOq", date:	"2023-11-13 17:36:00"},
{id: "FODa4iOUN3T4AlMmqom8", date:	"2024-03-19 21:13:20"},
{id: "FODA5esJV67mZxhOB14l", date:	"2024-04-07 04:17:16"},
{id: "FODA9l5JcnTOBQzH4oAq", date:	"2024-03-15 08:32:59"},
{id: "FODabfBSEDfSwxaEHt3F", date:	"2024-05-07 22:38:38"},
{id: "FODacYxDxe3UKPOAnJz6", date:	"2023-11-04 02:45:03"},
{id: "FODAdFLD0kWxZsez2qgg", date:	"2024-05-15 04:41:18"},
{id: "FODalNMDqnIrmQdIGq9L", date:	"2024-02-07 15:16:39"},
{id: "FODaql7LL346mdECxVkg", date:	"2024-03-23 15:13:01"},
{id: "FODAqsZf4yzWePTe1l08", date:	"2024-03-09 11:27:02"},
{id: "FODAVJPYh3LWhKW8W0D9", date:	"2024-05-12 07:38:54"},
{id: "FODB0jcrIYGCKQROlsqU", date:	"2024-02-17 07:41:53"},
{id: "FODb4E9Gr7pVUxPGRB6S", date:	"2023-07-15 03:43:54"},
{id: "FODb72EgbLQXtGgLfyog", date:	"2023-12-08 00:03:47"},
{id: "FODBArXCVP2BIsuiD2qj", date:	"2024-03-20 06:38:49"},
{id: "FODbcKUXl6xv1nONFUqO", date:	"2024-04-24 08:09:00"},
{id: "FODbdVpvh3ysgN2H7LrJ", date:	"2024-04-16 17:53:25"},
{id: "FODbEjwMsUJg5bo4Di6o", date:	"2024-03-06 11:55:10"},
{id: "FODbeV42UD4Lc86IA48O", date:	"2024-05-12 03:59:07"},
{id: "FODbjdWneILnvWpJApBz", date:	"2023-12-05 17:35:42"},
{id: "FODBnIlyxGFYse6b9Ytk", date:	"2023-10-22 13:45:51"},
{id: "FODBSKbR1DLnf6yZTH91", date:	"2023-12-24 16:31:39"},
{id: "FODbtdRTBl2wiOnVOUy1", date:	"2024-05-04 13:13:38"},
{id: "FODbtu6o9D72mn9B1qGv", date:	"2024-02-15 23:59:31"},
{id: "FODBViUpkHj85enp8LhV", date:	"2023-11-23 02:05:56"},
{id: "FODC7kUMXVJ3DF2qru4H", date:	"2024-03-10 05:29:36"},
{id: "FODcFmtddCxs16Asbx96", date:	"2024-01-11 05:36:19"},
{id: "FODCMivk3NH3fh5N0i6D", date:	"2024-05-05 02:35:14"},
{id: "FODCTkXYtszzP9Kiobdg", date:	"2024-04-01 22:41:51"},
{id: "FODcV8CVI1KqzDD7SQ96", date:	"2024-05-25 20:25:57"},
{id: "FODCxINqgk9y7hHL7elk", date:	"2024-05-09 19:36:45"},
{id: "FODd3XD9iJaCchaYGsfZ", date:	"2024-05-08 10:50:38"},
{id: "FODD6DUTls6ck4fjFnWN", date:	"2024-05-08 04:59:27"},
{id: "FODD6vuim45IUr1IXk7n", date:	"2024-04-11 12:42:31"},
{id: "FODdicSx5o7qUYF2Ss73", date:	"2024-04-01 04:47:29"},
{id: "FODDvCc7feyDgD3ae8hD", date:	"2024-05-08 06:37:15"},
{id: "FODe167nCjgBKwQc2o9Q", date:	"2024-04-22 15:52:33"},
{id: "FODE92exeIuooJpxThRd", date:	"2023-08-09 16:15:37"},
{id: "FODEdPrnF5GkW455R7iX", date:	"2023-08-31 16:08:41"},
{id: "FODejzOBNkpN0L9d2Z0Y", date:	"2024-01-02 05:21:24"},
{id: "FODelrwpSAxQ7uOmOSwo", date:	"2024-05-02 20:11:03"},
{id: "FODenWM0rV0ra44F6huH", date:	"2024-05-08 23:42:30"},
{id: "FODeWwXeNaXfVMEi2mV7", date:	"2024-04-06 02:42:38"},
{id: "FODex4xZNn8WBpSjempC", date:	"2024-05-03 16:04:59"},
{id: "FODezAhAKs0tPMKVgzVT", date:	"2024-02-26 15:42:56"},
{id: "FODEzRfjQfdZ8IEzLPux", date:	"2023-10-02 02:21:21"},
{id: "FODFfT44vcHimTmXNcMg", date:	"2024-05-04 00:13:38"},
{id: "FODFjf3MhyaiPWjYUG1i", date:	"2024-04-26 13:05:35"},
{id: "FODFMTITEpvv7erFKRso", date:	"2024-04-14 23:49:52"},
{id: "FODfNwkPrbmOJdLKcJzX", date:	"2024-04-26 00:29:51"},
{id: "FODFObtF4tTyDpH2CbYR", date:	"2024-03-06 19:17:41"},
{id: "FODfq9EWAsU8zEnY39Tq", date:	"2024-05-04 02:50:17"},
{id: "FODfv2WkyDJUO6Ip8pT4", date:	"2024-05-14 03:32:35"},
{id: "FODfwmT28TZVky6Ne0sz", date:	"2023-12-29 12:48:56"},
{id: "FODfxfcxWiEfRFEdzSk4", date:	"2024-11-16 04:08:42"},
{id: "FODFZXcsuJLZukbanwPB", date:	"2024-04-06 23:58:14"},
{id: "FODGE5RIwO13sdrJIgYU", date:	"2024-05-12 10:08:32"},
{id: "FODGT01IxFFpsozDxyoZ", date:	"2024-05-07 07:21:24"},
{id: "FODGVIu3PqNhH29kMBlL", date:	"2024-01-30 17:17:51"},
{id: "FODh4bww4eXTV4uzVgzF", date:	"2024-02-18 04:30:28"},
{id: "FODHPPdzNAWdO9F3TMRw", date:	"2023-11-26 06:40:10"},
{id: "FODhqljnHqZatGFnzIDa", date:	"2024-05-04 21:47:12"},
{id: "FODHXrSA27oOS3o23mq3", date:	"2024-02-24 08:35:47"},
{id: "FODhyzui9uWUfHXwEuj1", date:	"2023-07-01 11:01:51"},
{id: "FODI5PIP844Za8xc9REu", date:	"2024-04-11 02:19:28"},
{id: "FODI9u4VLjf4HORNhPt7", date:	"2024-01-19 13:53:19"},
{id: "FODIdKLXo6QkznsB7wC3", date:	"2024-03-31 16:10:32"},
{id: "FODIJnzvkyetsjvPzf8B", date:	"2024-03-30 00:22:40"},
{id: "FODimPxCzzLBLKm5oVqZ", date:	"2024-05-18 02:38:49"},
{id: "FODIQN63RzM1an6K68oi", date:	"2024-05-05 20:17:43"},
{id: "FODIWeV0wbOdGlhbVm7L", date:	"2024-03-16 06:45:56"},
{id: "FODIZfVo1ApAqm4vXklv", date:	"2024-04-20 19:02:42"},
{id: "FODj3YGyQh9PIkC1Blp5", date:	"2024-04-24 13:25:46"},
{id: "FODJCt45rBicxcW9XUDV", date:	"2024-04-14 01:48:24"},
{id: "FODJkvgBLnBdrQy5LPV9", date:	"2023-12-26 02:45:32"},
{id: "FODJPypZyQuBkdNxBXOW", date:	"2024-06-30 19:33:45"},
{id: "FODJrlTeY8UvdmJxcHhk", date:	"2023-10-06 07:36:04"},
{id: "FODk4s52iXrok2Qh1Cal", date:	"2024-05-25 11:56:16"},
{id: "FODKEArt9FIrHEdsISkz", date:	"2024-04-04 12:38:53"},
{id: "FODKHddJNh35MDs56hPB", date:	"2023-07-13 05:58:38"},
{id: "FODKiATlEmk1PBHwpVXz", date:	"2024-04-16 01:23:13"},
{id: "FODkjym7xw99cZGP0MeZ", date:	"2023-11-22 21:23:40"},
{id: "FODKMoa11gZyBRd9VZMd", date:	"2024-02-21 18:27:05"},
{id: "FODkO8YR27GLOPKLT9OB", date:	"2023-11-25 11:27:18"},
{id: "FODks2MLxKqO75MnP3z7", date:	"2024-03-19 12:50:44"},
{id: "FODKswJV5lOT5ot3jjeu", date:	"2024-02-26 01:22:47"},
{id: "FODkUIXtKmtxd1ZEtHG7", date:	"2023-12-05 08:13:11"},
{id: "FODlbGRInqBoPXtbfFEc", date:	"2024-03-19 16:06:52"},
{id: "FODLlyWAGeRpnAAhy9Y0", date:	"2024-04-25 04:53:06"},
{id: "FODlMGiRDtqRMUiOot15", date:	"2023-12-16 12:35:09"},
{id: "FODLMPaxMYwxURbreovG", date:	"2024-05-10 12:15:38"},
{id: "FODlnUXGd5Wwj0e7NLud", date:	"2024-04-28 06:54:51"},
{id: "FODLOj8ytP7rDQe1yvCV", date:	"2024-04-09 13:07:17"},
{id: "FODLP6shtxnBPq5MqYkT", date:	"2024-05-03 10:57:38"},
{id: "FODlSbsQyJu1sgiZBcjm", date:	"2023-07-07 04:22:53"},
{id: "FODlsEYtVRbaRDwDyDBl", date:	"2024-04-30 05:35:04"},
{id: "FODmANrh0wFOnfe0kHAa", date:	"2024-05-04 20:48:59"},
{id: "FODmBdfe1QpQMDNf2FO3", date:	"2024-01-01 01:46:08"},
{id: "FODmd5UrrIdPh3ArUDFS", date:	"2024-01-10 23:24:16"},
{id: "FODMMfkfPW820K7EhAx1", date:	"2024-04-07 14:55:27"},
{id: "FODmOYmSh70DhryipLsV", date:	"2023-02-21 16:10:50"},
{id: "FODmS2FM49jfRMLKLEo9", date:	"2024-03-16 22:08:16"},
{id: "FODN1A6wnhj4cvWZaQNT", date:	"2024-04-15 21:40:38"},
{id: "FODNARrEGwAsh2JzeYTi", date:	"2024-01-27 19:35:07"},
{id: "FODnb0Wk2M7ALdwjmjb3", date:	"2023-12-02 03:59:21"},
{id: "FODNcafOfP21UJ1xcd9k", date:	"2024-03-15 17:32:15"},
{id: "FODnfGU5skiBXi4lmxdk", date:	"2023-11-25 23:17:38"},
{id: "FODnFZyUqkyAbWLNUvUF", date:	"2024-03-31 07:47:18"},
{id: "FODnjjEZ1PJbpz2c8j6Z", date:	"2024-04-29 05:08:53"},
{id: "FODNmXg3j5vGwCqRTfaE", date:	"2024-05-08 05:38:36"},
{id: "FODnR6fYRLHRQ1GOavSU", date:	"2024-03-15 19:01:55"},
{id: "FODNS1MP7I4BA276MdGu", date:	"2024-05-09 13:07:38"},
{id: "FODnsNbRvb3caDW35r5S", date:	"2024-01-07 10:59:46"},
{id: "FODnVNfPeYthsmcoGrqQ", date:	"2024-05-08 13:04:45"},
{id: "FODNxdkTYM2496XWJaaR", date:	"2024-04-21 14:15:14"},
{id: "FODO5k4xNyVdRkhCA6lv", date:	"2024-05-05 11:03:07"},
{id: "FODOcd96mLpv0TD2ecq9", date:	"2023-10-13 06:03:37"},
{id: "FODOIkqhm1IandwX3D5c", date:	"2024-01-02 14:09:56"},
{id: "FODoNZxhImlAYcM2WOkl", date:	"2024-05-13 22:24:09"},
{id: "FODOy3n5MLtOzAmMcBF9", date:	"2024-06-20 15:51:11"},
{id: "FODozGqypa61x4owv6jc", date:	"2024-05-09 18:19:04"},
{id: "FODp60F4xnCExZFT2F05", date:	"2024-02-10 20:01:13"},
{id: "FODp9ZTZbK7Uo1ueeAuX", date:	"2024-02-21 21:29:14"},
{id: "FODPAWvCprTBHRSVDKZw", date:	"2023-10-13 20:53:39"},
{id: "FODPH5mUMehKwtGavZpG", date:	"2023-12-07 10:58:47"},
{id: "FODPj292YuFt3BVw4ZCy", date:	"2024-05-11 11:32:12"},
{id: "FODPJXjjIs8N2TMKyXXj", date:	"2023-12-15 20:58:35"},
{id: "FODPlIIWGruqMaq33mzI", date:	"2024-04-28 17:46:20"},
{id: "FODPSX1KTvBhDcyYoSMH", date:	"2024-05-12 14:12:05"},
{id: "FODPZYt4E45vkNbjNcKz", date:	"2024-05-15 00:49:05"},
{id: "FODQ4VVqSa7zj5Q59bXX", date:	"2024-04-22 22:12:35"},
{id: "FODQGUetXeSbxOKoS5Oh", date:	"2024-01-25 11:15:53"},
{id: "FODQJkYP1zJ5OIpMmQDJ", date:	"2024-02-19 20:24:36"},
{id: "FODqL5rPnl8fgerQzcJb", date:	"2024-04-22 07:55:16"},
{id: "FODQn1gYKOy7eVITDXSX", date:	"2024-05-09 00:01:40"},
{id: "FODQWDbhVq8oqrUe8a7Z", date:	"2024-01-24 03:39:19"},
{id: "FODQYb4kos805OTTtA8Y", date:	"2024-04-02 01:12:54"},
{id: "FODQYuHCNlHPDKzPtVn1", date:	"2024-02-11 13:44:00"},
{id: "FODr11jKWVwiZ7jnjpYY", date:	"2024-04-27 05:44:22"},
{id: "FODr8eutGv17hKWGDEBK", date:	"2024-03-16 21:18:40"},
{id: "FODrcm9usD50C2ffa1Ii", date:	"2024-06-06 07:58:14"},
{id: "FODrI33ibpohhpLPzeeo", date:	"2024-05-03 16:25:08"},
{id: "FODRsFCHpaMVnh87Pfc7", date:	"2024-04-28 20:57:49"},
{id: "FODRSgJMOmNQwJxXON0T", date:	"2024-04-11 17:43:51"},
{id: "FODrTblItoZiSEROMmHl", date:	"2024-01-20 07:02:50"},
{id: "FODRTdHC8f8UjBPt6lQ1", date:	"2023-11-09 19:05:06"},
{id: "FODrVUZZHHf51MTlcS9E", date:	"2024-04-17 09:05:22"},
{id: "FODrxNh2lc2OyU8rrqsW", date:	"2023-11-11 01:02:56"},
{id: "FODS4BdqDVEEGEWGcpEJ", date:	"2024-04-04 21:50:20"},
{id: "FODS7SrakT7jI4jPk37O", date:	"2024-04-25 00:16:36"},
{id: "FODsikdlnXQDLnYCLceE", date:	"2024-04-27 16:24:38"},
{id: "FODsJT4CoYkZcff7HgdV", date:	"2024-02-20 08:25:01"},
{id: "FODSTJ30KjfvD6CKsyHx", date:	"2024-05-02 16:07:47"},
{id: "FODStnwWStmQLWXe8QOy", date:	"2024-05-04 11:51:00"},
{id: "FODSV4fsJJe3xYQ0SPcm", date:	"2024-05-01 16:16:09"},
{id: "FODsY1NXVi6S2W0bgGI3", date:	"2024-05-10 10:02:29"},
{id: "FODT2DMxrc2WfEUUAf2a", date:	"2023-12-06 02:12:00"},
{id: "FODt3Qc96XuYKEgdOvs5", date:	"2024-05-07 00:56:56"},
{id: "FODT6X1gxadG9wEhoGSf", date:	"2024-06-21 18:44:08"},
{id: "FODt95y9Ir8LX6hhkogC", date:	"2024-04-19 16:35:52"},
{id: "FODtAZJdi4xxFXJUIYLH", date:	"2024-05-04 15:29:29"},
{id: "FODtCQXaiel09Ny1ZRcc", date:	"2024-06-07 17:01:54"},
{id: "FODtfTVTC9XZS31fQF2j", date:	"2024-05-08 23:16:04"},
{id: "FODthtfK0J9iJhYpJO5D", date:	"2024-02-20 23:44:49"},
{id: "FODtHw2fsXDMZeJviTJT", date:	"2024-02-12 11:56:52"},
{id: "FODTng37nJ8BUJaZtF9i", date:	"2023-12-05 20:32:22"},
{id: "FODtPcAVIngGrkHQktJY", date:	"2024-05-27 13:08:37"},
{id: "FODTwC0ghwTjFwk7dGST", date:	"2023-06-27 03:34:39"},
{id: "FODTz2Qri381L6ehrbCH", date:	"2023-11-16 20:20:48"},
{id: "FODTZyS9grgeqLAzV5cD", date:	"2024-03-26 20:44:21"},
{id: "FODU3w4OlvZ0kVInaYos", date:	"2024-02-20 00:56:05"},
{id: "FODuaybKcCcVOZeuucQZ", date:	"2024-03-26 04:38:02"},
{id: "FODUoW7E5ifmZ7e5wvOZ", date:	"2024-04-08 01:04:07"},
{id: "FODUT9YTjRd0uKCkGk8f", date:	"2024-04-19 20:26:46"},
{id: "FODUVtfazli2nPdHH0RD", date:	"2024-04-08 06:08:29"},
{id: "FODVbW10dmlRIYtnMupF", date:	"2023-10-04 22:16:33"},
{id: "FODVcozFCD1si4VxtEwm", date:	"2024-06-27 13:20:02"},
{id: "FODVjT7AsfpcQCIzDXaK", date:	"2024-04-11 08:17:38"},
{id: "FODvpq7lxH5IjSFvI9ei", date:	"2024-03-13 18:35:17"},
{id: "FODvvDvgI8Nr9oxTO0Ge", date:	"2024-01-09 16:07:32"},
{id: "FODWDbRjBGb5aQw8KpVN", date:	"2024-02-15 01:33:56"},
{id: "FODwdDqhDoFZ56UFIIHr", date:	"2024-05-04 01:25:47"},
{id: "FODWKZVLFfC4zpvYbuAw", date:	"2023-08-03 21:41:37"},
{id: "FODwnLx6A5psSJzZnDBD", date:	"2024-03-29 23:20:55"},
{id: "FODWsRGZBEd3FelQQWL6", date:	"2024-04-29 11:48:47"},
{id: "FODwvqjKEbkxqP6ubSmG", date:	"2024-04-08 15:25:21"},
{id: "FODx0sc1MogZHs5YNIDg", date:	"2024-04-22 18:55:44"},
{id: "FODXacAMKua5Sm4cLdy2", date:	"2023-10-26 21:10:20"},
{id: "FODxanFuEWkYGsAKh7pf", date:	"2023-11-28 09:48:04"},
{id: "FODxcASq1CJkfIofjuS6", date:	"2024-04-21 21:30:33"},
{id: "FODxHbf016yEchTaBH4I", date:	"2024-05-20 05:19:31"},
{id: "FODxId3IhTHtwNkduoxs", date:	"2024-02-28 21:23:26"},
{id: "FODXkV7dvBeZiC1ResvQ", date:	"2023-12-28 18:58:30"},
{id: "FODxmkcVQfXUm6AFZ3eF", date:	"2023-11-15 11:04:56"},
{id: "FODXml8AUuvHIiqUFYTi", date:	"2024-04-30 23:30:14"},
{id: "FODxnuSjMBzTARliRMAI", date:	"2024-04-25 18:05:04"},
{id: "FODXVUOZKs6UR2v1W6d5", date:	"2024-04-15 02:15:19"},
{id: "FODY1SoBSyESPzntzGBZ", date:	"2024-04-13 12:27:11"},
{id: "FODYbXtOKtTq4SahW9Ul", date:	"2024-08-27 17:07:06"},
{id: "FODyfaSyjSWQU4rwamWL", date:	"2023-11-23 19:28:16"},
{id: "FODygZ2wMz5WLedtHmjl", date:	"2024-03-11 10:04:06"},
{id: "FODykb65es2jw08bYVn8", date:	"2024-05-08 16:31:36"},
{id: "FODYoKO51HGKWmaoPNmx", date:	"2024-01-05 23:19:57"},
{id: "FODYVETYCfF3bI1zlrNe", date:	"2023-08-25 11:43:37"},
{id: "FODz47jYFmykKuE9HsE3", date:	"2023-08-09 13:10:10"},
{id: "FODzAa0RwK7hXOxaZvtl", date:	"2023-09-11 12:49:42"},
{id: "FODzHcuu7lNqnSdFcXfL", date:	"2023-09-26 20:00:04"},
{id: "FODzj3bpPtjNkhOvf2wB", date:	"2024-01-12 02:46:04"},
{id: "FODZvcbdcOYheqH7t2sZ", date:	"2023-12-06 22:05:22"},
]

const cpUser = [
    { id: "USR04mbNgkJ0XUS0Uvsv", date: "2023-04-04 20:36:00" },
    { id: "USR0wJWn1U4bn0dC4a9S", date: "2023-05-08 02:27:04" },
    { id: "USR1JBasnfD3yIUU4lmu", date: "2024-05-31 02:00:57" },
    { id: "USR1JMCQCNYRX1Q9WKcz", date: "2023-06-25 19:28:01" },
    { id: "USR1tDZITJb31KtXrOqR", date: "2024-04-02 00:59:47" },
    { id: "USR3J74IipLHPp3CBYit", date: "2023-11-23 04:30:48" },
    { id: "USR4bReqqx8DOULpO1FP", date: "2023-08-31 23:43:35" },
    { id: "USR4qH1bZDMYcd21Iftg", date: "2023-06-01 21:02:24" },
    { id: "USR7NK5jSZPs8BBWz02L", date: "2023-11-15 08:42:46" },
    { id: "USR8rHBhRT1rmasVfXmU", date: "2023-05-22 16:32:40" },
    { id: "USR9ENw1tKis5mueWIos", date: "2023-10-19 18:02:39" },
    { id: "USRAdvMwehwAjDhZRCH6", date: "2024-03-14 05:17:53" },
    { id: "USRaI6QzdbHGchzIQfqT", date: "2023-01-08 22:51:21" },
    { id: "USRAj1QNO4rkZV4KQrwf", date: "2024-06-06 13:57:28" },
    { id: "USRaq6dOvN8UCZTj9wbc", date: "2023-02-04 23:08:59" },
    { id: "USRB6daq429GVZ2Luzhh", date: "2023-07-21 07:37:02" },
    { id: "USRBrBmwTLDQP94a7RfA", date: "2024-05-13 10:52:23" },
    { id: "USRBv5FruqYVX48xrKpZ", date: "2023-09-07 01:36:53" },
    { id: "USRc4TwrkPa8yZM2XTiq", date: "2023-12-29 12:32:29" },
    { id: "USRcColIQt25D6obzzzB", date: "2024-04-12 20:30:59" },
    { id: "USRcGd0OTfHHuvtg4khL", date: "2024-04-14 15:09:09" },
    { id: "USRCHbHdfGvj5gNA4QjT", date: "2023-05-16 15:33:24" },
    { id: "USRcLVoPNm6HhTLlXfYh", date: "2024-02-10 19:06:49" },
    { id: "USRDt4IIEjo4Cavl6tl6", date: "2024-04-25 16:56:55" },
    { id: "USRE9lhF6yQqYhkthcre", date: "2024-03-12 07:48:12" },
    { id: "USREMJ4GNk8CmxuZw2GC", date: "2023-08-19 09:56:31" },
    { id: "USRhhekQvwVd8fyYG1oE", date: "2023-06-11 19:36:06" },
    { id: "USRhydKe65dCVl4sQ30X", date: "2023-05-12 05:47:54" },
    { id: "USRIEofNFQ6FuYB7Hekr", date: "2023-08-05 01:27:10" },
    { id: "USRj2ql5lfrbiS08E8EE", date: "2023-12-16 01:49:15" },
    { id: "USRjirPgLoVMI7jnSnUY", date: "2024-04-03 15:11:21" },
    { id: "USRjkIdhZ4llzsl1r5IZ", date: "2023-10-14 21:17:57" },
    { id: "USRKZCN4lyiXdrpxebrP", date: "2024-06-23 04:29:09" },
    { id: "USRLEDhOX7wrd50TGfoM", date: "2023-03-16 14:35:23" },
    { id: "USRLngnCFmpfFnNBiADB", date: "2023-10-21 16:49:42" },
    { id: "USRltozOqwfoHyBSoKiS", date: "2023-03-14 18:02:57" },
    { id: "USRlYoBsu5ANnTkl7Mp6", date: "2023-07-15 22:47:47" },
    { id: "USRNPymUePpHOHJQAFfB", date: "2023-06-20 10:40:47" },
    { id: "USROicjnjinzer8C8E5e", date: "2024-02-24 10:45:29" },
    { id: "USRpaL87TQdnEF6eSxcJ", date: "2023-11-24 07:16:30" },
    { id: "USRpgp8KJJB96rLVNKqj", date: "2023-12-31 00:23:36" },
    { id: "USRPXzhLjIZ6UnSRx3Ef", date: "2023-10-28 12:33:20" },
    { id: "USRQDjflW6PCphDj3zAZ", date: "2024-06-29 08:31:17" },
    { id: "USRqi7zcUadOo6Uc5lfo", date: "2024-01-27 22:22:04" },
    { id: "USRriXdAE5b0UDiFKsYE", date: "2023-10-20 23:37:47" },
    { id: "USRrVTWZBNjhyS59wIvP", date: "2023-11-05 19:41:48" },
    { id: "USRsI8PURKNbJInumHVu", date: "2024-05-25 14:54:29" },
    { id: "USRsICxpzgrcekRxk7Qn", date: "2023-10-21 17:34:45" },
    { id: "USRsKj4K9K1vIxgujTFV", date: "2023-07-17 20:43:33" },
    { id: "USRSVze1o5dTOASbPuWe", date: "2024-03-21 11:36:41" },
    { id: "USRsY90qX8sftG1xeOdu", date: "2023-05-18 08:46:48" },
    { id: "USRT4KzPbjn5hDXXUzen", date: "2024-05-09 15:43:02" },
    { id: "USRTKOmxzvnSJpFcml7I", date: "2024-05-30 07:25:40" },
    { id: "USRtKqydvfFmYTpxzsPQ", date: "2023-10-07 02:40:18" },
    { id: "USRup96AWWju4uLhU49U", date: "2023-09-22 01:27:33" },
    { id: "USRuPpmypRSq7FRkbdbQ", date: "2024-05-28 22:59:00" },
    { id: "USRvdG9vZx1bn9qVgJqw", date: "2024-04-19 07:22:45" },
    { id: "USRVfq2tk9Xf9lZtcAl9", date: "2023-04-21 16:08:30" },
    { id: "USRVyJvDOmKV91vFqzdJ", date: "2023-05-31 22:22:44" },
    { id: "USRwAyyo617hdBFLKg2o", date: "2024-06-05 06:35:25" },
    { id: "USRWLgKQZNGafwFz5bWJ", date: "2023-09-16 01:14:16" },
    { id: "USRx5mlIJcq4Yitj5l81", date: "2023-03-18 04:43:20" },
    { id: "USRXeGrmeyd4p3WHsTDw", date: "2024-03-12 01:29:59" },
    { id: "USRXxmHMa74M5YVSAe8Z", date: "2023-11-03 10:35:13" },
    { id: "USRyKxC5YmcWfwhHBSiL", date: "2023-03-11 18:46:34" },
    { id: "USRyvAVlDbrjd782J16c", date: "2023-05-13 07:42:22" },
    { id: "USRz9br1aKEIgDAWFkGN", date: "2023-12-12 01:12:02" },
    { id: "USRZKn1fwjREGgyyiLTt", date: "2023-06-16 02:06:46" },
    { id: "USRzVByq7ul1zQOzZ4Qa", date: "2024-02-21 19:58:58" },
    { id: "USRzX4NJa6DrWlLRCj6f", date: "2023-04-19 10:27:33" },
]

const createCPItems = (arrcp, arrItem) => {
    let query = "INSERT INTO couponitems (Id, CouponID, FoodID) VALUES \n";
    const res = arrcp.map((item, index) => {
        const foodID = arrItem.filter((i, index) => {
            return item.startDate >= i.date;
        }).map(i => i.id);
        return { id: item.id, foodID: foodID };
    }).forEach((item, index) => {
        const length = item.foodID.length;
        for (let i = 0; i < length; i++) {
            query += `('${createID('CPI')}', '${item.id}', '${item.foodID[i]}'),\n`
        }
    });
    fs.writeFile('syntax.sql', query.slice(0, -1) + ';', 'utf8', (err) => {
        if (err) {
            console.log(err);
        }
    }
    )
}

const createCPUser = (arrcp, arrItem) => {
    let query = "INSERT INTO couponuser (Id, CouponID, Status, UserID) VALUES \n";
    const res = arrcp.map((item, index) => {
        const userID = arrItem.filter((i, index) => {
            return item.startDate >= i.date;
        }).map(i => i.id);
        return { id: item.id, userID: userID };
    }).forEach((item, index) => {
        const length = item.userID.length;
        for (let i = 0; i < length; i++) {
            query += `('${createID('CPU')}', '${item.id}', '${Math.floor(Math.random())}', '${item.userID[i]}'),\n`
        }
    });
    fs.writeFile('syntax.sql', query.slice(0, -1) + ';', 'utf8', (err) => {
        if (err) {
            console.log(err);
        }
    }
    )
}

const createEvent = (arrcp, arradmin) => {
    let query = "INSERT INTO events (Id, Title, Content, Start, End, CreateAt, UpdateAt, CreateBy, UpdateBy, CouponID) VALUES \n";
    const res = arrcp.map((item, index) => {
        return {
            id: createID('EVT'), title: `Sự kiện ${index}`, content: `Vào sự kiện ${index}, các món ăn trong sự kiện sẽ được giảm giá ${item.discount}%. 
        Mã sự kiện: ${item.code}`
            , start: item.startDate, end: item.endDate, createAt: item.startDate, updateAt: item.hasUpdate ? item.updateDate : 'NULL', createBy: item.createBy, updateBy: item.hasUpdate ? item.updateBy : 'NULL', couponID: item.id
        }
    })
    res.forEach((item, index) => {
        query += `('${item.id}', '${item.title}', '${item.content}', '${item.start}', '${item.end}', '${item.createAt}', ${item.updateAt}, '${item.createBy}', ${item.updateBy}, '${item.couponID}'),\n`
    });
    fs.writeFile('syntax.sql', query.slice(0, -2) + ';', 'utf8', (err) => {
        if (err) {
            console.log(err);
        }
    }
    )
}


createEvent(cp, createBy);