import { faPlus } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import "./css/faqadmin.css";
import FAQAdminQuestionComponent from './FAQAdminQuestionComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default class FAQAdminComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = { FAQs: null }
        this.printQuestions = this.printQuestions.bind(this);
        this.addNewFAQ = this.addNewFAQ.bind(this);
        this.printQuestions();
    }



    // Adds a new faq
    addNewFAQ = () => {
        let req = {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        }
        fetch("/api/faq", req)
            .then((response) => response.text())
            .then((response) => {
                this.printQuestions();
            });
    }

    // Prints all the faqs you get from quering the databased
    printQuestions = () => {

        let FAQs = [];

        fetch("/api/faq")
            .then((response) => response.json())
            .then((response) => {
                response.map((faq) => {
                    FAQs.push(
                        <FAQAdminQuestionComponent
                            id={faq.id}
                            question={faq.question}
                            answer={faq.answer}
                            onDelete={this.printQuestions}
                            onUpdate={this.props.update} />
                    );
                }
                );
                this.setState({ FAQs })
            });




    }

    render() {
        return (
            <div >
                <FontAwesomeIcon className="faq-admin-FAQ-add" onClick={() => { this.addNewFAQ() }} icon={faPlus} color='gray' />

                {this.state.FAQs}
            </div>
        )
    }
}
