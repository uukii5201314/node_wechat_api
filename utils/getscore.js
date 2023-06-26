const db = require('../db/index');

function getscore(openid) {
    return new Promise((resolve, reject) => {
        const str = 'SELECT * FROM class_schedule WHERE openid = ? ORDER BY semester DESC';
        db.query(str, [openid], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}
let b = 'oy-v96suzdnF-BwrbwSAjSnR1oRo';
getscore(b)
    .then(result => {
        console.log(result);
        for (let i = 0; i <= result.length; i++){
            const element = result[i];
        }
    })
    .catch(err => {
        console.error(err);
    });
// module.exports = getscore;