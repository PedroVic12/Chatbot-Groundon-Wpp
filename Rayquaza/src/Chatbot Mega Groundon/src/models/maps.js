const { Client } = require('@googlemaps/google-maps-services-js');


const client = new Client({});

client
    .elevation({
        params: {
            locations: [{ lat: 45, lng: -110 }],
            key: 'AIzaSyBz5PufcmSRVrrmTWPHS2qlzPosL70XrwE'
        },
        timeout: 1000 // milliseconds
    },)
    .then(r => {
        console.log(r.data.results[0].elevation);
    })
    .catch(e => {
        console.log(e);
    });