import './css/makereview.css';
import Reward from 'react-rewards'
import React, { useState } from 'react';
import { Redirect } from "react-router-dom";

const useFormHook = (formValues) => {
    const [values, handleChange] = useState(formValues);

    return [values, e => {
        handleChange({
            ...values,
            [e.target.name]: e.target.value
        });
    }];
};

const MakeReviewComponent = (props) => {

    var reward;
    const press = () => {
        for (let attr in values) {
            if(attr == "desc")
                continue
            if (values[attr] == null || values[attr] == "") { // WRONG INPUT
                reward.punishMe();
                return false;
            }
        }

        reward.rewardMe();
        submitForm();

    }

    const [submitted,handleSubmit] = useState(false)
    
    const [values, handleChange] = useFormHook({
        title: props.book.title,
        grade: null,
        recommended: null,
        author: props.book.author,
        pages: props.book.pages,
        thumbnail: props.book.thumbnail,
        desc: (props.book.desc) ? props.book.desc : "Ingen beskrivning tillgänglig.",
        review: null,
    });

    function submitForm(e) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values)
        };

         fetch("/api/submitreview", requestOptions).then(response => response.json()).then(response => {
            setTimeout(()=>{handleSubmit(true)},1000);
        })

        
    }

    return (
        <div className="mrc-page-content">
            {(submitted) ? <Redirect to="/toplist"/> : null}
            <div className="mrc-B glassMorphism">
                <div className="mrc-score">
                    <p> Betyg </p>
                    <input name="grade" type='number' value={values.grade} onChange={(e) => {
                        var val = e.target.value;
                        if (val > 10 || val < 1)
                            return;
                        handleChange(e);
                    }} />
                </div>
                <div className="mrc-likeable">
                    <p> Läsvärd </p>
                    <input name="recommended" type='radio' value={true} onChange={handleChange} />Ja--
                        <input name="recommended" type='radio' value={false} onChange={handleChange} />Nej
                        </div>
            </div>
            <div className="mrc-C glassMorphism">
                <div className="mrc-title">
                    <p> Titel </p>
                    <input name="title" type='text' value={values.title} onChange={handleChange} />
                </div>
                <div className="mrc-author">
                    <p> Författare </p>
                    <input name="author" type='text' value={values.author} onChange={handleChange} />
                </div>
                <div className="mrc-pages">
                    <p> Sidor </p>
                    <input name="pages" type='number' value={values.pages} onChange={handleChange} min={0} />
                </div>
                <div className="mrc-pic">
                    <img src={values.thumbnail.thumbnail || values.thumbnail}/>

                </div>
            </div>
            <div className="mrc-D glassMorphism">
                <p> Recension </p>
                <textarea name="review" type='text' value={values.review} placeholder="Skriv här!" onChange={handleChange} />
                <Reward ref={ref => { reward = ref }} type='confetti'>
                    <button className="btn btn-success" onClick={press}>Skicka</button>
                </Reward>
            </div>
            
        </div>

    )
}


export default MakeReviewComponent;

