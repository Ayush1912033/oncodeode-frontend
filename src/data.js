// src/data.js

export const allPatients = [
  { 
    id: '220330', 
    name: 'Patient Apate', 
    subtext: 'ID: 220330', 
    lastVisit: '22.016',
    age: 45,
    gender: 'Female',
    reports: [
        { id: 'RPT-001', date: '2025-08-15', title: 'Gene Expression Analysis', url: '#' },
        { id: 'RPT-002', date: '2025-09-02', title: 'Somatic Variant Report', url: '#' },
    ]
  },
  { 
    id: '220331', 
    name: 'John Doe', 
    subtext: 'Somialicin', 
    lastVisit: '21.125',
    age: 62,
    gender: 'Male',
    reports: [
        { id: 'RPT-003', date: '2025-09-11', title: 'Tumor Mutation Profile', url: '#' },
    ]
  },
  { 
    id: '220332', 
    name: 'Jane Smith', 
    subtext: 'ID: 220332', 
    lastVisit: '22.011',
    age: 58,
    gender: 'Female',
    reports: []
  },
];