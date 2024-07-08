const API_URL = 'https://mindicador.cl/api/'; // URL de la API
const selectContainer = document.getElementById('my_coins')
const chartContainer = document.querySelector('canvas').getContext('2d');

let chartRef = null

const fetchCoins = async (url) => {

    const dataJson = await fetch(url)
    const coinsData = await dataJson.json()

    const coins = []
    for (const key in coinsData) {
        if (coinsData[key]['unidad_medida'] == 'Pesos') {
            const {codigo, nombre, valor} = coinsData [key]
            coins.push({codigo, nombre, valor})
        }
    }

    renderCoins(coins, selectContainer)
}

const renderCoins = (coins, container) => {
    let coinOptions = ''
    container.innerHTML = ''

    coinOptions += `<option value="" selected disabled>Selecciona una moneda</option>`
    
    coins.forEach(({codigo, nombre, valor}) => {
        coinOptions += `<option data-value="${valor}" value="${codigo}">${nombre}</option>`
    });

    container.innerHTML = coinOptions;
}

const fetchCoinDetail = async (url, coinID) => {

    const dataJson = await fetch (`${url}/${coinID}`)
    const { serie } = await dataJson.json()

    const labels = []
    const data = []

    serie.slice(0, 11).forEach(({fecha, valor}) => {

        const fechacorta = fecha.split('T')[0]

        labels.unshift(fechacorta)
        data.unshift(valor)
    })

    return {
        labels,
        data
    }
    
}
    const renderChart = (coinsData, container) => {
    if (chartRef) chartRef.destroy()
        chartRef = new Chart(container, {
            type: 'line',
            data: {
                labels: coinsData.labels,
                datasets: [{
                    label: 'Fechas',
                    data: coinsData.data,
                    borderWidth: 1
                }]
            },
        });

    document.getElementById('show_chart').addEventListener('click', async () => {
        const coinID = selectContainer.value

        const coinDetail = await fetchCoinDetail(API_URL, coinID)

       renderChart(coinDetail, chartContainer)

    })
    
fetchCoins(API_URL)
}