module.exports = {


  friendlyName: 'View homepage or redirect',


  description: 'Redirect to the appropriate homepage or login screen, depending on login status.',


  exits: {

    redirect: {
      responseType: 'redirect',
      description: 'Requesting user is logged in, so redirect to the internal welcome page.'
    },

  },


  fn: async function () {

    if (this.req.me) {
      throw {redirect:'/reservations'};
    } else {
      throw {redirect:'/login'};
    }

  }


};
