module.exports = {


  friendlyName: 'Update availability',


  description: 'Update a restaurant\'s reservation availability.',


  inputs: {

    reservationAvailability: {
      type: {},
      description: 'Represents the total reservations available in each 15-minute time slot of the day.',
    },

  },

  exits: {

    success: {
      description: 'Restaraunt reservation availability updated successfully.',
    },

  },


  fn: async function ({reservationAvailability}) {

    // Validate that the `reservationAvailability` is in the right format.
    let hour = 0;
    let minutes = 0;
    while(hour < 24) {
      let key = `${_.padLeft(''+hour, 2, '0')}:${minutes === 0? '00' : minutes}`;
      if(!reservationAvailability.hasOwnProperty(key)) {
        throw new Error(`When updating a restaurant's \`reservationAvailability\`, it should be a dictionary with a key for every 15-minute time slot of the day, bot got: ${JSON.stringify(reservationAvailability)}`);
      }
      if(minutes === 45) {
        hour++;
        minutes = 0;
      } else {
        minutes += 15;
      }
    }

    await Restaurant.updateOne({id: this.req.myRestaurant.id}).set({reservationAvailability});

  }


};
