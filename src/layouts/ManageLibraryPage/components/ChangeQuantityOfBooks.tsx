import React, { useEffect, useState } from 'react'
import BookModel from '../../../Model/BookModel'
import { Pagination } from '../../Utils/Pagination';
import { useOktaAuth } from '@okta/okta-react';

import { SpinnerLoading } from '../../Utils/SpinnerLoading';
import { ChangeQuantityOfBook } from './ChangeQuantityofBook';

function ChangeQuantityOfBooks() {

    const { authState } = useOktaAuth();
    const [books, setBooks] = useState<BookModel[]>([]);
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [deleteBook, setDeleteBook] = useState(false);
    const [httpError, setHttpError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [booksPerPage] = useState(5);
    
    function paginate(pageNumber:number) {
        setCurrentPage(pageNumber);
    }

    useEffect(() => {
        const fetchBook = async () => {
          
           
            const url = `${process.env.REACT_APP_API}/books?page=${currentPage - 1}&size=${booksPerPage}`;
          
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Something went wrong');
                }
                const responseJson = await response.json();
               
            setTotalAmountOfBooks(responseJson.page.totalElements);
            setTotalPages(responseJson.page.totalPages);

                const responseData = responseJson._embedded.books;
    
      setBooks(responseData);
              
                
      window.scrollTo(0, 0);
            setIsLoading(false);
        }
        fetchBook().catch((error: any) => {
            setHttpError(error.message);
            setIsLoading(false)
        })
       
    },[authState,deleteBook,currentPage])

    if (isLoading) {
        return(<SpinnerLoading/>)
    }
    if (httpError) {
        return (<div className='m-5 container text-danger'>{httpError }</div>)
    }
    
    const lastItem=booksPerPage * currentPage
    const indexOfFirstBook = lastItem - booksPerPage;
    

    function deleteBookfunc (){
        setDeleteBook(!deleteBook);
    }

  return (
    <div className='container mt-5'>
    {totalAmountOfBooks > 0 ?
        <>
            <div className='mt-3'>
                <h3>Number of results: ({totalAmountOfBooks})</h3>
            </div>
            <p>
                {indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks} items: 
            </p>
            {books.map(book => (
                <ChangeQuantityOfBook book={book} key={book.id} delete={deleteBookfunc}/>
            ))}
        </>
        :
        <h5>Add a book before changing quantity</h5>
    }
    {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}
</div>
  )
}

export default ChangeQuantityOfBooks