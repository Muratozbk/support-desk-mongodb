import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Modal from 'react-modal'
import { FaPlus } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { getTicket, closeTicket } from '../features/tickets/ticketSlice'
import { getNotes, createNote } from '../features/notes/noteSlice'
import { useParams, useNavigate } from 'react-router-dom'
import BackButton from '../components/BackButton'
import Spinner from '../components/Spinner'
import NoteItem from '../components/NoteItem'

const customStyles = {
    content: {
        width: '600px',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        position: 'relative',
    },
}

Modal.setAppElement('#root')

function Ticket() {
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [noteText, setNoteText] = useState('')
    const { ticketId } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { ticket } = useSelector((state) => state.tickets) || {};
    const { notes } = useSelector((state) => state.notes) || [];

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // await dispatch(getTicket(ticketId)).unwrap();
                // Fetch ticket
                const ticketAction = dispatch(getTicket(ticketId));
                const ticketResult = await ticketAction.unwrap();
                // Fetch notes
                const notesAction = dispatch(getNotes(ticketId));
                const notesResult = await notesAction.unwrap();

                if (getTicket.fulfilled.match(ticketAction) && getNotes.fulfilled.match(notesAction)) {
                    // Both requests succeeded, update loading state
                    setLoading(false);
                } else {
                    // At least one request failed, handle error
                    console.error('Error fetching data:', ticketResult.payload.error || notesResult.payload.error);
                    toast.error('Error fetching data');
                    setLoading(false);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Error fetching data')
                setLoading(false)
            }
        };
        fetchData()

    }, [ticketId, dispatch])

    // Close ticket
    const onTicketClose = () => {
        dispatch(closeTicket(ticketId))
            .unwrap()
            .then(() => {
                toast.success('Ticket Closed')
                navigate('/tickets')
            })
            .catch(toast.error)
    }

    // Create note submit
    const onNoteSubmit = (e) => {
        e.preventDefault()
        dispatch(createNote({ noteText, ticketId }))
            .unwrap()
            .then(() => {
                setNoteText('')
                closeModal()
            })
            .catch(toast.error)
    }

    // Open/close modal
    const openModal = () => setModalIsOpen(true)
    const closeModal = () => setModalIsOpen(false)

    console.log('Ticket:', ticket);
    console.log('Notes:', notes);

    if (loading) {
        return <Spinner />
    };

    if (!ticket) {
        return <div>Error loading ticket data.</div>;
    };

    return (
        <div className='ticket-page'>
            <header className='ticket-header'>
                <BackButton />
                <h2>
                    Ticket ID: {ticket._id}
                    <span className={`status status-${ticket.status}`}>
                        {ticket.status}
                    </span>
                </h2>
                <h3>
                    Date Submitted: {new Date(ticket.createdAt).toLocaleString('en-US')}
                </h3>
                <h3>Product: {ticket.product}</h3>
                <hr />
                <div className='ticket-desc'>
                    <h3>Description of Issue</h3>
                    <p>{ticket.description}</p>
                </div>
                <h2>Notes</h2>
            </header>

            {ticket.status !== 'closed' && (
                <button onClick={openModal} className='btn'>
                    <FaPlus /> Add Note
                </button>
            )}

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel='Add Note'
            >
                <h2>Add Note</h2>
                <button className='btn-close' onClick={closeModal}>
                    X
                </button>
                <form onSubmit={onNoteSubmit}>
                    <div className='form-group'>
                        <textarea
                            name='noteText'
                            id='noteText'
                            className='form-control'
                            placeholder='Note text'
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                        ></textarea>
                    </div>
                    <div className='form-group'>
                        <button className='btn' type='submit'>
                            Submit
                        </button>
                    </div>
                </form>
            </Modal>

            {notes ? (
                notes.map((note) => <NoteItem key={note._id} note={note} />)
            ) : (
                <Spinner />
            )}

            {ticket.status !== 'closed' && (
                <button onClick={onTicketClose} className='btn btn-block btn-danger'>
                    Close Ticket
                </button>
            )}
        </div>
    )
}

export default Ticket