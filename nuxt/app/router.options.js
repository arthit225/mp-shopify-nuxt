export default {
  scrollBehavior(from, to, savedPosition) {
    if (from.hash && !to.redirectedFrom) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({ el: from.hash, top: 50 });
        }, 300);
      });

    }

    if (savedPosition) {
      return savedPosition;
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ top: 0 });
      }, 300);
    });
  },
};
