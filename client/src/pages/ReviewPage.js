import React from 'react';
import MakeReviewComponent from '../components/MakeReviewComponent';
import ChooseBookComponent from '../components/ChooseBookComponent';

export default class ReviewPage extends React.Component {

    constructor(props) {
        super();
        this.state = { book: null };
        this.setBook = this.setBook.bind(this);

        
            
        

    }

    
    componentDidMount(){
        console.log("MOUNT")
        if(this.props.match.params.id > 0){
            console.log(this.props.match.params.id)

            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            };
    
            fetch("/api/getbook/".concat(this.props.match.params.id), requestOptions).then(response => response.json()).then(response => {
                this.setBook(response[0]);
            }
            );
            
        }
    }

    setBook(book){
        console.log(book)
        this.setState({book:book});
    }

    render() {
        return (
            
            <div className="main-page-general-styling">
            <div className="main-page-header glassMorphism">
                <h2> {(this.state.book == null) ? "Välj bok" : "Skriv Recension"} </h2> 
            </div>
            <div className="main-page-inner-container">
                {(this.state.book == null) ? <ChooseBookComponent setBook={this.setBook}/> : <MakeReviewComponent book={this.state.book}/>}
            </div>
        </div>
        )
    }
}
