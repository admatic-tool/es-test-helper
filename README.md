
```javascript
const Factory = require("es-test-helper")

const config = {
  connection: {
    host: "http://localhost:9200"
  },
  indices: [
    {
      prefix: "offers-", 
      dayClusterFormat: "YYYY-MM-DD",
      mapping: {

      },
    },
    // wihtout cluster
    {
      name: "not_clustered",
      mapping: {
        
      },
    },
    // custom method
    {
      name: () => "abc" + "123",
      mapping: {
        
      },
    }

  ]
}


const EsTestHelper = Factory(config)


EsTestHelper.createIndices()
// create all elasticsearch indices

EsTestHelper.dropAll()
// drop all elasticsearch indices
```