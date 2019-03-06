const { User, Appointment } = require('../models')
const { Op } = require('sequelize')

class AppointmentController {
  async create (req, res) {
    const provider = await User.findByPk(req.params.provider)
    return res.render('appointments/create', { provider })
  }

  async store (req, res) {
    const { id } = req.session.user
    const { provider } = req.params
    const { date } = req.body

    await Appointment.create({
      user_id: id,
      provider_id: provider,
      date
    })

    return res.redirect('/app/dashboard')
  }

  async index (req, res) {
    const { id } = req.session.user
    const appointments = await Appointment.findAll({
      include: [{ model: User, as: 'user' }],
      where: {
        provider_id: id,
        date: {
          [Op.gte]: new Date()
        }
      },
      order: [['date', 'ASC']]
    })

    return res.render('appointments/index', { appointments })
  }
}

module.exports = new AppointmentController()
