/* Let us create the customer with the payment method nonce from drop-in UI */
/* Card verification option if enabled in console (vault->*/
  gateway.customer.create({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: "",
    website: "",
   
    // We are verifyig the card before storing in vault. A verified card is less risky.
    // we can also pass billing details here if available and also
    // if you're using advanced risk tools like Kount data collector on the UI, then
    // we need to pass that here for additional safety.  
    creditCard: {
      options:{
          verifyCard: true,
          verificationAmount: "1.00",
      }
    },
    paymentMethodNonce: nonceFromTheClient
  }, function (err, result) {
   
    /* validation errors are stored in result.errors object .. This contains other API errors. */
    if(err){
      console.log('We have an error creating the customer ' + err);
      return;
    }
   
    /* customer created successfully */
    if(result.success){
      let customerid = result.customer.id;
      /** we are using the first payment method because we just created this customer and
      they have only one payment method associated with the nonce we just received. **/
      let token = result.customer.paymentMethods[0].token;
     
      // we can create the subscription here or we can save the customer id to a database and
      // retrieve it using the
      // gateway.customer.find (
      // customerid, function(err, result){
          //return result.customer.id;
      //})
      gateway.subscription.create({
        merchantAccountId: "",
        paymentMethodToken: token,
        planId: ""
      }, function (err, result) {
          if(err){
            console.log('There was an error creating the subscription ' + err);
            return;
          }
   
          if(result.success){
           
          }
   
      });
    }
  });