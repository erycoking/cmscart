module.exports = {
  index: async (req, res, next) => {
    res.render('index', {
      title: 'king'
    });
  }
}