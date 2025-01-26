const https = require('https');
const generateStreets = async function(city){
    let latMin;
    let latMax;
    let lonMin;
    let lonMax;
    await new Promise((resolve, reject)=>{
        https.request({
            hostname: 'nominatim.openstreetmap.org',
            path: `/search?city=${encodeURIComponent(city)}&format=json&addressdetails=1`,
            method: 'GET',
            headers: {
                "user-agent": "https://github.com/Big-Dyl/IrvineHacks2025"
            }
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(data);
                    resolve(parsedData[0].boundingbox);
                } catch (e) {
                    reject(e);
                }
            });
        }).end();     
    }).then((res)=>{
        [latMin, latMax, lonMin, lonMax] = res
    }
    );
    return new Promise((resolve,reject)=>{
        https.request({
            hostname: 'overpass-api.de',
            path: '/api/interpreter/?' + "data=" + encodeURIComponent(`
                [out:json];
                (
                    way["highway"](${latMin}, ${lonMin}, ${latMax}, ${lonMax});
                    relation["highway"](${latMin}, ${lonMin}, ${latMax}, ${lonMax});
                );
                out tags geom 200;
                `),
            method: 'GET',
            headers: {
                "user-agent" : "https://github.com/Big-Dyl/IrvineHacks2025"
            }
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(data);
                    let output = {};
                    output.streets = [];
                    output.coords = [];
                    for(const i of parsedData.elements){
                        output.streets.push(i.tags.name);
                        let lon = (i.bounds.minlon + i.bounds.maxlon)/2;
                        let lat = (i.bounds.minlat + i.bounds.maxlat)/2;
                        output.coords.push([lon, lat]);
                    }
                    resolve(output);
                } catch (e) {
                    reject(e);
                }
            });
        }).end();            
    })   
}

module.exports = {
     getStreets: async function(cityName){
        let allStreets;
        try{
            await generateStreets(cityName).then((res)=>allStreets = res);
        } catch(e){
            return {streets : [], coords: []};
        }
            //remove duplicates and undefined
            let seen = new Set();
            seen.add(undefined);
            for(let i = 0; i < allStreets.streets.length; i++){
              if(seen.has(allStreets.streets[i])){
                allStreets.streets.splice(i, 1);
                allStreets.coords.splice(i, 1);
                i--;
              } else {
                seen.add(allStreets.streets[i]);
              }
            }
            //shuffle streets
            for(let i = 0; i < allStreets.streets.length; i++){
              let temp = allStreets.streets[i];
              let tempc = allStreets.coords[i];
              let rand = Math.floor(Math.random() * allStreets.streets.length);
              allStreets.streets[i] = allStreets.streets[rand];
              allStreets.streets[rand] = temp;
              allStreets.coords[i] = allStreets.coords[rand];
              allStreets.coords[rand] = tempc;
            }
            return allStreets;
     }
}
