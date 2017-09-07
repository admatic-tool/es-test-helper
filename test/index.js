const expect = require("chai").expect
const _ = require("underscore")
const elasticsearch =  require("elasticsearch")

global.waitSeconds = seconds =>
  new Promise(resolve => setTimeout(resolve, seconds * 1000))

const Factory = require("../index")

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
const esCLient = elasticsearch.Client({ host: "http://localhost:9200" })

describe("EsTestHelper" , () => {

  const EsTestHelper = Factory(config)
  const indices =  [
    "abc123",
    "not_clustered",
    "test",
    "offers-2017-09-07"
  ]

  after(function*() {
    for(const index of indices) {
      try {
        yield esCLient.indices.delete({ index })
      } catch(err){}
    }

  })

  describe(".createIndices", () => {

    let indices

    before(function*() {
       yield EsTestHelper.createIndices()
       yield waitSeconds(1)
       
       indices = yield esCLient.indices.getSettings()
                                       .then(res => _(res).keys())
    })

    it("index exists", () => {
      expect(indices).to.have.all.members([
        "abc123",
        "not_clustered",
        "offers-2017-09-07"
      ])
    })
  })

  describe(".getAllIndices", () => {

    context("with some index", () => {
      
      let res 
      
      before(function*() {
        try {
          yield esCLient.indices.create({
            index: "test",
          })
        } catch(_err) {

        }
        res = yield EsTestHelper.getAllIndices()
      })

      it("should return indixes", () => {
        expect(res).to.have.all.members([
          "abc123",
          "not_clustered",
          "test",
          "offers-2017-09-07"
        ])
      })
    })

  })
})