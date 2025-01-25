const http = require('http');

module.exports = {
     getStreets: async function(city){
        return new Promise((resolve,reject)=>{
            http.request({
                hostname: 'overpass-api.de',
                path: '/api/interpreter/?' + "data=" + encodeURIComponent(`[out:json];
                        area["name"="${city}"]->.searchArea;
                        (
                            way["highway"]["name"](area.searchArea);
                            relation["highway"]["name"](area.searchArea);
                        );
                        out tags qt 100;
                    `),
                method: 'GET'
            }, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    try {
                        const parsedData = JSON.parse(data);
                        let output = [];
                        for(const i of parsedData.elements){
                            output.push(i.tags.name);
                        }
                        resolve(output);
                    } catch (e) {
                        reject(e);
                    }
                });
            }).end();            
        })   
    }
        
}