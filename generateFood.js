
function createID(prefix) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = prefix;
    for (let i = 0; i < 17; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}
const resID = [
    { id: 'RESKnSzfQR2kEXta7Frg', date: "2024-03-09 02:56:06" },
    { id: 'RESc4ly2NW3Mv2qZX0db', date: "2024-05-12 05:51:50" },
    { id: 'RESg4ib6NvurUJiBRtOQ', date: "2023-07-29 19:09:35" },
    { id: 'RESWd5w5lnOvSHAGISVD', date: "2024-06-23 04:29:09" },
    { id: 'RESpfxhqR7sB23ORzFmS', date: "2024-04-19 07:22:45" },
    { id: 'RESuYL2PKSWicpaV0Uan', date: "2023-10-22 17:34:45" },
    { id: 'RESSTmJLxlynBHkVoJlP', date: "2024-06-08 06:35:25" },
    { id: 'RESWbQKoMkSBwRsNEmjy', date: "2024-05-09 17:17:39" },
    { id: 'RESJgVWb4nqZDPCCX0qf', date: "2023-12-31 00:23:36" },
    { id: 'RESkOUiPbEHhrunZ4WT9', date: "2024-05-14 10:52:23" },
    { id: 'RESVlcW7G4cznwbd17Se', date: "2023-02-09 08:27:29" },
    { id: 'RES4JXHQ6R9tN9m5jj7g', date: "2023-12-14 07:53:04" },
    { id: 'RESoNoyyEbwwnjkYsGSY', date: "2024-04-25 16:56:55" },
    { id: 'RESxyziJdoqRXOAellEf', date: "2024-04-14 15:09:09" },
    { id: 'RES8A0zyC6CNH9KFjdqe', date: "2024-05-12 01:21:50" },
    { id: 'RES7WnriZ90BdCepnKGO', date: "2024-12-02 11:23:21" },
    { id: 'RESbZuEMArwzyAc6CqR2', date: "2023-06-13 07:01:52" },
    { id: 'RESaGkhx06NgkDYMJoxm', date: "2023-08-25 20:28:28" },
    { id: 'RESaHiAEHhzpdTjC8A2I', date: "2023-06-15 19:36:06" },
    { id: 'RESYfWzouJOsMUlpv3Nl', date: "2023-11-24 04:30:48" },
    { id: 'RES0BmlpsUBKFICav1D7', date: "2024-03-14 13:16:48" },
    { id: 'RESAU7UUyTRGAIVoGOtX', date: "2023-12-13 09:13:34" },
    { id: 'RES7CxKQEYufoDXHWvy7', date: "2023-06-11 12:22:44" },
    { id: 'RES1LHYyMrzD7Y3xjvTd', date: "2023-11-10 08:10:41" },
    { id: 'RESoMxW1G9KNnsqBVvRr', date: "2023-09-16 01:14:16" },
    { id: 'RESXqZCHD7wWtNdgHoF0', date: "2024-01-29 18:22:04" },
    { id: 'RESPdSCaymcs95DIWMAS', date: "2024-02-08 14:06:30" },
    { id: 'RESNByuO628aItyTMqrO', date: "2024-03-02 21:48:27" },
    { id: 'RESTZeV1oNzqvBKXJeOS', date: "2024-05-15 17:22:27" },
    { id: 'RESUS1InGUrAjM9a3hvQ', date: "2023-11-20 14:26:07" },
    { id: 'RESSZNSFwb0BXm3wKJfH', date: "2024-02-12 19:06:49" },
    { id: 'RES6ZIBc5gqAIcSABoRS', date: "2024-05-09 17:43:02" },
    { id: 'RESqQIr7jXpp2GfvmBjK', date: "2023-09-07 01:36:53" },
    { id: 'RESSomzvFRNF6K7kMPhY', date: "2024-04-02 00:59:47" },
    { id: 'RESFmgOfDzQ8HaFOdvMf', date: "2023-11-10 18:48:37" },
    { id: 'RESMBIBK5kHVlTktnh3x', date: "2023-11-03 10:35:13" },
    { id: 'RESL2yZ120HfXK0LkG3C', date: "2023-09-28 16:49:58" },
    { id: 'RES2J6GvojOQOg2MHTNF', date: "2023-10-20 18:02:39" },
    { id: 'REStVDL1LJmBpFoAlwTB', date: "2024-03-14 05:17:53" },
    { id: 'RES4T6DBFZFdSAe6pXUS', date: "2024-02-21 20:58:58" },
    { id: 'RESDkK4VNlkGqcicIL6t', date: "2024-02-29 09:58:37" },
    { id: 'RES99GHWtnwWJckAXeWW', date: "2023-12-21 02:56:54" },
    { id: 'RES2BeLwa7voDBIVHJwl', date: "2024-02-12 21:16:58" },
    { id: 'RESxBnr4zu3LCkrOLWoU', date: "2023-11-14 09:15:36" },
    { id: 'RESBgpsDkqMelZSAFnoM', date: "2023-06-22 02:06:46" },
    { id: 'RESUxR2gOK9oEESPJmGF', date: "2024-05-30 07:25:40" },
    { id: 'RESJNZnoPhAb97lIXVxv', date: "2023-05-21 10:02:44" },
    { id: 'RESiayghbNWGT6Sip2Gs', date: "2024-04-03 15:11:21" },
    { id: 'RES5Acs5BGNRxtEx336r', date: "2024-01-23 09:51:16" },
    { id: 'RES3PU54I5eVAVLjt7YL', date: "2023-12-30 12:32:29" },
]

function conditionDate(start) {
    let date = new Date (start.replace(' ', 'T') + '.000Z');
    let endDate = new Date('2024-05-04T23:59:59');
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

const createFood = (array) => {
    let query = "INSERT INTO foods (`Id`,`Name`,`Description`,`TimeMade`,`CreateAt`,`FeatureItem`," +
        "`Price`,`Status`,`Discount`,`RestaurantID`,`UpdateAt`) VALUES";
    let imageQuery = "INSERT INTO images ( `Id`,`OwnerID`) VALUES";
    array.forEach(item => {
        for (let i = 0; i < 5; i++) {
            const id = createID("FOD");
            const imgID = createID("IMG");
            const name = 'THE FOOD';
            const description = 'THE FOOD là một món ăn/ đồ uống ngon miệng của quán chúng tôi';
            const timeMade = `00:${Math.floor(Math.random() * 45)}:${Math.floor(Math.random() * 59)}`;
            const feature = Math.random() < 0.7 ? 0 : 1;
            const price = Math.floor(Math.random() * 30);
            const status = "Sale";
            const discount = Math.floor(Math.random() * 60);
            const createAt = formatDate(conditionDate(item.date));
            const updateAt = formatDate(conditionDate(createAt));

            if(i <= 3) {
                query += `('${id}','${name}','${description}','${timeMade}','${createAt}',${feature},${price},'${status}',${discount},'${item.id}','${updateAt}'),`;
                imageQuery += `('${imgID}','${id}'),`;
            }else {
                query += `('${id}','${name}','${description}','${timeMade}','${createAt}',${feature},${price},'${status}',${discount},'${item.id}','${updateAt}'),`;
                imageQuery += `('${imgID}','${id}') ,`;
            }
        }
    });

    console.log(query);
    return imageQuery;
}

console.log(createFood(resID));