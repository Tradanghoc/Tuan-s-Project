const { error } = require('console');
const fs = require('fs');

function createID(prefix) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = prefix;
    for (let i = 0; i < 17; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

function conditionDate(start) {
    let date = new Date(start.toString().replace(' ', 'T') + '.000Z');
    let endDate = new Date("2024-05-04T19:13:35");
    return new Date(date.getTime() + Math.random() * (endDate.getTime() - date.getTime()));
}

function conditionDate2(start, end) {
    if (typeof start !== 'string') {
        throw new Error('Invalid argument: start must be a string');
    }
    let date = new Date(start.replace(' ', 'T') + '.000Z');
    let endDate = new Date(end.replace(' ', 'T') + '.000Z');
    return new Date(date.getTime() + Math.random() * (endDate.getTime() - date.getTime()));
}

function conditionDate3(start) {
    let date = new Date(start.toString().replace(' ', 'T') + '.000Z');
    let endDate = new Date(date.getTime() + 1000 * 60 * 60 * 24 * 5);
    return new Date(date.getTime() + Math.random() * (endDate.getTime() - date.getTime()));
}

function conditionDate4(start) {
    start = start.toString().replace(' ', 'T') + '.000Z';
    let date = new Date(start);
    let endDate = new Date(date.getTime() + 1000 * 60 * 60);
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

const user = [
{id: "USR04mbNgkJ0XUS0Uvsv", name: "Phạm Thành Định", date: "2023-04-04 20:36:00"},
{id: "USR0wJWn1U4bn0dC4a9S", name: "Trương Văn Đồng", date: "2023-05-08 02:27:04"},
{id: "USR1JBasnfD3yIUU4lmu", name: "Vũ Thế Hà", date: "2024-05-31 02:00:57"},
{id: "USR1JMCQCNYRX1Q9WKcz", name: "Hoàng Thị Đăng", date: "2023-06-25 19:28:01"},
{id: "USR1tDZITJb31KtXrOqR", name: "Đinh Thành Đồng", date: "2024-04-02 00:59:47"},
{id: "USR3J74IipLHPp3CBYit", name: "Trần Thế Giang", date: "2023-11-23 04:30:48"},
{id: "USR4bReqqx8DOULpO1FP", name: "Ngô Văn Chinh", date: "2023-08-31 23:43:35"},
{id: "USR4qH1bZDMYcd21Iftg", name: "Lê Thế Anh", date: "2023-06-01 21:02:24"},
{id: "USR7NK5jSZPs8BBWz02L", name: "Ngô Văn Ngọc", date: "2023-11-15 08:42:46"},
{id: "USR8rHBhRT1rmasVfXmU", name: "Hồ Thế Chí", date: "2023-05-22 16:32:40"},
{id: "USR9ENw1tKis5mueWIos", name: "Lê Đình Điền", date: "2023-10-19 18:02:39"},
{id: "USRAdvMwehwAjDhZRCH6", name: "Lê Hữu Hải", date: "2024-03-14 05:17:53"},
{id: "USRaI6QzdbHGchzIQfqT", name: "Đinh Thành Điền", date: "2023-01-08 22:51:21"},
{id: "USRAj1QNO4rkZV4KQrwf", name: "Hoàng Thế Hải", date: "2024-06-06 13:57:28"},
{id: "USRaq6dOvN8UCZTj9wbc", name: "Lê Thế Đinh", date: "2023-02-04 23:08:59"},
{id: "USRB6daq429GVZ2Luzhh", name: "Vũ Quốc Tâm", date: "2023-07-21 07:37:02"},
{id: "USRBrBmwTLDQP94a7RfA", name: "Bùi Văn Hàm", date: "2024-05-13 10:52:23"},
{id: "USRBv5FruqYVX48xrKpZ", name: "Trương Đức Quân", date: "2023-09-07 01:36:53"},
{id: "USRc4TwrkPa8yZM2XTiq", name: "Đinh Đức Phúc", date: "2023-12-29 12:32:29"},
{id: "USRcColIQt25D6obzzzB", name: "Võ Thị Đăng", date: "2024-04-12 20:30:59"},
{id: "USRcGd0OTfHHuvtg4khL", name: "Trương Thế Đan", date: "2024-04-14 15:09:09"},
{id: "USRCHbHdfGvj5gNA4QjT", name: "Đặng Văn Đức", date: "2023-05-16 15:33:24"},
{id: "USRcLVoPNm6HhTLlXfYh", name: "Phạm Thị Đường", date: "2024-02-10 19:06:49"},
{id: "USRDt4IIEjo4Cavl6tl6", name: "Đinh Văn Đăng", date: "2024-04-25 16:56:55"},
{id: "USRE9lhF6yQqYhkthcre", name: "Đỗ Đình Đoàn", date: "2024-03-12 07:48:12"},
{id: "USREMJ4GNk8CmxuZw2GC", name: "Võ Thế Tuấn", date: "2023-08-19 09:56:31"},
{id: "USRhhekQvwVd8fyYG1oE", name: "Vũ Thị Tú", date: "2023-06-11 19:36:06"},
{id: "USRhydKe65dCVl4sQ30X", name: "Phan Minh Hoa", date: "2023-05-12 05:47:54"},
{id: "USRIEofNFQ6FuYB7Hekr", name: "Võ Thị Giang", date: "2023-08-05 01:27:10"},
{id: "USRj2ql5lfrbiS08E8EE", name: "Bùi Văn Phú", date: "2023-12-16 01:49:15"},
{id: "USRjirPgLoVMI7jnSnUY", name: "Bùi Hữu Đoàn", date: "2024-04-03 15:11:21"},
{id: "USRjkIdhZ4llzsl1r5IZ", name: "Vũ Thành Sơn", date: "2023-10-14 21:17:57"},
{id: "USRKZCN4lyiXdrpxebrP", name: "Võ Đình Giang", date: "2024-06-23 04:29:09"},
{id: "USRLEDhOX7wrd50TGfoM", name: "Dương Thị Chinh", date: "2023-03-16 14:35:23"},
{id: "USRLngnCFmpfFnNBiADB", name: "Hồ Đức Định", date: "2023-10-21 16:49:42"},
{id: "USRltozOqwfoHyBSoKiS", name: "Lê Minh Đăng", date: "2023-03-14 18:02:57"},
{id: "USRlYoBsu5ANnTkl7Mp6", name: "Trần Thị Dũng", date: "2023-07-15 22:47:47"},
{id: "USRNPymUePpHOHJQAFfB", name: "Trần Hữu Dũng", date: "2023-06-20 10:40:47"},
{id: "USROicjnjinzer8C8E5e", name: "Đặng Đình Huyền", date: "2024-02-24 10:45:29"},
{id: "USRpaL87TQdnEF6eSxcJ", name: "Đinh Thị Bảo", date: "2023-11-24 07:16:30"},
{id: "USRpgp8KJJB96rLVNKqj", name: "Ngô Thế Hồng", date: "2023-12-31 00:23:36"},
{id: "USRPXzhLjIZ6UnSRx3Ef", name: "Phan Văn Duy", date: "2023-10-28 12:33:20"},
{id: "USRQDjflW6PCphDj3zAZ", name: "Lê Văn Cường", date: "2024-06-29 08:31:17"},
{id: "USRqi7zcUadOo6Uc5lfo", name: "Bùi Văn Sơn", date: "2024-01-27 22:22:04"},
{id: "USRriXdAE5b0UDiFKsYE", name: "Trương Thế Huy", date: "2023-10-20 23:37:47"},
{id: "USRrVTWZBNjhyS59wIvP", name: "Bùi Thế Huyền", date: "2023-11-05 19:41:48"},
{id: "USRsI8PURKNbJInumHVu", name: "Hồ Thị Dương", date: "2024-05-25 14:54:29"},
{id: "USRsICxpzgrcekRxk7Qn", name: "Đinh Văn Tân", date: "2023-10-21 17:34:45"},
{id: "USRsKj4K9K1vIxgujTFV", name: "Phạm Đức Tài", date: "2023-07-17 20:43:33"},
{id: "USRSVze1o5dTOASbPuWe", name: "Nguyễn Đình Sơn", date: "2024-03-21 11:36:41"},
{id: "USRsY90qX8sftG1xeOdu", name: "Võ Văn Đức", date: "2023-05-18 08:46:48"},
{id: "USRT4KzPbjn5hDXXUzen", name: "Ngô Đình Đường", date: "2024-05-09 15:43:02"},
{id: "USRTKOmxzvnSJpFcml7I", name: "Phan Quốc Hà", date: "2024-05-30 07:25:40"},
{id: "USRtKqydvfFmYTpxzsPQ", name: "Phan Văn Anh", date: "2023-10-07 02:40:18"},
{id: "USRup96AWWju4uLhU49U", name: "Dương Thành Anh", date: "2023-09-22 01:27:33"},
{id: "USRuPpmypRSq7FRkbdbQ", name: "Ngô Văn Anh", date: "2024-05-28 22:59:00"},
{id: "USRvdG9vZx1bn9qVgJqw", name: "Đinh Quốc Tú", date: "2024-04-19 07:22:45"},
{id: "USRVfq2tk9Xf9lZtcAl9", name: "Phạm Đức Phong", date: "2023-04-21 16:08:30"},
{id: "USRVyJvDOmKV91vFqzdJ", name: "Võ Văn Huy", date: "2023-05-31 22:22:44"},
{id: "USRwAyyo617hdBFLKg2o", name: "Huỳnh Văn Hoa", date: "2024-06-05 06:35:25"},
{id: "USRWLgKQZNGafwFz5bWJ", name: "Phạm Đức Hưng", date: "2023-09-16 01:14:16"},
{id: "USRx5mlIJcq4Yitj5l81", name: "Đặng Văn Phong", date: "2023-03-18 04:43:20"},
{id: "USRXeGrmeyd4p3WHsTDw", name: "Trương Đình Đăng", date: "2024-03-12 01:29:59"},
{id: "USRXxmHMa74M5YVSAe8Z", name: "Nguyễn Đức Đinh", date: "2023-11-03 10:35:13"},
{id: "USRyKxC5YmcWfwhHBSiL", name: "Võ Văn Dũng", date: "2023-03-11 18:46:34"},
{id: "USRyvAVlDbrjd782J16c", name: "Dương Văn Huy", date: "2023-05-13 07:42:22"},
{id: "USRz9br1aKEIgDAWFkGN", name: "Hồ Văn Đạt", date: "2023-12-12 01:12:02"},
{id: "USRZKn1fwjREGgyyiLTt", name: "Võ Thành Đào", date: "2023-06-16 02:06:46"},
{id: "USRzVByq7ul1zQOzZ4Qa", name: "Lê Thế Quyền", date: "2024-02-21 19:58:58"},
{id: "USRzX4NJa6DrWlLRCj6f", name: "Hồ Văn Hoa", date: "2023-04-19 10:27:33"},
]

const res = [
{id: "RES0BmlpsUBKFICav1D7", date: "2024-03-14 13:16:48"},
{id: "RES1LHYyMrzD7Y3xjvTd", date: "2023-11-10 08:10:41"},
{id: "RES2BeLwa7voDBIVHJwl", date: "2024-02-12 21:16:58"},
{id: "RES2J6GvojOQOg2MHTNF", date: "2023-10-20 18:02:39"},
{id: "RES3PU54I5eVAVLjt7YL", date: "2023-12-30 12:32:29"},
{id: "RES4JXHQ6R9tN9m5jj7g", date: "2023-12-14 07:53:04"},
{id: "RES4T6DBFZFdSAe6pXUS", date: "2024-02-21 20:58:58"},
{id: "RES5Acs5BGNRxtEx336r", date: "2024-01-23 09:51:16"},
{id: "RES6ZIBc5gqAIcSABoRS", date: "2024-05-09 17:43:02"},
{id: "RES7CxKQEYufoDXHWvy7", date: "2023-06-11 12:22:44"},
{id: "RES7WnriZ90BdCepnKGO", date: "2024-12-02 11:23:21"},
{id: "RES8A0zyC6CNH9KFjdqe", date: "2024-05-12 01:21:50"},
{id: "RES99GHWtnwWJckAXeWW", date: "2023-12-21 02:56:54"},
{id: "RESaGkhx06NgkDYMJoxm", date: "2023-08-25 20:28:28"},
{id: "RESaHiAEHhzpdTjC8A2I", date: "2023-06-15 19:36:06"},
{id: "RESAU7UUyTRGAIVoGOtX", date: "2023-12-13 09:13:34"},
{id: "RESBgpsDkqMelZSAFnoM", date: "2023-06-22 02:06:46"},
{id: "RESbZuEMArwzyAc6CqR2", date: "2023-06-13 07:01:52"},
{id: "RESc4ly2NW3Mv2qZX0db", date: "2024-05-12 05:51:50"},
{id: "RESDkK4VNlkGqcicIL6t", date: "2024-02-29 09:58:37"},
{id: "RESFmgOfDzQ8HaFOdvMf", date: "2023-11-10 18:48:37"},
{id: "RESg4ib6NvurUJiBRtOQ", date: "2023-07-29 19:09:35"},
{id: "RESiayghbNWGT6Sip2Gs", date: "2024-04-03 15:11:21"},
{id: "RESJgVWb4nqZDPCCX0qf", date: "2023-12-31 00:23:36"},
{id: "RESJNZnoPhAb97lIXVxv", date: "2023-05-21 10:02:44"},
{id: "RESKnSzfQR2kEXta7Frg", date: "2024-03-09 02:56:06"},
{id: "RESkOUiPbEHhrunZ4WT9", date: "2024-05-14 10:52:23"},
{id: "RESL2yZ120HfXK0LkG3C", date: "2023-09-28 16:49:58"},
{id: "RESMBIBK5kHVlTktnh3x", date: "2023-11-03 10:35:13"},
{id: "RESNByuO628aItyTMqrO", date: "2024-03-02 21:48:27"},
{id: "RESoMxW1G9KNnsqBVvRr", date: "2023-09-16 01:14:16"},
{id: "RESoNoyyEbwwnjkYsGSY", date: "2024-04-25 16:56:55"},
{id: "RESPdSCaymcs95DIWMAS", date: "2024-02-08 14:06:30"},
{id: "RESpfxhqR7sB23ORzFmS", date: "2024-04-19 07:22:45"},
{id: "RESqQIr7jXpp2GfvmBjK", date: "2023-09-07 01:36:53"},
{id: "RESSomzvFRNF6K7kMPhY", date: "2024-04-02 00:59:47"},
{id: "RESSTmJLxlynBHkVoJlP", date: "2024-06-08 06:35:25"},
{id: "RESSZNSFwb0BXm3wKJfH", date: "2024-02-12 19:06:49"},
{id: "REStVDL1LJmBpFoAlwTB", date: "2024-03-14 05:17:53"},
{id: "RESTZeV1oNzqvBKXJeOS", date: "2024-05-15 17:22:27"},
{id: "RESUS1InGUrAjM9a3hvQ", date: "2023-11-20 14:26:07"},
{id: "RESUxR2gOK9oEESPJmGF", date: "2024-05-30 07:25:40"},
{id: "RESuYL2PKSWicpaV0Uan", date: "2023-10-22 17:34:45"},
{id: "RESVlcW7G4cznwbd17Se", date: "2023-02-09 08:27:29"},
{id: "RESWbQKoMkSBwRsNEmjy", date: "2024-05-09 17:17:39"},
{id: "RESWd5w5lnOvSHAGISVD", date: "2024-06-23 04:29:09"},
{id: "RESxBnr4zu3LCkrOLWoU", date: "2023-11-14 09:15:36"},
{id: "RESXqZCHD7wWtNdgHoF0", date: "2024-01-29 18:22:04"},
{id: "RESxyziJdoqRXOAellEf", date: "2024-04-14 15:09:09"},
{id: "RESYfWzouJOsMUlpv3Nl", date: "2023-11-24 04:30:48"},
]

const foods = [
    {id: "FOD0N3k0s6xrtlx2zhaD", date: "2024-04-11 12:58:31"},
    {id: "FOD161eK0wEDgJ4f7bw5", date: "2024-05-03 04:13:59"},
    {id: "FOD1dncXStQgn2waSmlF", date: "2024-03-15 17:59:54"},
    {id: "FOD1eoobwpi5hCvvpgLv", date: "2024-05-08 15:07:08"},
    {id: "FOD1mZFs6VqtvL1V4SJF", date: "2024-01-15 17:25:52"},
    {id: "FOD1RuE1TgbotsRLEJr3", date: "2023-11-15 20:08:12"},
    {id: "FOD1wjn2VGVNo8IoINgZ", date: "2024-03-24 21:43:10"},
    {id: "FOD270u5ja4ZgHrsHg63", date: "2024-04-08 07:06:30"},
    {id: "FOD2fVs8fPRyPMcCbg5h", date: "2024-03-03 13:05:55"},
    {id: "FOD2jsbwHHBVKlEIfwGE", date: "2024-03-10 17:08:17"},
    {id: "FOD2oFFzazWMGgB7Sp2q", date: "2024-05-09 07:33:14"},
    {id: "FOD2yKFNsluOxRNP0FsS", date: "2024-05-06 00:13:46"},
    {id: "FOD32ep9GzgryXFO3Zh7", date: "2024-03-17 14:44:53"},
    {id: "FOD3aosZKHJ23y1wp7JE", date: "2023-10-22 06:44:44"},
    {id: "FOD3ChSd6qP4lpW2XUoY", date: "2024-04-08 13:13:16"},
    {id: "FOD3EiGTTIuXAqhXVqa6", date: "2024-04-20 20:29:13"},
    {id: "FOD3rVVm0mtvIiELsDyz", date: "2024-05-06 13:43:30"},
    {id: "FOD3tO9gAr9ztTed3u8g", date: "2023-12-18 17:22:57"},
    {id: "FOD3X9wHdzERTcYrGX7S", date: "2024-02-23 01:44:32"},
    {id: "FOD46BSUuZRh6taN8L6L", date: "2024-04-26 20:36:08"},
    {id: "FOD4IT8bhZ2OkYeDbmTl", date: "2024-04-11 10:01:03"},
    {id: "FOD4RxZzSLiG2eKAWUwk", date: "2024-01-18 22:53:14"},
    {id: "FOD5b4Sm5oI4XcIjZinG", date: "2024-04-06 02:18:00"},
    {id: "FOD5CweiQX9PiJD32Af4", date: "2024-02-04 04:44:05"},
    {id: "FOD6edK122bKt8NnYHna", date: "2024-04-05 10:47:59"},
    {id: "FOD6eVdEQ6MvcDB0fIGa", date: "2024-05-09 23:45:59"},
    {id: "FOD6OMjDP8ncuJJ5xCs8", date: "2024-05-07 21:05:58"},
    {id: "FOD6OrXfqd6OrSedlqYi", date: "2024-04-24 14:40:25"},
    {id: "FOD73sUygfbOhAZdx0pY", date: "2024-04-02 08:52:34"},
    {id: "FOD74m2EZ6LMIQxEfVMH", date: "2024-02-01 23:47:11"},
    {id: "FOD7cddOad0xUw2bgpgE", date: "2024-04-01 15:25:37"},
    {id: "FOD7ZDjRdgn98Q4O7Eg9", date: "2024-04-18 16:32:28"},
    {id: "FOD8DyFuB5hHplap5aZk", date: "2024-04-26 16:17:49"},
    {id: "FOD8KYPJ8VIoXNoZk0hs", date: "2024-04-09 03:45:36"},
    {id: "FOD8ZS9Yf6emMY1yWyQE", date: "2024-04-08 17:52:19"},
    {id: "FOD90gjtz1Vt4nYP3n9x", date: "2024-01-21 21:24:35"},
    {id: "FOD9cAvvZDesAow8aNeU", date: "2024-03-19 22:52:30"},
    {id: "FOD9CCF8xkV208FwGH3t", date: "2023-11-09 13:59:08"},
    {id: "FOD9dZT9NFN43MU6cueD", date: "2023-12-27 18:20:25"},
    {id: "FOD9I22VM2nKe12IrmpO", date: "2024-05-08 23:37:00"},
    {id: "FOD9k9qSGGIM9KHxNhnt", date: "2024-05-14 09:22:14"},
    {id: "FOD9SG1qTZdAVatxYgOq", date: "2023-11-13 17:36:00"},
    {id: "FODa4iOUN3T4AlMmqom8", date: "2024-03-19 21:13:20"},
    {id: "FODA5esJV67mZxhOB14l", date: "2024-04-07 04:17:16"},
    {id: "FODA9l5JcnTOBQzH4oAq", date: "2024-03-15 08:32:59"},
    {id: "FODabfBSEDfSwxaEHt3F", date: "2024-05-07 22:38:38"},
    {id: "FODacYxDxe3UKPOAnJz6", date: "2023-11-04 02:45:03"},
    {id: "FODAdFLD0kWxZsez2qgg", date: "2024-05-15 04:41:18"},
    {id: "FODalNMDqnIrmQdIGq9L", date: "2024-02-07 15:16:39"},
    {id: "FODaql7LL346mdECxVkg", date: "2024-03-23 15:13:01"},
    {id: "FODAqsZf4yzWePTe1l08", date: "2024-03-09 11:27:02"},
    {id: "FODAVJPYh3LWhKW8W0D9", date: "2024-05-12 07:38:54"},
    {id: "FODB0jcrIYGCKQROlsqU", date: "2024-02-17 07:41:53"},
    {id: "FODb4E9Gr7pVUxPGRB6S", date: "2023-07-15 03:43:54"},
    {id: "FODb72EgbLQXtGgLfyog", date: "2023-12-08 00:03:47"},
    {id: "FODBArXCVP2BIsuiD2qj", date: "2024-03-20 06:38:49"},
    {id: "FODbcKUXl6xv1nONFUqO", date: "2024-04-24 08:09:00"},
    {id: "FODbdVpvh3ysgN2H7LrJ", date: "2024-04-16 17:53:25"},
    {id: "FODbEjwMsUJg5bo4Di6o", date: "2024-03-06 11:55:10"},
    {id: "FODbeV42UD4Lc86IA48O", date: "2024-05-12 03:59:07"},
    {id: "FODbjdWneILnvWpJApBz", date: "2023-12-05 17:35:42"},
    {id: "FODBnIlyxGFYse6b9Ytk", date: "2023-10-22 13:45:51"},
    {id: "FODBSKbR1DLnf6yZTH91", date: "2023-12-24 16:31:39"},
    {id: "FODbtdRTBl2wiOnVOUy1", date: "2024-05-04 13:13:38"},
    {id: "FODbtu6o9D72mn9B1qGv", date: "2024-02-15 23:59:31"},
    {id: "FODBViUpkHj85enp8LhV", date: "2023-11-23 02:05:56"},
    {id: "FODC7kUMXVJ3DF2qru4H", date: "2024-03-10 05:29:36"},
    {id: "FODcFmtddCxs16Asbx96", date: "2024-01-11 05:36:19"},
    {id: "FODCMivk3NH3fh5N0i6D", date: "2024-05-05 02:35:14"},
    {id: "FODCTkXYtszzP9Kiobdg", date: "2024-04-01 22:41:51"},
    {id: "FODcV8CVI1KqzDD7SQ96", date: "2024-05-25 20:25:57"},
    {id: "FODCxINqgk9y7hHL7elk", date: "2024-05-09 19:36:45"},
    {id: "FODd3XD9iJaCchaYGsfZ", date: "2024-05-08 10:50:38"},
    {id: "FODD6DUTls6ck4fjFnWN", date: "2024-05-08 04:59:27"},
    {id: "FODD6vuim45IUr1IXk7n", date: "2024-04-11 12:42:31"},
    {id: "FODdicSx5o7qUYF2Ss73", date: "2024-04-01 04:47:29"},
    {id: "FODDvCc7feyDgD3ae8hD", date: "2024-05-08 06:37:15"},
    {id: "FODe167nCjgBKwQc2o9Q", date: "2024-04-22 15:52:33"},
    {id: "FODE92exeIuooJpxThRd", date: "2023-08-09 16:15:37"},
    {id: "FODEdPrnF5GkW455R7iX", date: "2023-08-31 16:08:41"},
    {id: "FODejzOBNkpN0L9d2Z0Y", date: "2024-01-02 05:21:24"},
    {id: "FODelrwpSAxQ7uOmOSwo", date: "2024-05-02 20:11:03"},
    {id: "FODenWM0rV0ra44F6huH", date: "2024-05-08 23:42:30"},
    {id: "FODeWwXeNaXfVMEi2mV7", date: "2024-04-06 02:42:38"},
    {id: "FODex4xZNn8WBpSjempC", date: "2024-05-03 16:04:59"},
    {id: "FODezAhAKs0tPMKVgzVT", date: "2024-02-26 15:42:56"},
    {id: "FODEzRfjQfdZ8IEzLPux", date: "2023-10-02 02:21:21"},
    {id: "FODFfT44vcHimTmXNcMg", date: "2024-05-04 00:13:38"},
    {id: "FODFjf3MhyaiPWjYUG1i", date: "2024-04-26 13:05:35"},
    {id: "FODFMTITEpvv7erFKRso", date: "2024-04-14 23:49:52"},
    {id: "FODfNwkPrbmOJdLKcJzX", date: "2024-04-26 00:29:51"},
    {id: "FODFObtF4tTyDpH2CbYR", date: "2024-03-06 19:17:41"},
    {id: "FODfq9EWAsU8zEnY39Tq", date: "2024-05-04 02:50:17"},
    {id: "FODfv2WkyDJUO6Ip8pT4", date: "2024-05-14 03:32:35"},
    {id: "FODfwmT28TZVky6Ne0sz", date: "2023-12-29 12:48:56"},
    {id: "FODfxfcxWiEfRFEdzSk4", date: "2024-11-16 04:08:42"},
    {id: "FODFZXcsuJLZukbanwPB", date: "2024-04-06 23:58:14"},
    {id: "FODGE5RIwO13sdrJIgYU", date: "2024-05-12 10:08:32"},
    {id: "FODGT01IxFFpsozDxyoZ", date: "2024-05-07 07:21:24"},
    {id: "FODGVIu3PqNhH29kMBlL", date: "2024-01-30 17:17:51"},
    {id: "FODh4bww4eXTV4uzVgzF", date: "2024-02-18 04:30:28"},
    {id: "FODHPPdzNAWdO9F3TMRw", date: "2023-11-26 06:40:10"},
    {id: "FODhqljnHqZatGFnzIDa", date: "2024-05-04 21:47:12"},
    {id: "FODHXrSA27oOS3o23mq3", date: "2024-02-24 08:35:47"},
    {id: "FODhyzui9uWUfHXwEuj1", date: "2023-07-01 11:01:51"},
    {id: "FODI5PIP844Za8xc9REu", date: "2024-04-11 02:19:28"},
    {id: "FODI9u4VLjf4HORNhPt7", date: "2024-01-19 13:53:19"},
    {id: "FODIdKLXo6QkznsB7wC3", date: "2024-03-31 16:10:32"},
    {id: "FODIJnzvkyetsjvPzf8B", date: "2024-03-30 00:22:40"},
    {id: "FODimPxCzzLBLKm5oVqZ", date: "2024-05-18 02:38:49"},
    {id: "FODIQN63RzM1an6K68oi", date: "2024-05-05 20:17:43"},
    {id: "FODIWeV0wbOdGlhbVm7L", date: "2024-03-16 06:45:56"},
    {id: "FODIZfVo1ApAqm4vXklv", date: "2024-04-20 19:02:42"},
    {id: "FODj3YGyQh9PIkC1Blp5", date: "2024-04-24 13:25:46"},
    {id: "FODJCt45rBicxcW9XUDV", date: "2024-04-14 01:48:24"},
    {id: "FODJkvgBLnBdrQy5LPV9", date: "2023-12-26 02:45:32"},
    {id: "FODJPypZyQuBkdNxBXOW", date: "2024-06-30 19:33:45"},
    {id: "FODJrlTeY8UvdmJxcHhk", date: "2023-10-06 07:36:04"},
    {id: "FODk4s52iXrok2Qh1Cal", date: "2024-05-25 11:56:16"},
    {id: "FODKEArt9FIrHEdsISkz", date: "2024-04-04 12:38:53"},
    {id: "FODKHddJNh35MDs56hPB", date: "2023-07-13 05:58:38"},
    {id: "FODKiATlEmk1PBHwpVXz", date: "2024-04-16 01:23:13"},
    {id: "FODkjym7xw99cZGP0MeZ", date: "2023-11-22 21:23:40"},
    {id: "FODKMoa11gZyBRd9VZMd", date: "2024-02-21 18:27:05"},
    {id: "FODkO8YR27GLOPKLT9OB", date: "2023-11-25 11:27:18"},
    {id: "FODks2MLxKqO75MnP3z7", date: "2024-03-19 12:50:44"},
    {id: "FODKswJV5lOT5ot3jjeu", date: "2024-02-26 01:22:47"},
    {id: "FODkUIXtKmtxd1ZEtHG7", date: "2023-12-05 08:13:11"},
    {id: "FODlbGRInqBoPXtbfFEc", date: "2024-03-19 16:06:52"},
    {id: "FODLlyWAGeRpnAAhy9Y0", date: "2024-04-25 04:53:06"},
    {id: "FODlMGiRDtqRMUiOot15", date: "2023-12-16 12:35:09"},
    {id: "FODLMPaxMYwxURbreovG", date: "2024-05-10 12:15:38"},
    {id: "FODlnUXGd5Wwj0e7NLud", date: "2024-04-28 06:54:51"},
    {id: "FODLOj8ytP7rDQe1yvCV", date: "2024-04-09 13:07:17"},
    {id: "FODLP6shtxnBPq5MqYkT", date: "2024-05-03 10:57:38"},
    {id: "FODlSbsQyJu1sgiZBcjm", date: "2023-07-07 04:22:53"},
    {id: "FODlsEYtVRbaRDwDyDBl", date: "2024-04-30 05:35:04"},
    {id: "FODmANrh0wFOnfe0kHAa", date: "2024-05-04 20:48:59"},
    {id: "FODmBdfe1QpQMDNf2FO3", date: "2024-01-01 01:46:08"},
    {id: "FODmd5UrrIdPh3ArUDFS", date: "2024-01-10 23:24:16"},
    {id: "FODMMfkfPW820K7EhAx1", date: "2024-04-07 14:55:27"},
    {id: "FODmOYmSh70DhryipLsV", date: "2023-02-21 16:10:50"},
    {id: "FODmS2FM49jfRMLKLEo9", date: "2024-03-16 22:08:16"},
    {id: "FODN1A6wnhj4cvWZaQNT", date: "2024-04-15 21:40:38"},
    {id: "FODNARrEGwAsh2JzeYTi", date: "2024-01-27 19:35:07"},
    {id: "FODnb0Wk2M7ALdwjmjb3", date: "2023-12-02 03:59:21"},
    {id: "FODNcafOfP21UJ1xcd9k", date: "2024-03-15 17:32:15"},
    {id: "FODnfGU5skiBXi4lmxdk", date: "2023-11-25 23:17:38"},
    {id: "FODnFZyUqkyAbWLNUvUF", date: "2024-03-31 07:47:18"},
    {id: "FODnjjEZ1PJbpz2c8j6Z", date: "2024-04-29 05:08:53"},
    {id: "FODNmXg3j5vGwCqRTfaE", date: "2024-05-08 05:38:36"},
    {id: "FODnR6fYRLHRQ1GOavSU", date: "2024-03-15 19:01:55"},
    {id: "FODNS1MP7I4BA276MdGu", date: "2024-05-09 13:07:38"},
    {id: "FODnsNbRvb3caDW35r5S", date: "2024-01-07 10:59:46"},
    {id: "FODnVNfPeYthsmcoGrqQ", date: "2024-05-08 13:04:45"},
    {id: "FODNxdkTYM2496XWJaaR", date: "2024-04-21 14:15:14"},
    {id: "FODO5k4xNyVdRkhCA6lv", date: "2024-05-05 11:03:07"},
    {id: "FODOcd96mLpv0TD2ecq9", date: "2023-10-13 06:03:37"},
    {id: "FODOIkqhm1IandwX3D5c", date: "2024-01-02 14:09:56"},
    {id: "FODoNZxhImlAYcM2WOkl", date: "2024-05-13 22:24:09"},
    {id: "FODOy3n5MLtOzAmMcBF9", date: "2024-06-20 15:51:11"},
    {id: "FODozGqypa61x4owv6jc", date: "2024-05-09 18:19:04"},
    {id: "FODp60F4xnCExZFT2F05", date: "2024-02-10 20:01:13"},
    {id: "FODp9ZTZbK7Uo1ueeAuX", date: "2024-02-21 21:29:14"},
    {id: "FODPAWvCprTBHRSVDKZw", date: "2023-10-13 20:53:39"},
    {id: "FODPH5mUMehKwtGavZpG", date: "2023-12-07 10:58:47"},
    {id: "FODPj292YuFt3BVw4ZCy", date: "2024-05-11 11:32:12"},
    {id: "FODPJXjjIs8N2TMKyXXj", date: "2023-12-15 20:58:35"},
    {id: "FODPlIIWGruqMaq33mzI", date: "2024-04-28 17:46:20"},
    {id: "FODPSX1KTvBhDcyYoSMH", date: "2024-05-12 14:12:05"},
    {id: "FODPZYt4E45vkNbjNcKz", date: "2024-05-15 00:49:05"},
    {id: "FODQ4VVqSa7zj5Q59bXX", date: "2024-04-22 22:12:35"},
    {id: "FODQGUetXeSbxOKoS5Oh", date: "2024-01-25 11:15:53"},
    {id: "FODQJkYP1zJ5OIpMmQDJ", date: "2024-02-19 20:24:36"},
    {id: "FODqL5rPnl8fgerQzcJb", date: "2024-04-22 07:55:16"},
    {id: "FODQn1gYKOy7eVITDXSX", date: "2024-05-09 00:01:40"},
    {id: "FODQWDbhVq8oqrUe8a7Z", date: "2024-01-24 03:39:19"},
    {id: "FODQYb4kos805OTTtA8Y", date: "2024-04-02 01:12:54"},
    {id: "FODQYuHCNlHPDKzPtVn1", date: "2024-02-11 13:44:00"},
    {id: "FODr11jKWVwiZ7jnjpYY", date: "2024-04-27 05:44:22"},
    {id: "FODr8eutGv17hKWGDEBK", date: "2024-03-16 21:18:40"},
    {id: "FODrcm9usD50C2ffa1Ii", date: "2024-06-06 07:58:14"},
    {id: "FODrI33ibpohhpLPzeeo", date: "2024-05-03 16:25:08"},
    {id: "FODRsFCHpaMVnh87Pfc7", date: "2024-04-28 20:57:49"},
    {id: "FODRSgJMOmNQwJxXON0T", date: "2024-04-11 17:43:51"},
    {id: "FODrTblItoZiSEROMmHl", date: "2024-01-20 07:02:50"},
    {id: "FODRTdHC8f8UjBPt6lQ1", date: "2023-11-09 19:05:06"},
    {id: "FODrVUZZHHf51MTlcS9E", date: "2024-04-17 09:05:22"},
    {id: "FODrxNh2lc2OyU8rrqsW", date: "2023-11-11 01:02:56"},
    {id: "FODS4BdqDVEEGEWGcpEJ", date: "2024-04-04 21:50:20"},
    {id: "FODS7SrakT7jI4jPk37O", date: "2024-04-25 00:16:36"},
    {id: "FODsikdlnXQDLnYCLceE", date: "2024-04-27 16:24:38"},
    {id: "FODsJT4CoYkZcff7HgdV", date: "2024-02-20 08:25:01"},
    {id: "FODSTJ30KjfvD6CKsyHx", date: "2024-05-02 16:07:47"},
    {id: "FODStnwWStmQLWXe8QOy", date: "2024-05-04 11:51:00"},
    {id: "FODSV4fsJJe3xYQ0SPcm", date: "2024-05-01 16:16:09"},
    {id: "FODsY1NXVi6S2W0bgGI3", date: "2024-05-10 10:02:29"},
    {id: "FODT2DMxrc2WfEUUAf2a", date: "2023-12-06 02:12:00"},
    {id: "FODt3Qc96XuYKEgdOvs5", date: "2024-05-07 00:56:56"},
    {id: "FODT6X1gxadG9wEhoGSf", date: "2024-06-21 18:44:08"},
    {id: "FODt95y9Ir8LX6hhkogC", date: "2024-04-19 16:35:52"},
    {id: "FODtAZJdi4xxFXJUIYLH", date: "2024-05-04 15:29:29"},
    {id: "FODtCQXaiel09Ny1ZRcc", date: "2024-06-07 17:01:54"},
    {id: "FODtfTVTC9XZS31fQF2j", date: "2024-05-08 23:16:04"},
    {id: "FODthtfK0J9iJhYpJO5D", date: "2024-02-20 23:44:49"},
    {id: "FODtHw2fsXDMZeJviTJT", date: "2024-02-12 11:56:52"},
    {id: "FODTng37nJ8BUJaZtF9i", date: "2023-12-05 20:32:22"},
    {id: "FODtPcAVIngGrkHQktJY", date: "2024-05-27 13:08:37"},
    {id: "FODTwC0ghwTjFwk7dGST", date: "2023-06-27 03:34:39"},
    {id: "FODTz2Qri381L6ehrbCH", date: "2023-11-16 20:20:48"},
    {id: "FODTZyS9grgeqLAzV5cD", date: "2024-03-26 20:44:21"},
    {id: "FODU3w4OlvZ0kVInaYos", date: "2024-02-20 00:56:05"},
    {id: "FODuaybKcCcVOZeuucQZ", date: "2024-03-26 04:38:02"},
    {id: "FODUoW7E5ifmZ7e5wvOZ", date: "2024-04-08 01:04:07"},
    {id: "FODUT9YTjRd0uKCkGk8f", date: "2024-04-19 20:26:46"},
    {id: "FODUVtfazli2nPdHH0RD", date: "2024-04-08 06:08:29"},
    {id: "FODVbW10dmlRIYtnMupF", date: "2023-10-04 22:16:33"},
    {id: "FODVcozFCD1si4VxtEwm", date: "2024-06-27 13:20:02"},
    {id: "FODVjT7AsfpcQCIzDXaK", date: "2024-04-11 08:17:38"},
    {id: "FODvpq7lxH5IjSFvI9ei", date: "2024-03-13 18:35:17"},
    {id: "FODvvDvgI8Nr9oxTO0Ge", date: "2024-01-09 16:07:32"},
    {id: "FODWDbRjBGb5aQw8KpVN", date: "2024-02-15 01:33:56"},
    {id: "FODwdDqhDoFZ56UFIIHr", date: "2024-05-04 01:25:47"},
    {id: "FODWKZVLFfC4zpvYbuAw", date: "2023-08-03 21:41:37"},
    {id: "FODwnLx6A5psSJzZnDBD", date: "2024-03-29 23:20:55"},
    {id: "FODWsRGZBEd3FelQQWL6", date: "2024-04-29 11:48:47"},
    {id: "FODwvqjKEbkxqP6ubSmG", date: "2024-04-08 15:25:21"},
    {id: "FODx0sc1MogZHs5YNIDg", date: "2024-04-22 18:55:44"},
    {id: "FODXacAMKua5Sm4cLdy2", date: "2023-10-26 21:10:20"},
    {id: "FODxanFuEWkYGsAKh7pf", date: "2023-11-28 09:48:04"},
    {id: "FODxcASq1CJkfIofjuS6", date: "2024-04-21 21:30:33"},
    {id: "FODxHbf016yEchTaBH4I", date: "2024-05-20 05:19:31"},
    {id: "FODxId3IhTHtwNkduoxs", date: "2024-02-28 21:23:26"},
    {id: "FODXkV7dvBeZiC1ResvQ", date: "2023-12-28 18:58:30"},
    {id: "FODxmkcVQfXUm6AFZ3eF", date: "2023-11-15 11:04:56"},
    {id: "FODXml8AUuvHIiqUFYTi", date: "2024-04-30 23:30:14"},
    {id: "FODxnuSjMBzTARliRMAI", date: "2024-04-25 18:05:04"},
    {id: "FODXVUOZKs6UR2v1W6d5", date: "2024-04-15 02:15:19"},
    {id: "FODY1SoBSyESPzntzGBZ", date: "2024-04-13 12:27:11"},
    {id: "FODYbXtOKtTq4SahW9Ul", date: "2024-08-27 17:07:06"},
    {id: "FODyfaSyjSWQU4rwamWL", date: "2023-11-23 19:28:16"},
    {id: "FODygZ2wMz5WLedtHmjl", date: "2024-03-11 10:04:06"},
    {id: "FODykb65es2jw08bYVn8", date: "2024-05-08 16:31:36"},
    {id: "FODYoKO51HGKWmaoPNmx", date: "2024-01-05 23:19:57"},
    {id: "FODYVETYCfF3bI1zlrNe", date: "2023-08-25 11:43:37"},
    {id: "FODz47jYFmykKuE9HsE3", date: "2023-08-09 13:10:10"},
    {id: "FODzAa0RwK7hXOxaZvtl", date: "2023-09-11 12:49:42"},
    {id: "FODzHcuu7lNqnSdFcXfL", date: "2023-09-26 20:00:04"},
    {id: "FODzj3bpPtjNkhOvf2wB", date: "2024-01-12 02:46:04"},
    {id: "FODZvcbdcOYheqH7t2sZ", date: "2023-12-06 22:05:22"},
    ]

const goodFoodReply = [
    "Món ăn này ngon quá, lần sau sẽ mua ủng hộ shop tiếp nha",
    "Ăn sướng miệng thật, món này shop làm là nhất",
    "Ngồi chơi ăn này làm mồi nhắm cũng vui",
    "Mẹ ơi, mẹ là chủ nhà hàng hả sao vị món ăn ngon như mẹ nấu thế"
]

const badFoodReply = [
    "Món ăn cũng tạm ổn à",
    "Ăn hơi bị lạ, mùi cứ chua chua ấy",
    "Món ăn chả có gì giống hình cả",
    "Ăn ngán quá chả muốn mua lại đâu"
]

const goodResReply = [
    "Shop làm ăn uy tín phết, luôn làm tròn nhiệm vụ, yêu shop!!",
    "Chủ shop dễ thương quá, yêu shop ghê",
    "Tôi đã cho bạn vào danh sách yêu thích rồi đấy, cố gắng nha",
    "Đặt hàng online ăn cũng ngon mà ăn tại quán cũng ngon"
]

const badResReply = [
    "Shop làm ăn chả có trách nhiệm gì cả, đợi cả tiếng chưa xong món ăn",
    "Lừa đảo hay sao mà đặt hàng mãi vẫn chưa thấy giao",
    "Món ăn ở đây tệ lắm, mọi người đừng mua",
    "Ông chủ shop này hách dịch lắm"
]

const createResReview = (user) => {
    let query = "INSERT INTO reviews (Id, Point, UserID, TargetID, Comment, Status, CreateAt, UpdateAt) VALUES\n";
    const baseUser = user;
    res.forEach(item => {
        user = baseUser.slice();
        const times = Math.random() * 15;
        for (let i = 0; i < times; i++) {
            const id = createID('REV');
            const point = (Math.floor(Math.random() * 4 ) ) + 1;
            const cmt = point >= 3 ? goodResReply[Math.floor(Math.random()*goodResReply.length)] : badResReply[Math.floor(Math.random()*badResReply.length)];
            const stt = Math.random() > 0.7 ? 'Removed' : 'Active';
            const create = formatDate(conditionDate(item.date));
            const update = formatDate(conditionDate(create));
            const person = user.splice(Math.floor(Math.random() * user.length), 1)[0];
            if(!person) continue;
            query += `('${id}', '${point}', '${person.id}', '${item.id}', '${cmt}', '${stt}', '${create}', '${update}'),\n`
        }
    });

    fs.writeFile("insertReviews.sql", query.slice(0,-2)+';', (err) => {
        if (err) console.log(err);
    });
}

createResReview(user);