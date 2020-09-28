module.exports = {


  friendlyName: 'View reservations overview',


  description: 'Display "Reservations overview" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/dashboard/reservations-overview'
    }

  },


  fn: async function () {
    var moment = require('moment-timezone');

    // TODO: make a helper to fetch the reservation schedule for a specific day,
    // instead of dumbly grabbing all of them here.
    let reservations = await Reservation.find({restaurant: this.req.me.restaurant})
    .sort('startsAt ASC');

    reservations = reservations.map((reservation)=> {
      reservation.startDate = moment(reservation.startsAt).tz(this.req.myRestaurant.tz).format('MM/DD');
      reservation.startTime = moment(reservation.startsAt).tz(this.req.myRestaurant.tz).format('hh:mma');
      return reservation;
    });

    // Respond with view.
    return {
      reservations
    };

  }


};
