module.exports = {
  generatePayload: function(context, events, done) {
    context.vars = {};
    context.vars['id'] = Math.floor(Math.random() * 50) + 1;
    context.vars['amount'] = Math.round( Math.random() * 1000);
    return done();
  }
};