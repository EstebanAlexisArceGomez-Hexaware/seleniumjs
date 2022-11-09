const schema = [
    {
        column: 'DT_URL',
        type: String,
        value: test => test.DT_URL
    },
    {
        column: 'DT_DEPARTURE',
        type: String,
        value: test => test.DT_DEPARTURE
    },
    {
        column: 'DT_DESTINATION',
        type: String,
        value: test => test.DT_DESTINATION
    }
];

module.exports = {schema}