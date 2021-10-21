import { faCogs } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import fetch from 'node-fetch';
import React, { useEffect, useState } from 'react';
import FAQAdminComponent from '../components/FAQAdminComponent';
import FAQCardComponent from '../components/FAQCardComponent';
import "./css/faqpage.css";

const FAQPage = (props) => {

    const [FAQs, setFAQs] = useState([]);
    const [admin, setAdmin] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        printQuestions();
        getSession()
    }, [])

    const printQuestions = () => {
        let FAQs = [];

        fetch("/api/faq")
            .then((response) => response.json())
            .then((response) => {
                response.map((faq) => {
                    if (faq.question && faq.answer) {
                        FAQs.push(
                            <FAQCardComponent
                                question={faq.question}
                                answer={faq.answer} />
                        );
                    }
                }
                );
                setFAQs(FAQs)
            });
    }

    const getSession = () => {
        fetch("/api/session")
            .then((response) => response.json())
            .then((response) => {
                if (response.role == 3)
                    setIsAdmin(true);
            });
    }

    const changeAdmin = () => {
        setAdmin(!admin);
    }

    return (
        <div className="main-page-general-styling">
            <div className="main-page-header glassMorphism">
                <h2 className="faq-header"> FAQ </h2> <h2 className="faq-cogs"> {(isAdmin) ? <FontAwesomeIcon onClick={() => { changeAdmin() }} icon={faCogs} /> : ""} </h2>
            </div>
            <div className="main-page-inner-container">
                <div className="main-page-content faq-page-content glassMorphism">
                    {(admin) ? <FAQAdminComponent update={printQuestions} /> : FAQs}

                </div>
            </div>
        </div>
    )
}


export default FAQPage;