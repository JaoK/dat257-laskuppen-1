import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSave } from '@fortawesome/free-solid-svg-icons';


const FAQAdminQuestionComponent = (props) => {

    const [answer, setAnswer] = useState(props.answer);
    const [question, setQuestion] = useState(props.question);

    const [hasChanged, setChanged] = useState(false);


    // Deletes FAQ through a query
    const delFAQ = (id) => {
        if (window.confirm("Är du säker?")) {
            let req = { method: "DELETE", headers: { "Content-Type": "application/json" } }
            fetch("/api/faq/" + id, req).then((response) => response.text())
                .then((response) => {
                    props.onDelete();
                });

            props.onUpdate();
        }
    }

    const updateFAQ = (id) => {
        setChanged(false);
        let req = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, question, answer })
        }
        fetch("/api/faq", req)
            .then((response) => response.text())
            .then((response) => {
                props.onUpdate();
            });
    }

    return (
        <div className="faq-admin-FAQ glassMorphism">
            <div className="faq-admin-FAQ-text ">

                <input className={(hasChanged) ? "faq-admin-FAQ-changed " : "faq-admin-FAQ-saved "} value={question} type="text" name="question" onChange={(e) => {
                    setQuestion(e.target.value)
                    setChanged(true);
                }} />
                <br />
                <input className={(hasChanged) ? "faq-admin-FAQ-changed " : "faq-admin-FAQ-saved "} value={answer} type="text" name="answer" onChange={(e) => {
                    setAnswer(e.target.value)
                    setChanged(true);
                }} />
            </div>
            <div className="faq-admin-FAQ-buttons ">
                <FontAwesomeIcon className="faq-admin-FAQ-trash " onClick={() => { delFAQ(props.id) }} icon={faTrash} color='gray' />
                <FontAwesomeIcon className="faq-admin-FAQ-save " onClick={() => { updateFAQ(props.id) }} icon={faSave} color='gray' />
            </div>
        </div>
    )

}


export default FAQAdminQuestionComponent;
