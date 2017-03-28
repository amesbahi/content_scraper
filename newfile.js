

let myPromise = new Promise((resolve, reject) => {
    function showTimeAlert() {
         resolve("hello");
     }

    //resolve("not in a timeout");
   setTimeout(showTimeAlert, 3000);
});



// myPromise();

// myPromise.then(function () {
//     console.log("helloooooo!");
// });


myPromise.then(function (data) {
    console.log(data); // hello
});

