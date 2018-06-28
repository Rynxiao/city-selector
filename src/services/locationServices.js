async function getLocalCity() {
    return new Promise(resolve => {
        var myCity = new window.BMap.LocalCity();
        myCity.get(result => {
            resolve(result.name);
        });
    }); 
}

export {
    getLocalCity
};