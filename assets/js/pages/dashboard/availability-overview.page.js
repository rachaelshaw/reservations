parasails.registerPage('availability-overview', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {

    // For loading & error states
    syncing: '',
    cloudError: '',
    cloudSuccess: '',

    // For forms
    formData: { /* … */ },
    formRules: { /* … */ },
    formErrors: { /* … */ },

  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    for(let timeSlot in this.myRestaurant.reservationAvailability) {
      this.formData[timeSlot] = this.myRestaurant.reservationAvailability[timeSlot];
      this.formRules[timeSlot] = {required: true};
    }
  },
  mounted: async function() {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    inputFormField: function() {
      // Clear out success message.
      this.cloudSuccess = false;
    },

    submittedForm: function() {
      // Show our success message.
      this.cloudSuccess = true;
    },

    handleSubmitting: async function(argins) {
      console.log('argins',argins);

      return await Cloud.updateAvailability.with({
        reservationAvailability: argins
      });
    },

  }
});
