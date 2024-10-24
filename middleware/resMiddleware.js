// Example middleware for checking if the user is logged in
exports.ensureLoggedIn = (req, res, next) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  };
  
  // Example validation middleware
  exports.validateReservationData = (req, res, next) => {
    const { destination, startDate, endDate } = req.body;
    if (!destination || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    next();
  };