Nova.booting((Vue, router, store) => {
  router.addRoutes([
    {
      name: 'card-duplicator',
      path: '/card-duplicator',
      component: require('./components/Tool'),
    },
  ])
})
