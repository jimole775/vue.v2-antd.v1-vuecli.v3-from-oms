module.exports = function errorModel (res, err) {
  return res.send({
    code: 500,
    message: err,
    data: {}
  })
}
