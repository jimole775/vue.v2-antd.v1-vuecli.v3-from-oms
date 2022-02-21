module.exports = function failModel (res, err) {
  return res.send({
    code: 400,
    message: err,
    data: {}
  })
}
