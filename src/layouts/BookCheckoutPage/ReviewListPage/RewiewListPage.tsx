import { useEffect, useState } from "react";
import ReviewModel from "../../../Model/ReviewModel"
import { useParams } from "react-router-dom";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Review } from "../../Utils/Review";
import { Pagination } from "../../Utils/Pagination";

export const ReviewListPage = () => {

    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewsPerPage] = useState(5);
    const [totalAmountOfReviews, setTotaAmountOfReview] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

   
    const params = useParams();
    const bookId = params.bookId;

    useEffect(() => {
        const fetchReviews = async () => {
            // const baseurl = ;
            const url = `${process.env.REACT_APP_API}/reviews/search/findByBookId?bookId=${bookId}&page=${currentPage - 1}&size=${reviewsPerPage}`;
            const response = await fetch(url);


            if (!response.ok) {
                throw new Error('Something went wrong');
            }

            const reviewJson = await response.json();
            const responseData = reviewJson._embedded.reviews;
            setTotaAmountOfReview(reviewJson.page.totalElements);
            setTotalPages(reviewJson.page.totalPages)

            setReviews(responseData);
            setIsLoading(false);
        }
        fetchReviews().catch((error: any) => {
            setHttpError(error.message);
            setIsLoading(false);
        })
    }, [currentPage]); 
    
    if (isLoading) {
       return(<SpinnerLoading/>)
    }
    if (httpError) {
        return (<div className="container m-5">
            <p className="text-danger">{httpError }</p>
        </div>)
    }
   
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;

    let lastItem = currentPage * reviewsPerPage <= totalAmountOfReviews ? currentPage * reviewsPerPage : totalAmountOfReviews;

    const paginate = (pageNumber: number) => { setCurrentPage(pageNumber) };

    return (
        <div className="container mt-5">
            <div>
                <h3>Comments: ({reviews.length})</h3>
            </div>
            <p>
                {indexOfFirstReview + 1} to {lastItem} of {totalAmountOfReviews} items:
            </p>
            <div className="row">
                {reviews.map(review => (
                    <Review review={review} key={review.id} />
                ))}
            </div>

            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
        </div>
    );

}