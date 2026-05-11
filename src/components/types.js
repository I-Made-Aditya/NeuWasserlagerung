/**
 * @typedef {Object} ChannelData
 * @property {string} timestamp
 * @property {number[]} values - 10 channels
 */

/**
 * @typedef {Object} Configuration
 * @property {number} id
 * @property {boolean} active
 * @property {string} projectName
 * @property {string} lomNr
 * @property {string} description
 * @property {number} interval
 * @property {number} duration
 * @property {number} minV
 * @property {number} maxV
 * @property {string} machine
 * @property {string} expectedFinish
 * @property {string} ipAddress
 * @property {string} netmask
 * @property {string} equipmentType
 * @property {boolean[]} channels - 10 channels active/inactive
 * @property {ChannelData[]} data
 */

export {}
