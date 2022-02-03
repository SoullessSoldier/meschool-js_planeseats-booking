const URL_API = 'https://61f4662310f0f7001768c90f.mockapi.io/api/airplane';

const getData = () => fetch(URL_API)
    .then((response)=>{
        if(response.ok){
            return response.json()
        } else {
            throw new Error('Error fetching data!');
        }
    })    
    .catch((err)=>{console.error(err)});

export default getData;