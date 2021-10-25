import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import "./css/bookslist.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { useMediaQuery } from 'react-responsive'

const BooklistComponent = (props) => {

  const big = useMediaQuery({ minWidth: 1401 })
  const medium = useMediaQuery({ minWidth: 1101 })
  const small = useMediaQuery({ minWidth: 801 })

  const [currentFilter, setCurrentFilter] = useState("title");
  const [sorting, setSorting] = useState("asc");
  const [search, setSearch] = useState("");

  const [Books, setBooks] = useState([]);


  function setFilter(filter) {

    if (currentFilter == filter) { // same filter pressed
      setSorting((sorting == "asc") ? "desc" : "asc")
    }
    else {
      if (filter == "pages" || filter == "grade")
        setSorting("desc")
      else
        setSorting("asc")
      setCurrentFilter(filter);
    }
  }

  useEffect(() => {
    fetchReviewBooks();
  }, [sorting, currentFilter, search]);


  //Fetches the books from DB with filters and search
  const fetchReviewBooks = () => {
    fetch("/api/reviewedbooks?filter=" + currentFilter + "&sorting=" + sorting + "&search=" + search)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setBooks(response);
      });
  };


  function parseAuthors(authors) {
    var res = "";

    JSON.parse(authors).forEach(author => res += author + ", ");

    return res.slice(0, -2)
  }

  // Enables to route the clicks on a book to a new page
  const history = useHistory();

  return (
    <div className="bl-content-grid glassMorphism" >
      <div className="bl-searchbar">
        <span>Sök:</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Titel/Författare"
        />
      </div>

      <div className="bl-container-table">
        <table className="table bl-table">
          <thead>
            <tr className="bl-table-header">
              <th onClick={() => setFilter("title")} width="50%" scope="col">{currentFilter == "title" ? <FontAwesomeIcon icon={sorting == "desc" ? faCaretUp : faCaretDown} /> : ""}Titel</th>
              {small ? <th onClick={() => setFilter("author")} width="30%" scope="col">{currentFilter == "author" ? <FontAwesomeIcon icon={sorting == "desc" ? faCaretUp : faCaretDown} /> : ""}Författare</th> : ""}
              {big ? <th onClick={() => setFilter("pages")} width="10%" scope="col">{currentFilter == "pages" ? <FontAwesomeIcon icon={sorting == "desc" ? faCaretUp : faCaretDown} /> : ""}Sidor</th> : ""}
              {medium ? <th onClick={() => setFilter("grade")} width="10%" scope="col">{currentFilter == "grade" ? <FontAwesomeIcon icon={sorting == "desc" ? faCaretUp : faCaretDown} /> : ""}Snittbetyg</th> : ""}
            </tr>
          </thead>
          <tbody>
            {Books.map((listItem) => (
              <tr onClick={() => history.push('/books/' + listItem.id)}>
                <td>{listItem.title}</td>
                {small ? <td>{parseAuthors(listItem.author)}</td> : ""}
                {big ? <td>{listItem.pages}</td> : ""}
                {medium ? <td>{Math.round(listItem.grade)}/10</td> : ""}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BooklistComponent;
