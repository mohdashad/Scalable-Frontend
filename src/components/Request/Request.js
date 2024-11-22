import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link,useNavigate  } from 'react-router-dom';
import requestApi from './../Interceptor/requestApi'; 
import bookApi from './../Interceptor/bookApi';
import userApi from './../Interceptor/userApi';



const Request = () => {
  
  const [requestWithBook, setRequestWithBook] = useState([]);
  const [ transactionDetails  , setTransactionDetails] = useState(null);
  const navigate = useNavigate(); 
  
  useEffect(() => {
    const userId=localStorage.getItem('userId');
    console.log('-----------------------'+userId);
    const getRequests = async () => {
      try {
        const response = await requestApi.get(`/user/${userId}`);
        
        
        console.log('------requests'+JSON.stringify(response.data));
       
         // Extract Book IDs from the request objects
         const bookIds = response.data.map((req) => req.BookID);
         const requestedByIds = response.data.map((req) => req.RequestedBy);
         
         console.log('------bookIds'+JSON.stringify(bookIds)); 
           
         const requestBody = {
          ids: bookIds
          };
         // Make API call to fetch books by IDs
         const bookResponse =await bookApi.post('/by-ids',requestBody); //await axios.post('http://localhost:4000/api/books/by-ids', { ids: bookIds });
         const books = bookResponse.data;
         const requestedByBody={
          ids: requestedByIds
          };
         const userResponse =await userApi.post('/by-ids',requestedByBody); 
         const users = userResponse.data;
         console.log('------books'+JSON.stringify(books));
         // Map books to their corresponding request object
         /*
         const combinedList = books.map((book) => {
             const correspondingRequest = response.data.find((req) => req.BookID === book._id);
             return {
                 book,
                 request: correspondingRequest,
             };
         });
          */
         const requestList=response.data;
         const combinedList = requestList.map((request) => {
          const correspondingBook = books.find((book) => request.BookID === book._id);
          const correspondingUser = users.find((user) => request.RequestedBy === user._id);
          return {
              request,
              book: correspondingBook,
              requestedBy:correspondingUser
          };
        });
         console.log('------combinedList'+JSON.stringify(combinedList));
         setRequestWithBook(combinedList);
        
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    getRequests();
  }, []);

  const handleApprove = async (requestId) => {
    try {
      await requestApi.put(`/${requestId}`, { status: 'Accepted' });  
      // Update the combined list state
      setRequestWithBook((prev) =>
        prev.map((item) =>
            item.request._id === requestId
                ? {
                      ...item,
                      request: { ...item.request, Status: 'Accepted' }, // Update the Status field in the request object
                  }
                : item
        )
    );    
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await requestApi.put(`/${requestId}`, { status: 'Rejected' });
      // Update the combined list state
      setRequestWithBook((prev) =>
        prev.map((item) =>
            item.request._id === requestId
                ? {
                      ...item,
                      request: { ...item.request, Status: 'Rejected' }, // Update the Status field in the request object
                  }
                : item
        )
      );
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const handleFetchTransaction = async (transactionId) => {


    navigate(`/transaction/${transactionId}`);
    /*
    try {
      const response = await axios.get(`http://localhost:5000/api/transaction/request/${exchangeRequestId}`);
      setTransactionDetails(response.data); // Store the transaction details
    } catch (error) {
      console.error('Error fetching transaction:', error);
      setTransactionDetails(null);
    }
      */
  };

  return (
    <section className="borrowable-books-list">
    <header className="user-hero-section">
    <h1>Your Request</h1>
    
    </header>
        <div className="wrapper">
    <div>
      
      <table className="responsive-table">
        <thead>
          <tr>
            <th>Book</th>
            <th>Requested By</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requestWithBook.map((rb) => (
            rb.book &&
            <tr key={rb.request._id}>
              <td>{rb.book?.Title}</td>
              <td>{rb.requestedBy?.Name}</td>
              <td>{rb.request.Status}</td>
              <td>
                {
                rb.request.Status === 'Pending' && rb.book?.OwnerID===localStorage.getItem('userId')? (                  <>
                    <button className="request-borrow-btn" onClick={() => handleApprove(rb.request._id)}>Approve</button>
                    <button className="request-borrow-btn" onClick={() => handleReject(rb.request._id)}>Reject</button>
                  </>
                    )  :( <button className="request-borrow-btn" onClick={() => handleFetchTransaction(rb.request._id)}>Manage Transaction</button>)                
                
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {transactionDetails && transactionDetails.TransactionDate }
    {transactionDetails &&   transactionDetails.Status}
    </div>
    </section>
  );
};

export default Request;
