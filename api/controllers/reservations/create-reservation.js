module.exports = {


  friendlyName: 'Create reservation',


  description: 'Create a new reservation on the specified date & time.',


  inputs: {

    startDate: {
      type: 'string',
      required: true,
      description: 'The ISO-formatted calendar date when the reservation will occur.'
    },

    startTime: {
      type: 'string',
      required: true,
      description: 'The (24 hour) time when the reservation will occur.'
    },

    guestName: {
      description: 'The full name of the guest who booked the reservation.',
      type: 'string',
      required: true,
    },

    guestEmailAddress: {
      description: 'The email address of the guest who booked the reservation.',
      type: 'string',
      required: true,
      isEmail: true,
    },

    partySize: {
      description: 'The total number of guests who will be dining at the reserved time.',
      type: 'number',
      required: true,
    },

  },


  exits: {

    success: {
      outputType: 'number',
      outputDescription: 'The ID of the newly-created reservation.'
    },

    unavailable: {
      description: 'There are no reservations available at that time on the selected date.'
    },

  },


  fn: async function ({startDate, startTime, guestName, guestEmailAddress, partySize}) {
    const moment = require('moment-timezone');

    let startsAt = moment.tz(`${startDate} ${startTime}`, this.req.myRestaraunt.tz).toDate().getTime();

    // First, check that we still have inventory available.
    let availabileInventory = this.req.myRestaraunt.reservationAvailability[startTime];
    let totalExistingReservations = await Reservation.count({
      startsAt,
      restaurant: this.req.myRestaraunt.id,
    });
    // (We won't check for _exactly_ zero, since inventory can change after booking
    // to be lower than the # booked reservations.)
    if(availabileInventory - totalExistingReservations < 1) {
      throw 'unavailable';
    }

    // If there's inventory available, create the reservation.
    let reservation = await Reservation.create({
      guestName,
      guestEmailAddress,
      partySize,
      startsAt,
      restaurant: this.req.myRestaraunt.id
    }).fetch();

    return reservation.id;
  }


};
