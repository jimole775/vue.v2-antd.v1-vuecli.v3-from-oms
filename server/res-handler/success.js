module.exports = function successModel (res, data) {
  return res.send({
    code: 200,
    message: 'success',
    data
  })
}
