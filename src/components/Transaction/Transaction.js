import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../styles/styles.css'; // with import
import transactionApi from './../Interceptor/transactionApi';
import bookApi from './../Interceptor/bookApi';


const TransactionPage = () => {
  const { transactionId } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState('');
  const [book, setBook] = useState({});

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await transactionApi.get(`/request/${transactionId}`);
        setTransaction(response.data);
        console.log('response.data'+JSON.stringify(response.data));
        // Extract unique BookIds
        //const bookIds = response.data.map((req) => req.BookID);

        // Fetch books from API
        const responseBook = await bookApi.get(`/${response.data.BooKID}`);
        console.log('response.data'+JSON.stringify(responseBook));
        
       // const books = responseBook.data;
       setBook(responseBook.data)

        
      } catch (error) {
        setTransaction(null);
        console.error('Error fetching transaction:', error);
      }
    };

    fetchTransaction();
  }, [transactionId]);

   // Open popup
   const openPopup = (transaction) => {
    setSelectedTransaction(transaction);
    setUpdatedStatus(transaction.Status); // Pre-fill with current status
    setShowPopup(true);
  };

  // Close popup
  const closePopup = () => {
    setShowPopup(false);
    setSelectedTransaction(null);
    setUpdatedStatus('');
  };


  // Update transaction status
  const updateStatus = async () => {
    if (!selectedTransaction) return;

    try {
      const response = await axios.put(`http://localhost:7000/api/transaction/${selectedTransaction._id}`, {
        Status: updatedStatus,
      });
      // Update local state with the updated transaction
      setTransaction(response.data);
      closePopup();
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  

  return (
    <div className="transaction-page">

    <header className="book-details-header">
     <h2>Transaction Details</h2>
    </header>
      
      <div className="table-container wrapper">
        {!transaction && book?(<h2>No Transaction at this Moment</h2>):(         
            <table className="responsive-table">
          <thead>
            <tr>
              <th>Book Name</th>
              <th>Status</th>
              <th>Transaction Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{book?.Title}</td>
              <td>{transaction.Status}</td>
              <td>{new Date(transaction.TransactionDate).toLocaleDateString()}</td>
              <td>
                {transaction.OwnerID===localStorage.getItem('userId') && <button className="request-borrow-btn" onClick={() => openPopup(transaction)}>Update Status</button> }
              </td>
            </tr>
          </tbody>
        </table>) }
        
      </div>

        {showPopup && (
            <div className="modal popup-container">
            <div className="modal-content">
                <h2>Update Transaction Status</h2>
                <select
                value={updatedStatus}
                onChange={(e) => setUpdatedStatus(e.target.value)}
                >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Shipping">Shipping</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
                </select>
                <div className="modal-actions">
                <button className="request-borrow-btn" onClick={updateStatus}>Update</button>
                <button className="request-borrow-btn" onClick={closePopup}>Cancel</button>
                </div>
            </div>
            </div>
        )}

    </div>
  );
};

export default TransactionPage;
