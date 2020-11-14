Nova.booting((Vue, router, store) => {
  router.addRoutes([
    {
      name: 'bulk-tagging-self-check-questions',
      path: '/bulk-tagging/self-check-questions',
      component: require('./components/Tool'),
    },
    {
      name: 'bulk-tagging-profile-answers',
      path: '/bulk-tagging/profile-answers',
      component: require('./components/ProfileAnswerBulkTag'),
    },
  ])
});
