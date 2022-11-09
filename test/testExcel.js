const { writeExcel } = require("../utils/excelHandler");


const main = async () => {
    const objects = [
        {
            name: 'John Smith',
            dateOfBirth: new Date(),
            cost: 1800,
            paid: true
        },
        {
            name: 'Alice Brown',
            dateOfBirth: new Date(),
            cost: 2600,
            paid: false
        }
    ]
    const schema = [
        {
            column: 'Name',
            type: String,
            value: student => student.name
        },
        {
            column: 'Date of Birth',
            type: Date,
            format: 'mm/dd/yyyy',
            value: student => student.dateOfBirth
        },
        {
            column: 'Cost',
            type: Number,
            format: '#,##0.00',
            value: student => student.cost
        },
        {
            column: 'Paid',
            type: Boolean,
            value: student => student.paid
        }
    ];
    await writeExcel(schema, objects, "TestData2");
    const data = await readExcel("TestData2");
    console.log(data);
}

main();