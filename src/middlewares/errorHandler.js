/**
 * Global error handling middleware
 */
exports.errorHandler = (err, req, res, next) => {
//  console.error(err.stack);
  
  // Handle validation errors (400)
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: true,
      message: err.message,
      details: err.details || 'Invalid request data'
    });
  }
  
  // Handle not found errors (404)
  if (err.name === 'NotFoundError') {
    return res.status(404).json({
      error: true,
      message: err.message || 'Resource not found'
    });
  }
  
  // Default to 500 server error
  return res.status(500).json({
    error: true,
    message: 'Internal server error'
  });
};