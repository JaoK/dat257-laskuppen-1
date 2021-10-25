import React, { useEffect, useState } from "react";
import { useMediaQuery } from 'react-responsive';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import "./css/toplistpage.css";

const ToplistPage = () => {
    const [points, setPoints] = useState(0);
    const [topReaderOfWeek, settopReaderOfWeek] = useState([]);
    const [topWeeklyBook, setTopWeeklyBook] = useState([]);
    const [topList, setTopList] = useState([]);
    const [recBook, setRecBook] = useState([]);
    const [filter, setFilter] = useState("points");
    const [order, setOrder] = useState("desc");

    const big = useMediaQuery({ minWidth: 701 })
    const medium = useMediaQuery({ minWidth: 401 })


    useEffect(() => {
        let response = fetchData("/api/toplist?filter=points&order=desc")
        response.then(response => { settopReaderOfWeek(response[0]); setTopList(response) })
        response = fetchData("/api/mostreadbook")
        response.then(response => { setTopWeeklyBook(response[0])})
        response = fetchData("/api/userpoints")
        response.then(response => { setPoints(response[0].points); })
        fetchRec();
    }, []);

    useEffect(() =>{
        console.log("/api/toplist?filter=" + filter + "&order=" + order)
        let response = fetchData("/api/toplist?filter=" + filter + "&order=" + order)
        console.log(response)
    response.then(response => { setTopList(response) })
    },[filter,order])

    const handleClick = (newFilter, newOrder) => {
        if(newFilter == filter){
            setOrder((order == "desc") ? "asc" : "desc" )
        }else{
            setFilter(newFilter)
            setOrder(newOrder)
        }
        
    }
    
    const fetchData = (query) => {
        let req = { method: "GET", headers: { "Content-Type": "application/json" }, };
        return fetch(query, req).then((response) => response.json())
    }

  const fetchRec = () => {
    fetch("/api/recommendation")
      .then((response) => response.json())
      .then((response) => {
        setRecBook(response[0]);
      });
  }

  const history = useHistory();


    return (
        <div className="main-page-general-styling">
            <div className="main-page-header glassMorphism">
                <h2> Topplista </h2>
            </div>
            <div className="main-page-inner-container">
                <div className="top-page-content">
                    <div className="top-top-reader-card glassMorphism">
                        <p className="top-card-title"> Veckans toppläsare </p>
                        <hr />
                        <p className="top-card-text">
                           {(topReaderOfWeek) ? topReaderOfWeek.name +':'+ topReaderOfWeek.points : null}
                        </p>
                    </div>

                    

                    <div className="top-top-book-card glassMorphism">
                        <p className="top-card-title">Bokrekommendation</p>
                        <hr />
                        
                            {(topWeeklyBook) ? <div onClick={() => history.push('/books/' + topWeeklyBook.id)} className="top-inner-recommendation">
                            <div className="cbc-book-title">Titel: {recBook.title}</div>
                            <div className="cbc-book-author">Författare: {recBook.author}</div>
                            <div className="cbc-book-pages">Sidor: {recBook.pages}</div>
                            <div className="cbc-book-img">
                                <img size= '1g' src={(recBook.thumbnail) ? ((recBook.thumbnail.thumbnail) ? recBook.thumbnail.thumbnail : recBook.thumbnail): "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/No_image_available_450_x_600.svg/450px-No_image_available_450_x_600.svg.png"} />
                            </div>
                            </div>

:<div className="top-inner-recommendation"></div>}
                        
                    </div>

                    <div className="top-my-points glassMorphism">
                        <p className="top-card-title"> Mina poäng </p>
                        <hr />
                        <p className="top-card-text"> {points} </p>
                    </div>

                    <div className="top-my-recommendation glassMorphism">
                        <p className="top-card-title">Bokrekommendation</p>
                        <hr />
                        
                            {(recBook) ? <div onClick={() => history.push('/books/' + recBook.id)} className="top-inner-recommendation">
                            <div className="cbc-book-title">Titel: {recBook.title}</div>
                            <div className="cbc-book-author">Författare: {recBook.author}</div>
                            <div className="cbc-book-pages">Sidor: {recBook.pages}</div>
                            <div className="cbc-book-img">
                                <img size= '1g' src={(recBook.thumbnail) ? ((recBook.thumbnail.thumbnail) ? recBook.thumbnail.thumbnail : recBook.thumbnail): "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/No_image_available_450_x_600.svg/450px-No_image_available_450_x_600.svg.png"} />
                            </div>
                            </div>

:<div className="top-inner-recommendation"></div>}
                        
                    </div>

                    <div className="top-top-lists glassMorphism">
                        <div className="top-tableDiv">
                            <table class="table table-holder">
                                <thead>
                                    <tr>
                                        <th onClick = {() => handleClick("name","asc")}  scope="col"> {filter == "name" ? <FontAwesomeIcon icon={order == "asc" ? faCaretUp : faCaretDown} /> : ""} Elev</th>
                                        {medium ? <th onClick = {() => handleClick("classname","desc")} scope="col"> {filter == "classname" ? <FontAwesomeIcon icon={order == "desc" ? faCaretUp : faCaretDown} /> : ""} Klass</th> : ""}
                                        <th onClick = {() => handleClick("points","desc")} scope="col"> {filter == "points" ? <FontAwesomeIcon icon={order == "desc" ? faCaretUp : faCaretDown} /> : ""} Poäng</th>
                                        {big ? <th onClick = {() => handleClick("booksread","desc")} scope="col"> {filter == "booksread" ? <FontAwesomeIcon icon={order == "desc" ? faCaretUp : faCaretDown} /> : ""} Lästa böcker</th> : ""}
                                    </tr>
                                </thead>
                                <tbody>
                                    {topList.map((listItem) => (
                                        <tr>
                                            <td>{listItem.name}</td>
                                            {medium ? <td>{listItem.classname} </td>: ""}
                                            <td>{listItem.points}</td>
                                            {big ? <td>{listItem.booksread}</td>:""}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ToplistPage;
