/**
 * @param {Date} date
 * @returns {string}
 */
export function formatTimestamp(date) {
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const yy = String(date.getFullYear()).slice(2)
  const hh = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${dd}.${mm}.${yy} ${hh}:${min}`
}

/**
 * @param {number} rows
 * @param {number} minV
 * @param {number} maxV
 * @returns {Array}
 */
function generateData(rows, minV, maxV) {
  const base = new Date('2026-04-28T08:00:00')
  return Array.from({ length: rows }, (_, i) => ({
    timestamp: formatTimestamp(new Date(base.getTime() + i * 60000)),
    values: Array.from({ length: 10 }, () =>
      parseFloat((minV + Math.random() * (maxV - minV) * 1.15).toFixed(4))
    ),
  }))
}

const BASE = {
  active: true,
  interval: 1,
  duration: 10000,
  netmask: '255.255.255.0',
}

export const initialConfigs = [
  {
    ...BASE, id: 1, projectName: 'QA', lomNr: 'Nr 1-10', description: '1-10_80DEG',
    minV: 0, maxV: 11, machine: 'Machine-1', expectedFinish: '13:58:56',
    ipAddress: '192.168.1.101', equipmentType: 'DAQ9600',
    channels: Array(10).fill(true),
    data: generateData(120, 0.27, 0.32),
  },
  {
    ...BASE, id: 2, projectName: 'QA', lomNr: 'Nr 11-20', description: '11-20_80DEG',
    minV: 0, maxV: 11, machine: 'Machine-1', expectedFinish: '13:57:02',
    ipAddress: '192.168.1.102', equipmentType: 'DAQ9600',
    channels: Array(10).fill(true),
    data: generateData(120, 0.27, 0.32),
  },
  {
    ...BASE, id: 3, projectName: 'QA', lomNr: 'Nr 21-30', description: '21-30_80DEG',
    minV: 0, maxV: 11, machine: 'Machine-2', expectedFinish: '13:57:08',
    ipAddress: '192.168.1.103', equipmentType: 'DAQ9600',
    channels: [true, true, true, false, true, true, true, true, false, true],
    data: generateData(120, 0.27, 0.32),
  },
  {
    ...BASE, id: 4, projectName: 'QA', lomNr: 'Nr 31-40', description: '31-40_80DEG',
    minV: 0, maxV: 10, machine: 'Machine-2', expectedFinish: '13:57:14',
    ipAddress: '192.168.1.104', equipmentType: 'DAQ6510',
    channels: [true, true, true, true, true, false, false, true, true, true],
    data: generateData(120, 0.27, 0.32),
  },
  {
    ...BASE, id: 5, active: false, projectName: 'QA', lomNr: 'Nr 41-50', description: '41-50_80DEG',
    minV: 0, maxV: 11, machine: 'Machine-3', expectedFinish: '—',
    ipAddress: '192.168.1.105', equipmentType: 'DAQ6510',
    channels: [true, false, false, false, false, false, false, false, false, false],
    data: generateData(60, 0.27, 0.32),
  },
  {
    ...BASE, id: 6, projectName: 'T126', lomNr: '22-0043-0013', description: 'Type 21 & 22',
    minV: 0, maxV: 10, machine: 'Machine-1', expectedFinish: '13:08:06',
    ipAddress: '192.168.1.106', equipmentType: 'DAQ9600',
    channels: [true, true, false, false, false, false, false, false, false, false],
    data: generateData(80, 0.27, 0.32),
  },
  {
    ...BASE, id: 7, active: false, projectName: 'T126', lomNr: '22-0043-0013', description: 'Type 23 & 24',
    minV: 0, maxV: 10, machine: 'Machine-3', expectedFinish: '—',
    ipAddress: '192.168.1.107', equipmentType: 'DAQ6510',
    channels: Array(10).fill(false),
    data: [],
  },
  {
    ...BASE, id: 8, projectName: 'T126', lomNr: '22-0043-0013', description: 'Type 25 & 26',
    minV: 0, maxV: 10, machine: 'Machine-2', expectedFinish: '13:08:18',
    ipAddress: '192.168.1.108', equipmentType: 'DAQ9600',
    channels: [true, true, true, false, false, false, false, false, false, false],
    data: generateData(100, 0.27, 0.32),
  },
]

/**
 * @param {number} id
 * @returns {Object}
 */
export function createEmptyConfig(id) {
  return {
    id,
    active: false,
    projectName: '',
    lomNr: '',
    description: '',
    interval: 1,
    duration: 1000,
    minV: 0,
    maxV: 10,
    machine: 'Machine-1',
    expectedFinish: '—',
    ipAddress: '192.168.1.100',
    netmask: '255.255.255.0',
    equipmentType: 'DAQ9600',
    channels: Array(10).fill(false),
    data: [],
  }
}
