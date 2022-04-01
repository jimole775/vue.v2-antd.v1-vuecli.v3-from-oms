module.exports = function failModel (res, err) {
  return res.send({
    code: 502,
    message: err,
    data: {}
  })
}
