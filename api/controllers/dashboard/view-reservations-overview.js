module.exports = {


  friendlyName: 'View reservations overview',


  description: 'Display "Reservations overview" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/dashboard/reservations-overview'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
