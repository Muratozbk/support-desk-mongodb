import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getTickets } from '../features/tickets/ticketSlice'
import Spinner from '../components/Spinner'
import BackButton from '../components/BackButton'
import TicketItem from '../components/TicketItem'

function Tickets() {
    const { tickets } = useSelector((state) => state.tickets)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getTickets())
    }, [dispatch]);

    if (!tickets) {
        return <Spinner />
    }
    if (!Array.isArray(tickets) || tickets.length === 0) {
        return (<div>No tickets available now </div>)
    }

    return (
        <>
            <BackButton url={'/'} />
            <h1>Tickets</h1>
            <div className='tickets'>
                <div className='ticket-headings'>
                    <div>Date</div>
                    <div>Product</div>
                    <div>Status</div>
                    <div></div>
                </div>
                {tickets.map((ticket) => (
                    <TicketItem key={ticket._id} ticket={ticket} />
                ))}
            </div>
        </>
    )
}

export default Tickets