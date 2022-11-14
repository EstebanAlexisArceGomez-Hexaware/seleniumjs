
const fromObjectToObjectArray = ({DT_URL, ...data}) => {
    const mappedData = [];
    let hasUrl = false;
    const sortedDepartureDestination = Object
        .entries(data)
        .sort((a, b) => b[1].length - a[1].length);
    for (let pairIndex = 0; pairIndex < sortedDepartureDestination.length; pairIndex++) {
        
        for (let airportIndex = 0; airportIndex < sortedDepartureDestination[pairIndex][1].length; airportIndex++) {
            if (mappedData.length >= sortedDepartureDestination[pairIndex][1].length && !mappedData[airportIndex].hasOwnProperty(sortedDepartureDestination[pairIndex][0])) {
                mappedData[airportIndex] = {...mappedData[airportIndex], [sortedDepartureDestination[pairIndex][0]]: sortedDepartureDestination[pairIndex][1][airportIndex]};
            } else {
                mappedData.push({DT_URL: hasUrl ? null : DT_URL, [sortedDepartureDestination[pairIndex][0]]: sortedDepartureDestination[pairIndex][1][airportIndex]});
                hasUrl = true;
            }
        }
    }
    return mappedData;
}

module.exports = { fromObjectToObjectArray }