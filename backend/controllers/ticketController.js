const asyncHandler = require('express-async-handler');

const Ticket = require('../models/ticketModel');

//@desc get user tickets
//@route GET /api/tickets
//@access private
const getTickets = asyncHandler(async (req, res) => {
    const tickets = await Ticket.find({ user: req.user.id })
    res.status(200).json(tickets)
});

//@desc get user ticket
//@route GET /api/tickets/:id
//@access private
const getTicket = asyncHandler(async (req, res) => {

    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
        res.status(404)
        throw new Error('Ticket not found')
    }

    if (ticket.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('Not authorized')
    }

    res.status(200).json(ticket);
});

//@desc create newtickets
//@route POST /api/tickets
//@access private
const createTicket = asyncHandler(async (req, res) => {
    const { product, description } = req.body;

    if (!product || !description) {
        res.status(404)
        throw new Error('Please add a product and description')
    }

    const ticket = await Ticket.create({
        product,
        description,
        user: req.user.id,
        status: 'new'
    })

    res.status(201).json(ticket);
});

//@desc Delete ticket
//@route DELETE /api/tickets/:id
//@access private
const deleteTicket = asyncHandler(async (req, res) => {
    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
        res.status(404)
        throw new Error('Ticket not found')
    }

    if (ticket.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('Not authorized')
    }

    await ticket.remove()

    res.status(200).json({ success: true });
});

//@desc Update ticket
//@route PUT /api/tickets/:id
//@access private
const updateTicket = asyncHandler(async (req, res) => {
    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
        res.status(404)
        throw new Error('Ticket not found')
    }

    if (ticket.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('Not authorized')
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id,
        req.body, { new: true })

    res.status(200).json(updatedTicket);
});


module.exports = {
    getTickets,
    getTicket,
    createTicket,
    deleteTicket,
    updateTicket
}

