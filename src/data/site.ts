export const site = {
  featuredPersonId: 'ye-chao-liu',
  title: 'Ye-Chao Liu',
  description: 'Ye-Chao Liu — quantum information acquisition, processing, and analysis. Associate Professor at Hainan University.',
  researchIdentity: { title:'Quantum Information', subtitle:'Acquisition · Processing · Analysis' },
  framework: {
    short: 'Connecting quantum measurements, data, inference, and computation.',
    full: 'My research connects quantum measurements, information analysis, mathematical models, and computational methods. These approaches inform one another and address different aspects of understanding and utilizing quantum systems.',
  },
  researchSubtitle: 'Quantum measurement strategies, information analysis, statistical inference, and computational methods.',
  navigation: [ {path:'',label:'home'}, {path:'research/',label:'research'}, {path:'publications/',label:'publications'}, {path:'projects/',label:'projects'}, {path:'about/',label:'about'} ] as const,
  publications: { showAuthorRoles: false, pageSize: 10 },
  about: { awardIds:['outstanding-doctoral-dissertation','beijing-outstanding-graduate'], activityLimit:5 },
};
