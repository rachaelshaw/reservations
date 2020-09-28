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
      outputFriendlyName: 'Reservation Schedule',
      outputExample: [
        {
          startTime: '11:30am',
          reservations: [
            { id: 99, /*…*/ }
          ]
        }
      ],
    }

  },


  fn: async function ({ startsOn }) {
    const moment = require('moment-timezone');

    let scheduleStartsAt = moment.tz(`${startsOn} 00:00`, this.req.myRestaurant.tz).toDate().getTime();
    let scheduleEndsAt = scheduleStartsAt + 24*60*60*1000;//« add 24 hours
    // ^^ FUTURE: instead of the entire day, this could be limited to configured business hours.

    // Get our booked reservations for the selected day.
    let reservations = await Reservation.find({
      restaurant: this.req.myRestaurant.id,
      and: [
        {startsAt: {'>=': scheduleStartsAt }},
        {startsAt: {'<': scheduleEndsAt }}
      ]
    });
    reservations = reservations.map((reservation)=> {
      reservation.startTime = moment(reservation.startsAt).tz(this.req.myRestaurant.tz).format('hh:mma');
      return reservation;
    });

    // Now, build up our schedule.
    let schedule = [];
    let nextTimeSlotStartsAt = scheduleStartsAt;
    while(nextTimeSlotStartsAt < scheduleEndsAt) {
      let startTime = moment(nextTimeSlotStartsAt).tz(this.req.myRestaurant.tz).format('hh:mma');
      schedule.push({
        startTime,
        reservations: reservations.filter((reservation)=>reservation.startTime === startTime)
      });
      nextTimeSlotStartsAt += 15*60*1000;//« add fifteen minutes
    }

    return schedule;

  }


};
