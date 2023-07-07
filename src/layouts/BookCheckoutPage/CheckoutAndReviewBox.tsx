import { Link } from "react-router-dom"
import BookModel from "../../Model/BookModel"
import { LeaveAReview } from "../Utils/LeaveAReview"

export const CheckoutAndReviewBox: React.FC<{ book: BookModel | undefined, mobile: boolean, currentLoansCount: number, isAuthenticated: any, isCheckout: boolean,checkout:any,isReviewLeft:boolean,submitReview:any }> = (props) => {
 
    const reviewRender = () => {
        if (props.isAuthenticated) {
            if (props.isReviewLeft) {
                return(<p className="fw-bold text-primary">Thank You! For Your Review.</p>)
            } else {
                return (<p><LeaveAReview submitReview={props.submitReview} /></p>)
            }
        }
        else {
            return(<Link to={'/login'} className="btn btn-success btn-lg">Sign in</Link>)
        }
    }
    const buttonRender = () => {
        if (props.isAuthenticated) {
            if (props.currentLoansCount < 5 && !props.isCheckout) {
                return (<button onClick={() => 
                    props.checkout()
                } className="btn btn-success btn-lg"  >Checkout</button>)
            }
            else if (props.isCheckout) {
                return(<p className="text-primary"><b>Book check out.Enjoy!</b></p>)
            }
            else if (props.currentLoansCount >= 5 && !props.isCheckout) {
                return(<p className="text-danger">Too many books checked out</p>)
            }
        } else {
            return(<Link to={'/login'} className="btn btn-success btn-lg">Sign in</Link>)
        }
    }
    return (
        <div className={props.mobile ? 'card d-flex mt-5' : 'card col-3 container d-flex mb-5'}>
        <div className='card-body container'>
            <div className='mt-3'>
                <p>
                    <b>{props.currentLoansCount}/5 </b>
                    books checked out
                </p>
                <hr />
                {props.book && props.book.copiesAvailable && props.book.copiesAvailable > 0 ?
                    <h4 className='text-success'>
                        Available
                    </h4>
                    :
                    <h4 className='text-danger'>
                        Wait List
                    </h4>
                }
                <div className='row'>
                    <p className='col-6 lead'>
                        <b>{props.book?.copies} </b>
                        copies
                    </p>
                    <p className='col-6 lead'>
                        <b>{props.book?.copiesAvailable} </b>
                        available
                    </p>
                </div>
            </div>
            {buttonRender()}
            <hr />
            <p className='mt-3'>
                This number can change until placing order has been complete.
            </p>
            {reviewRender()}
        </div>
    </div>
    );
}