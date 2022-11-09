
const fromObjectToObjectArray = ({DT_URL, DT_DEPARTURE, DT_DESTINATION}) => {
    const mappedData = [];
    let hasUrl = false;
    const sortedDepartureDestination = Object
        .entries({DT_DEPARTURE, DT_DESTINATION})
        .sort((a, b) => b[1].length - a[1].length);
    for (let pairIndex = 0; pairIndex < sortedDepartureDestination.length; pairIndex++) {
        let airportIndex = 0;
        while (airportIndex < sortedDepartureDestination[pairIndex][1].length) {
            if (mappedData.length >= sortedDepartureDestination[pairIndex][1].length && !mappedData[airportIndex].hasOwnProperty(sortedDepartureDestination[pairIndex][0])) {
                mappedData[airportIndex] = {...mappedData[airportIndex], [sortedDepartureDestination[pairIndex][0]]: sortedDepartureDestination[pairIndex][1][airportIndex]};
            } else {
                mappedData.push({DT_URL: hasUrl ? null : DT_URL, [sortedDepartureDestination[pairIndex][0]]: sortedDepartureDestination[pairIndex][1][airportIndex]});
            }
            hasUrl = true;
            airportIndex++;
        }
    }
    return mappedData;
}

module.exports = { fromObjectToObjectArray }