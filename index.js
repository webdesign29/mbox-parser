const Mbox = require('node-mbox');
const parse = require('parse-email');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: './output.csv',
    header: [{
            id: 'to',
            title: 'To  name'
        },
        {
            id: 'temail',
            title: 'To email'
        },
        {
            id: 'from',
            title: 'From name'
        }, {
            id: 'femail',
            title: 'From email'
        }, {
            id: 'date',
            title: 'Date'
        }, {
            id: 'mailer',
            title: 'Mailer'
        }
    ]
});
// First, different types of instantiation:

// 1. pass it a filename
// const mbox = new Mbox('filename', {
//     /* options */ });

// // 2. pass it a string/buffer
// const fs = require('fs');
// const mailbox = fs.readFileSync('filename');
// const mbox = new Mbox(mailbox, {
//     /* options */ });

// 3. pass it a stream
const fs = require('fs');
const stream = fs.createReadStream('mbox');
const mbox = new Mbox(stream, {
    /* options */
});

// // 4. pipe a stream to it
// const mbox = new Mbox({
//     /* options */ });
// process.stdin.pipe(mbox);

// Next, catch events generated:
let count = 0;
let uniqueArray = [];
mbox.on('message', function (msg) {
    // `msg` is a `Buffer` instance
    // console.log('got a message', msg.toString());
    parse(msg.toString())
        .then((email) => {

            // console.log(email.headers);

            let to = email.headers.get('to') ? email.headers.get('to').value[0] : {
                address: '',
                name: ''
            };
            let from = email.headers.get('from') ? email.headers.get('from').value[0] : {
                address: '',
                name: ''
            };
            let date = email.headers.get('date');
            let mailer = email.headers.get('x-mailer');

            let uKey = to.address + '-' + from.address;
            
            if (typeof uniqueArray[uKey] === 'undefined' || !uniqueArray[uKey]) {
                console.log('Key', uKey);
                let tmp = {
                    to: to.name,
                    temail: to.address,
                    from: from.name,
                    femail: from.address,
                    date: date,
                    mailer: mailer
                };
                uniqueArray[uKey] = tmp;
                 
                csvWriter.writeRecords([tmp]) // returns a promise
                .then(() => {
                    console.log(`Done ${count++}`, uniqueArray.length);
                });
                // console.log('to', to);
                // console.log('From', from);
    
            } else {
                console.log('Ignoring')
            }
            // console.log(`Found message: ${count++}`);
            

        })
});

// mbox.on('error', function (err) {
//     console.log('got an error', err);
// });

// mbox.on('end', function () {
    
//                 // csvWriter.writeRecords(uniqueArray[uKey]) // returns a promise
//                 // .then(() => {
//                 //     console.log(`Done ${count++}`, unique.length);
//                 // });
//                 // console.log('to', to);
//                 // console.log('From', from);
    
//     console.log('done reading mbox file', );
// });