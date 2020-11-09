Nova.booting((Vue, router, store) => {
  router.addRoutes([
    {
      name: 'bulk-tagging',
      path: '/bulk-tagging',
      component: require('./components/Tool'),
    },
  ])
});
