module.exports = {


  friendlyName: 'Get reservation schedule',


  description: 'Get the reservation schedule for the specified calendar date.',


  inputs: {

    startsOn: {
      description: 'The ISO-formatted calendar date (YYYY-MM-DD) that we are getting the schedule for.',
      type: 'string',
      required: true,
    },

  },


  exits: {

    success: {
      outputFriendlyName: 'Report',
      outputExample:
      {
        '11:30am': {
          inventory: 3,
          reservations: [
            { id: 99, /*…*/ }
          ]
        }
      },
    }

  },


  fn: async function ({ startsOn }) {
    const moment = require('moment-timezone');

    let scheduleStartsAt = moment.tz(`${startsOn} 00:00`, this.req.myRestaurant.tz).toDate().getTime();
    let scheduleEndsAt = scheduleStartsAt + 24*60*60*1000;//« add 24 hours


    // Get our booked reservations for the selected day.
    let reservations = await Reservation.find({
      restaurant: this.req.myRestaurant.id,
      and: [
        {startsAt: {'>=': scheduleStartsAt }},
        {startsAt: {'<': scheduleEndsAt }}
      ]
    });
    reservations = reservations.map((reservation)=> {
      reservation.startTime = moment(reservation.startsAt).tz(this.req.myRestaurant.tz).format('HH:mm');
      return reservation;
    });

    // Now, build up our schedule information.
    let report = _.reduce(this.req.myRestaurant.reservationAvailability, (memo, inventory, startTime)=>{
      let reservationsStartingAtThisTime = reservations.filter((reservation)=>reservation.startTime === startTime);
      // We'll only include time slots that have inventory, OR that have existing reservations booked
      // (so that changing the default availability doesn't prevent already-booked reservations from showing up)
      if(inventory > 0 || reservationsStartingAtThisTime.length > 0) {
        memo[startTime] = {
          inventory,
          reservations: reservationsStartingAtThisTime,
        };
      }
      return memo;
    }, {});

    // console.log('report',report);

    return report;

  }


};
