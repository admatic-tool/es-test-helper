const _ = require("underscore")
const elasticsearch = require("elasticsearch")
const co = require("co")
const moment = require("moment")

const { Client } = elasticsearch

module.exports = (config) => {
  
  const { connection, mapping , indices } = config
  
  return {
    
    client: new Client(connection) ,
    
    getAllIndices: co.wrap(function*(){
      return this.client
                 .indices
                 .getSettings()
                 .then(res => _(res).keys())
    }),

    dropAll: co.wrap(function*(){
      return this.getAllIndices()
          .then(indices => {
            indices.map(index => {
              this.client.indices.delete({ index, refresh: true })
            })
         })
    }),

    createIndices: co.wrap(function*(){
      
      let index

      for(const meta of indices) {
        if(meta.name) {
          if(meta.name.split) {
            const { name } = meta
            index = name
      
          } else { // callback
            const { name  } = meta
            index = name()
          } 
        } else {
          const { prefix , dayClusterFormat } = meta
          const clusterSuffix = moment().format(dayClusterFormat)
          index = `${prefix}${clusterSuffix}`
        }
        yield this.client
        .indices
        .create({ index, body: meta.mapping })
      }
      return true

    }),


  }
}