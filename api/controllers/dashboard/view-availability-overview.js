module.exports = {


  friendlyName: 'View availability overview',


  description: 'Display "Availability overview" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/dashboard/availability-overview'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
