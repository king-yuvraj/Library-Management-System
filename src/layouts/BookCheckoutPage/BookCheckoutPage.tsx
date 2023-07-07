import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import BookModel from '../../Model/BookModel';
import ReviewModel from '../../Model/ReviewModel';
import { SpinnerLoading } from '../Utils/SpinnerLoading';
import { StarsReview } from '../Utils/StarReview';
import { CheckoutAndReviewBox } from './CheckoutAndReviewBox';
import { LatestReviews } from './LatestReviews';
import { useOktaAuth } from "@okta/okta-react/";
import { error } from 'console';
import ReviewRequestModel from '../../Model/ReviewRequestModel';



export function BookCheckoutPage() {


  const { authState } = useOktaAuth();

    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const params = useParams();
    const bookId = params.bookId;

  
  //Review States

  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [isLoadingReview, setIsLoadingReview] = useState(true);

  //Loans Count State
  const [currentLoansCount, setCurrentLoansCount] = useState(0);
  const [isLoadingcurrentLoansCount, setIsLoadingCurrentLoansCount] = useState(false);

  // Is book checked out
  const [isBookCheckedout, setIsBookCheckedout] = useState(false);
  const [isLoadingBookCheckedout, setIsLoadingBookCheckedout] = useState(true);

  // check review 
  const [isReviewLeft, setIsReviewLeft] = useState(false);
  const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

//load book
    useEffect(() => {
        const fetchBook = async () => {
          const baseUrl: string = `${process.env.REACT_APP_API}/books/${bookId}`;
          const response = await fetch(baseUrl);
    
          if (!response.ok) {
            throw new Error("Something went wrong!");
          }
    
          const responseJson = await response.json();
    
   
            const loadedBook: BookModel = {
                id: responseJson.id,
                title: responseJson.title,
                author:responseJson.author,
                description: responseJson.description,
                copies:responseJson.copies,
                copiesAvailable: responseJson.copiesAvailable,
                category: responseJson.category,
                img: responseJson.img,
            };
    
          setBook(loadedBook);
          setIsLoading(false);
        };
        fetchBook().catch((error: any) => {
          setIsLoading(false);
          setHttpError(error.message);
        });
    }, [checkoutBook]);
  
  //Payment
  const [displayError, setDisplayError] = useState(false);

  //load book reviews
  useEffect(
    () => {
      const fetchBookReviews = async () => {
        const reviewUrl: string = `${process.env.REACT_APP_API}/reviews/search/findByBookId?bookId=${bookId}`;
       
        const reponseReview = await fetch(reviewUrl);
        if (!reponseReview.ok) {
          throw new Error("Something Went Wrong");
        }
        const responseJsonReviews = await reponseReview.json();
        const responseData = responseJsonReviews._embedded.reviews;
        const loadedReview: ReviewModel[] = [];

        let weightedStarReviews: number = 0;
        for (const key in responseData) {
          loadedReview.push({
            id: responseData[key].id,
            userEmail: responseData[key].userEmail,
            date: responseData[key].date,
            rating: responseData[key].rating,
            book_id: responseData[key].bookId,
            reviewDescription: responseData[key].reviewDescription
          });
          weightedStarReviews = weightedStarReviews + responseData[key].rating
        }
        if (loadedReview) {
          const round = (Math.round((weightedStarReviews / loadedReview.length) * 2) / 2).toFixed(1);
          setTotalStars(Number(round))
        }
        setReviews(loadedReview);
        setIsLoadingReview(false);
      };
      fetchBookReviews().catch((error: any) => {
        setIsLoadingReview(false);
        setHttpError(error.message);
      })
    }, []
  );
  
// load current loaned book of the loged in user
  useEffect(() => {
    const fetchUserCurrentLoansCount = async () => {
        if (authState && authState.isAuthenticated) {
            const url = `${process.env.REACT_APP_API}/books/secure/currentloans/count`;
            const requestOptions = {
                method: 'GET',
                headers: { 
                    Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                 }
            };
            const currentLoansCountResponse = await fetch(url, requestOptions);
            if (!currentLoansCountResponse.ok)  {
                throw new Error('Something went wrong!');
            }
            const currentLoansCountResponseJson = await currentLoansCountResponse.json();
            setCurrentLoansCount(currentLoansCountResponseJson);
        }
        setIsLoadingCurrentLoansCount(false);
    }
    fetchUserCurrentLoansCount().catch((error: any) => {
        setIsLoadingCurrentLoansCount(false);
        setHttpError(error.message);
    })
  },[authState,checkoutBook]);
  
  //load book is checked out
  useEffect(() => {
    const checkBookIsCheckedout = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${process.env.REACT_APP_API}/books/secure/ischeckedout/byuser?bookId=${bookId}`;
        const requestOption = {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            'Content-Type': 'application/Json'
          }
        };
        const isBookCheckedoutResponse = await fetch(url, requestOption);
        if (!isBookCheckedoutResponse.ok) {
          throw new Error('Something Whent Wrong');
        }
        const isBookCheckedoutJson = await isBookCheckedoutResponse.json();
        setIsBookCheckedout(isBookCheckedoutJson);
       
      }
      setIsLoadingBookCheckedout(false);
    }
    checkBookIsCheckedout().catch((error: any) => {
      setHttpError(error.message);
      setIsLoadingBookCheckedout(false);
    })
  }, [authState])
  
  //load user review
  useEffect(() => {
    const fetchUserReview = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${process.env.REACT_APP_API}/reviews/secure/user/Book?bookId=${bookId}`
        const requestOption = {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            'Content-Type': 'application/Json'
          }
        }
        const userReviewResponse = await fetch(url, requestOption);
        if (!userReviewResponse.ok) {
          throw new Error('Something went wrong');
        }
        const userReviewJson = await userReviewResponse.json();
        setIsReviewLeft(userReviewJson)
      
      }
      setIsLoadingUserReview(false);
    }
    fetchUserReview().catch((error: any) => {
      setHttpError(error.message);
      setIsLoadingUserReview(false); 
    })
  })
  
  async function checkoutBook() {

  const url = `${process.env.REACT_APP_API}/books/secure/checkout/?bookId=${book?.id}`;
  const requestOptions = {
      method: 'PUT',
      headers: {
          Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
          'Content-Type': 'application/json'
      }
  };
  const checkoutResponse = await fetch(url, requestOptions);
    if (!checkoutResponse.ok) {
      setDisplayError(true);
      throw new Error('Something went wrong!');
    }
    setDisplayError(false);
  setIsBookCheckedout(true);
  }

  async function submitReview(starInput: number, reviewDescription: String) {
    let bookId: number = 0;
    if (book?.id) {
      bookId = book.id;
    }
    const reviewRequest = new ReviewRequestModel(starInput, bookId, reviewDescription);
    const url = `${process.env.REACT_APP_API}/reviews/secure`;
    const requestOption = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authState?.accessToken?.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reviewRequest)
    };
    const returnResponse = await fetch(url, requestOption);
    if (!returnResponse.ok) {
      throw new Error("Something went wrong");
    }
    setIsReviewLeft(true);

  }

      if (isLoading || isLoadingReview ||isLoadingcurrentLoansCount || isLoadingBookCheckedout ||isLoadingUserReview) {
        return <SpinnerLoading />;
      }
      if (httpError) {
        return (
          <div className="container m-5">
            <p>{httpError}</p>
          </div>
        );
  }
 
    return (
      <div>
        <div className='container d-none d-lg-block'>
          {displayError && <div className='alert alert-anger mt-3' role='alert'> Please pay outstanding fees and/orreturn late book(s)</div>}
          
          <div className='row mt-5'>
              <div className='col-sm-2 col-md-2'>
                  {book?.img ?
                      <img src={book?.img} width='226' height='349' alt='Book' />
                      :
                      <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226'
                          height='349' alt='Book' />
                  }
              </div>
              <div className='col-4 col-md-4 container'>
                  <div className='ml-2'>
                      <h2>{book?.title}</h2>
                      <h5 className='text-primary'>{book?.author}</h5>
                      <p className='lead'>{book?.description}</p>
                      <StarsReview rating={totalStars} size={32} />
                  </div>
              </div>
            <CheckoutAndReviewBox book={book} mobile={false} currentLoansCount={currentLoansCount} isAuthenticated={authState?.isAuthenticated
            } isCheckout={isBookCheckedout} checkout={checkoutBook} isReviewLeft={isReviewLeft} submitReview={submitReview}/>
          </div>
          <hr />
          <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
        </div>
        
        {/* //Mobile  */}

        <div className='container d-lg-none mt-5'>
        {displayError && <div className='alert alert-danger mt-3' role='alert'> Please pay outstanding fees and/orreturn late book(s)</div>}
          <div className='d-flex justify-content-center alighn-items-center'>
              {book?.img ?
                  <img src={book?.img} width='226' height='349' alt='Book' />
                  :
                  <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226'
                      height='349' alt='Book' />
              }
          </div>
          <div className='mt-4'>
              <div className='ml-2'>
                  <h2>{book?.title}</h2>
                  <h5 className='text-primary'>{book?.author}</h5>
                  <p className='lead'>{book?.description}</p>
                  <StarsReview  rating={totalStars} size={32} />
              </div>
          </div>
          <CheckoutAndReviewBox book={book} mobile={true} currentLoansCount={currentLoansCount} isAuthenticated={authState?.isAuthenticated
            } isCheckout={isBookCheckedout } checkout={checkoutBook} isReviewLeft={isReviewLeft} submitReview={submitReview}/>
          <hr />
          <LatestReviews reviews={reviews} bookId={book?.id} mobile={true} />
      </div>
  </div>
  )
}


